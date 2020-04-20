from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models.fields import IntegerField
from django.db.models.functions import Concat, Substr, Cast
from django.db.models.deletion import ProtectedError
from django.db.models import CharField
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
import re, requests, io
from django.http import FileResponse, HttpResponse
# API
from rest_framework import viewsets

from ass_man.serializers.asset_serializers import AssetSerializer, AssetFetchSerializer, AssetShortSerializer, \
    AssetSeedForGraphSerializer
from ass_man.serializers.model_serializers import UniqueModelsSerializer
from ass_man.serializers.blade_serializer import BladeServerSerializer

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# Project
from ass_man.models import Model, Asset, Rack, Datacenter, Network_Port, Power_Port, PDU, Asset_Number, Decommissioned, BladeServer
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend
from ass_man.filters import AssetFilter, AssetFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json
from ass_man.import_manager import import_asset_file, import_network_port_file
from ass_man.export_manager import export_assets, export_network_ports
from ass_man.network_port_jsonify import restructure_net_port_data

# CHANGE THIS FOR PRODUCTION
NETWORX_PORT = ":8004"
NETWORX_GET_ROOT_URL = "http://hyposoft-mgt.colab.duke.edu{}/pdu.php".format(NETWORX_PORT)
NETWORX_POST_URL = "http://hyposoft-mgt.colab.duke.edu{}/power.php".format(NETWORX_PORT)

JSON_TRUE = 'true'
ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'

ASSET_ORDERING_FILTERING_FIELDS = ['model', 'datacenter', 'model__model_number', 'model__vendor',
                                   'hostname', 'rack', 'rack_u', 'owner', 'asset_number']


class AssetViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            if IsAdminUser:
                try:
                    user = User.objects.get(username=self.request.user.username)
                    if self.action is not 'create':
                        permission_classes = [IsAuthenticated]
                        return [permission() for permission in permission_classes]
                        # datacenter = self.get_object().datacenter
                    else:
                        datacenter_url = self.request.data.get('datacenter')
                        datacenter = Datacenter.objects.all().get(pk=datacenter_url[-2])
                    if user.is_superuser or user.is_staff or user.permission_set.get(name='global-asset', user=user) or user.permission_set.get(name='asset', datacenter=datacenter):
                        permission_classes = [IsAuthenticated]
                except:
                    permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Asset.objects.all() \
        .annotate(rack_letter=Substr('rack__rack_number', 1, 1)) \
        .annotate(numstr_in_rack=Substr('rack__rack_number', 2))
    queryset = queryset.annotate(number_in_racknum=Cast('numstr_in_rack', IntegerField()))

    def get_serializer_class(self):
        if self.request.method == GET:
            serializer_class = AssetFetchSerializer if self.detail else AssetShortSerializer
        else:
            serializer_class = AssetSerializer
        return serializer_class

    def get_serializer_context(self):
        context = super(AssetViewSet, self).get_serializer_context()
        try:
            network_ports_json = self.request.data["network_ports"]
        except KeyError:
            network_ports_json = None
        context["network_ports"] = network_ports_json
        try:
            power_ports_json = self.request.data["power_ports"]
        except KeyError:
            power_ports_json = None
        context["power_ports"] = power_ports_json
        return context

    ordering_fields = ASSET_ORDERING_FILTERING_FIELDS
    ordering = ['rack_letter', 'number_in_racknum', 'rack_u']
    filterset_fields = ASSET_ORDERING_FILTERING_FIELDS

    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend,
                       AssetFilterByRack]
    filterset_class = AssetFilter

    # Overriding of super functions

    def reformat_mac_address(self, mac):
        if not mac:
            return mac
        mac_search = re.search(
            '([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})',
            mac.lower())
        reformatted = '{}:{}:{}:{}:{}:{}'.format(mac_search.group(1), mac_search.group(2), mac_search.group(3),
                                                 mac_search.group(4), mac_search.group(5), mac_search.group(6))
        return reformatted

    def get_port_jsons(self, request):
        try:
            network_ports_json = request.data["network_ports"]
        except KeyError:
            network_ports_json = {}
        try:
            power_ports_json = request.data["power_ports"]
        except KeyError:
            power_ports_json = {}
        return network_ports_json, power_ports_json

    def cru_network_ports(self, request, asset, network_ports_json):
        for i in network_ports_json:
            try:
                connection_port = Network_Port.objects.get(pk=i['connection']['network_port_id']) if i[
                    'connection'] else None
            except (ObjectDoesNotExist, KeyError) as e:
                connection_port = None
            try:
                reformatted_mac = self.reformat_mac_address(i['mac'])
            except KeyError:
                reformatted_mac = ''
            try:  # Distinguish between creation and updating
                port = asset.network_port_set.get(name=i['name'])  # Updating existing port

                port.mac = reformatted_mac  # update mac address

                # clear its old connection
                old_conn_port = port.connection

                if old_conn_port:
                    old_conn_port.connection = None
                    old_conn_port.save()

                # put new connection on this port
                port.connection = connection_port
                port.save()

            except (ObjectDoesNotExist, KeyError):  # Create new port
                port = Network_Port.objects.create(name=i['name'], mac=reformatted_mac, connection=connection_port,
                                                   asset=asset)

            # update destination port
            if connection_port:
                connection_port.connection = port
                connection_port.save()
        return

    def cru_power_ports(self, request, asset, power_ports_json):
        for i in power_ports_json:
            try:
                pdu = PDU.objects.get(name=i['pdu'])
            except (PDU.DoesNotExist, KeyError):
                pdu = None

            port_num_a = i.get('port_number')
            if port_num_a:
                port_num = int(port_num_a)

            try:
                pp = asset.power_port_set.get(id=i['id'])
                if not pdu or not port_num_a:
                    pp.pdu = None
                    pp.port_number = None
                    pp.save()
                    continue
                if (pp.pdu != pdu or pp.port_number != port_num):
                    pp.pdu = pdu
                    pp.port_number = port_num
                    pp.save()
            except(Power_Port.DoesNotExist, KeyError):
                pp = Power_Port.objects.create(pdu=pdu, port_number=port_num, asset=asset)
        if not power_ports_json and request.method == 'POST':
            num_ports = asset.model.power_ports if asset.model.power_ports else 0
            for i in range(num_ports):
                Power_Port.objects.create(pdu=None, asset=asset)
        return

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        asset = serializer.save()
        network_ports_json, power_ports_json = self.get_port_jsons(request)
        self.cru_network_ports(request, asset, network_ports_json)
        self.cru_power_ports(request, asset, power_ports_json)
        # asset.save()
        # asset.datacenter.asset_set.add(asset)
        rack = asset.rack
        if rack:
            for i in range(asset.rack_u, asset.rack_u + asset.model.height):
                exec('rack.u{} = asset'.format(i))
            rack.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        asset = self.get_object()
        prev_rack = asset.rack
        prev_rack_u = asset.rack_u
        serializer = self.get_serializer(asset, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        if prev_rack:
            for i in range(prev_rack_u, prev_rack_u + asset.model.height + 1):
                exec('prev_rack.u{} = None'.format(i))
            prev_rack.save()
        self.perform_update(serializer)
        asset = self.get_object()
        new_rack = asset.rack
        if new_rack:
            for i in range(asset.rack_u, asset.rack_u + asset.model.height):
                exec('new_rack.u{} = asset'.format(i))
            new_rack.save()
        network_ports_json, power_ports_json = self.get_port_jsons(request)
        self.cru_network_ports(request, asset, network_ports_json)
        self.cru_power_ports(request, asset, power_ports_json)
        if getattr(asset, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the asset.
            asset._prefetched_objects_cache = {}
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        if request.query_params.get('offline') == 'true':

            queryset = self.filter_queryset(Asset.objects.all().annotate(rack_letter=Cast('asset_number', CharField()))
                                            .annotate(numstr_in_rack=Cast('asset_number', CharField()))
                                            .annotate(number_in_racknum=Cast('asset_number', IntegerField()))
                                            .exclude(datacenter__is_offline=False))
            # Asset.objects.all() \
            #     .annotate(rack_letter=Substr('rack__rack_number', 1, 1)) \
            #     .annotate(numstr_in_rack=Substr('rack__rack_number', 2))
            # queryset = queryset.annotate(number_in_racknum=Cast('numstr_in_rack', IntegerField()))
            # self.filter_queryset(self.get_queryset())
            if request.query_params.get('export') == 'true':
                if request.query_params.get('np') == 'true':
                    return export_network_ports(queryset)
                return export_assets(queryset)

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        if not request.query_params.get('offline') == 'true':
            queryset = self.filter_queryset(self.get_queryset()).exclude(datacenter__is_offline=True)
            if request.query_params.get('export') == 'true':
                queryset = self.filter_queryset(self.get_queryset())
                if request.query_params.get('np') == 'true':
                    return export_network_ports(queryset)
                return export_assets(queryset)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        if request.query_params.get('export') == 'true':
            queryset = self.filter_queryset(self.get_queryset())
            if request.query_params.get('np') == 'true':
                return export_network_ports(queryset)
            return export_assets(queryset)

        return super().list(self, request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if self.request.query_params.get('decommissioned')=='true':
            graph_serializer = AssetSeedForGraphSerializer(self.get_object(), context={'request': request})
            newresp = restructure_net_port_data(graph_serializer)
            serialized_asset = AssetFetchSerializer(self.get_object(), context={'request': request})
            decom_asset = Decommissioned(username=request.user.username, \
            asset_state=serialized_asset.data, network_graph=newresp)
            decom_asset.save()
        return super().destroy(self, request, *args, **kwargs)

    # Custom actions below
    @action(detail=True, methods=[GET])
    def chassis_slots(self, request, *args, **kwargs):
        asset = self.get_object()
        if asset.model.mount_type != 'chassis':
            return Response("Detail must specify a chassis.")
        openings = []
        for i in range(1, 15):
            if not len(asset.bladeserver_set.filter(slot_number=i).all()) > 0:
                openings.append(i)
        return Response(openings)
    @action(detail=True, methods=[GET])
    def blades(self, request, *args, **kwargs):
        asset = self.get_object()
        blades = asset.bladeserver_set
        serializer = BladeServerSerializer(blades, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=[GET])
    def asset_number(self, request, *args, **kwargs):
        num = Asset_Number.objects.all().first()
        if not num:
            num = Asset_Number.objects.create(next_avail=100000)
        ass_num = num.next_avail
        # try:
        #     num = Asset_Number.objects.get(pk=1)
        #     ass_num = num.next_avail
        # except Asset_Number.DoesNotExist:
        #     num = Asset_Number.objects.create(next_avail=100000)
        #     ass_num = num.next_avail
        return Response({
            'asset_number': ass_num
        })

    @action(detail=True, methods=[GET])
    def network_graph(self, request, *args, **kwargs):
        graph_serializer = AssetSeedForGraphSerializer(self.get_object(), context={'request': request})
        newresp = restructure_net_port_data(graph_serializer)
        return Response(newresp)

    @action(detail=False, methods=[POST])
    def import_file(self, request, *args, **kwargs):
        return import_asset_file(request)

    @action(detail=False, methods=[POST])
    def import_network_connections(self, request, *args, **kwargs):
        return import_network_port_file(request)

    @action(detail=False, methods=[GET])
    def filter_fields(self, request, *args, **kwargs):
        fields = ['model', 'vendor', 'model_number', 'hostname', 'rack', 'rack_u', 'owner_username', 'comment',
                  'rack_num_start', 'rack_num_end']
        return Response({
            'filter_fields': fields
        })

    @action(detail=False, methods=[GET])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'sorting_fields': self.ordering_fields
        })

    @action(detail=False, methods=[GET])
    def model_names(self, request, *args, **kwargs):
        name_typed = self.request.query_params.get('name') or ''
        models = Model.objects.annotate(
            unique_name=Concat('vendor', 'model_number')). \
            filter(unique_name__icontains=name_typed).all()
        serializer = UniqueModelsSerializer(models, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=[POST])
    def update_pp_state(self, request, *args, **kwargs):
        try:
            pdu_name = request.data.get('name')
            port_number = request.data.get('port_number')
            act = request.data.get('status').lower()
        except KeyError:
            return Response({
                'Status': "Not all fields specified. You must provide a name, a port number, and an action."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            p = Permission.objects().all.get(name='power', user=request.user)
        except:
            if not request.user.is_superuser and request.user is not self.get_object().owner:
                return Response({
                    'Invalid Permissions': "You do not have permission! Get outta here!"
                }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # assert re.match("hpdu-rtp1-[A-Z0-9]+[LR]]", pdu_name)
            # assert int(port_number) < 25
            assert act in ['on', 'off', 'cycle']
        except AssertionError:
            return Response({
                'Invalid Data': "You must choose one action of 'on' or 'off', for an asset connected to a valid Networx PDU."
            }, status=status.HTTP_400_BAD_REQUEST)

        def on():
            someDisconnected = False
            responses = []
            for pp in self.get_object().power_port_set.all():
                try:
                    name = pp.pdu.name
                    num = pp.port_number
                except AttributeError:
                    someDisconnected = True
                    continue

                try:
                    assert name is not None
                    assert num is not None
                except AssertionError:
                    someDisconnected = True
                    continue

                try:
                    resp = requests.post(NETWORX_POST_URL, {
                        'pdu': name,
                        'port': num,
                        'v': 'on'
                    }, timeout=2)
                    responses.append({
                        "port": "PDU{} port{}".format(name, num),
                        "status": "successfully turned on"
                    })
                except requests.exceptions.RequestException:
                    responses.append({
                        "port": "PDU{} port{}".format(name, num),
                        "status": "failure- the PDU Networx 98 service is down."
                    })

            if any(r.get("status") == 'failure' for r in responses):
                return Response({
                    "responses": responses
                }, status=status.HTTP_207_MULTI_STATUS)

            return Response({
                "responses": responses
            }, status=status.HTTP_200_OK)

        def off():
            someDisconnected = False
            responses = []
            for pp in self.get_object().power_port_set.all():
                try:
                    name = pp.pdu.name
                    num = pp.port_number
                except AttributeError:
                    someDisconnected = True
                    continue
                try:
                    assert name is not None
                    assert num is not None
                except AssertionError:
                    someDisconnected = True
                    continue
                try:
                    resp = requests.post(NETWORX_POST_URL, {
                        'pdu': name,
                        'port': num,
                        'v': 'off'
                    }, timeout=2)
                    responses.append({
                        "port": "PDU{} port{}".format(name, num),
                        "status": "successfully turned off"
                    })
                except requests.exceptions.RequestException:
                    responses.append({
                        "port": "PDU{} port{}".format(name, num),
                        "status": "failure- the PDU Networx 98 service is down."
                    })

            if any(r.get("status") == 'failure' for r in responses):
                return Response({
                    "responses": responses,
                }, status=status.HTTP_207_MULTI_STATUS)

            return Response({
                "responses": responses
            }, status=status.HTTP_200_OK)

        if act.lower() == 'on':
            return on()
        if act.lower() == 'off':
            return off()

        return Response({
            'status': 'Error. The PDU Networx 98 Pro service is unavailable.'
        }, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=[POST])
    def generate_barcodes(self, request, *args, **kwargs):
        asset_ids = request.data
        count = 1
        table = []
        dict = {}
        for i in asset_ids:
            try:
                asset = Asset.objects.all().get(pk=i)
            except Asset.DoesNotExist:
                asset = BladeServer.objects.all().get(pk=i)
            if count == 1:
                dict['one'] = asset.asset_number
            if count == 2:
                dict['two'] = asset.asset_number
            if count == 3:
                dict['three'] = asset.asset_number
            if count == 4:
                dict['four'] = asset.asset_number
                count = 0
                table.append(dict)
                dict = {}
            count+=1
        if len(dict) > 0:
            while count <= 4:
                if count == 1:
                    dict['one'] = None
                if count == 2:
                    dict['two'] = None
                if count == 3:
                    dict['three'] = None
                if count == 4:
                    dict['four'] = None
                count+=1
            table.append(dict)
        return Response(table)
        # asset_ids = request.data
        # c128 = barcode.get_barcode_class('code128')
        # response = HttpResponse(content_type='application/pdf')
        # response['Content-Disposition'] = 'attachment; filename="barcodes.pdf"'
        # p = canvas.Canvas(response)
        # svgs = []
        # if asset_ids:
        #     for id in asset_ids:
        #         asset = Asset.objects.all().get(pk=id)
        #         c128_barcode = c128(str(asset.asset_number))
        #         raw = c128_barcode.render(
        #         writer_options = {
        #             'module_width':.5,
        #             'module_height':6,
        #             'font_size':6,
        #             'text_distance':3,
        #         },
        #         text=str(asset.asset_number)
        #         )
        #         raw.save('test.svg')
        #         svg = ContentFile(raw)
        #         svgs.append(svg)
        #         print(c128_barcode)
        # x = 8
        # y = 35
        # for svg in svgs:
        #     print(svg.name)
        #     print(svg)
        #     rlg = svg2rlg('test.svg')
        #     renderPDF.draw(rlg, canvas, x, y)
        #     if x < 400:
        #         x += 155
        #     else:
        #         x = 8
        #         y += 39
        #     barcodes_on_page += 1
        #     if barcodes_on_page == 80:
        #         canvas.showPage()
        #         x = 8
        #         y = 35
        #         barcodes_on_page = 0
        # canvas.save()
        # return response


        # asset_ids = request.data
        # response = HttpResponse(content_type='application/pdf')
        # response['Content-Disposition'] = 'attachment; filename="barcodes.pdf"'
        # c = canvas.Canvas(response, pagesize=letter)
        # codes = []
        # for id in asset_ids:
        #     asset = Asset.objects.all().get(pk=id)
        #     barcode128 = code128.Code128(asset.asset_number)
        #     codes.append(barcode128)
        # print(codes)
        # x = 50 * mm
        # y = 285 * mm
        # x1 = 6.4 * mm
        # for code in codes:
        #     print(code)
        #     code.drawOn(c, x, y)
        #     y = y - 100 * mm
        # c.save()
        # return response





    # barcode128 = code128.Code128(barcode_value)
    # # the multiwidth barcode appears to be broken
    # #barcode128Multi = code128.MultiWidthBarcode(barcode_value)
    #
    # barcode_usps = usps.POSTNET("50158-9999")
    #
    # codes = [barcode39, barcode39Std, barcode93, barcode128, barcode_usps]
    #
    # x = 1 * mm
    # y = 285 * mm
    # x1 = 6.4 * mm
    #
    # for code in codes:
    #     code.drawOn(c, x, y)
    #     y = y - 15 * mm
    #
    # # draw the eanbc8 code
    # barcode_eanbc8 = eanbc.Ean8BarcodeWidget(barcode_value)
    # bounds = barcode_eanbc8.getBounds()
    # width = bounds[2] - bounds[0]
    # height = bounds[3] - bounds[1]
    # d = Drawing(50, 10)
    # d.add(barcode_eanbc8)
    # renderPDF.draw(d, c, 15, 555)
    #
    # # draw the eanbc13 code
    # barcode_eanbc13 = eanbc.Ean13BarcodeWidget(barcode_value)
    # bounds = barcode_eanbc13.getBounds()
    # width = bounds[2] - bounds[0]
    # height = bounds[3] - bounds[1]
    # d = Drawing(50, 10)
    # d.add(barcode_eanbc13)
    # renderPDF.draw(d, c, 15, 465)
    #
    # # draw a QR code
    # qr_code = qr.QrCodeWidget('www.mousevspython.com')
    # bounds = qr_code.getBounds()
    # width = bounds[2] - bounds[0]
    # height = bounds[3] - bounds[1]
    # d = Drawing(45, 45, transform=[45./width,0,0,45./height,0,0])
    # d.add(qr_code)
    # renderPDF.draw(d, c, 15, 405)
    #
    # c.save()



        # asset_ids = request.data
        # c128 = barcode.get_barcode_class('code128')
        # buffer = io.BytesIO()
        # p = canvas.Canvas(buffer)
        # if asset_ids:
        #     for id in asset_ids:
        #         print('asset id')
        #         print(id)
        #         asset = Asset.objects.all().get(pk=id)
        #         generate('code128', str(asset.asset_number), output=buffer)
        # buffer.seek(0)
        # print('returing')
        # print(buffer.getvalue())
        # return FileResponse(buffer, as_attachment=True, filename='asset_barcodes.pdf')



    @action(detail=False, methods=[GET])
    def all_ids(self, request, *args, **kwargs):
        ids = []
        for asset in Asset.objects.all():
            ids.append(asset.id)
        return Response({
            'ids': ids
            })

    @action(detail=True, methods=[GET])
    def get_pp_status(self, request, *args, **kwargs):
        asset = self.get_object()
        pdu_l_name = asset.rack.pdu_l.name
        pdu_r_name = asset.rack.pdu_r.name
        try:
            assert re.match("hpdu-rtp1-[A-E][0-1][0-9]L", pdu_l_name)
            assert re.match("hpdu-rtp1-[A-E][0-1][0-9]R", pdu_r_name)
        except AssertionError:
            return Response({
                "status": "Failed to get PDU port data because this asset is not connected to a networked PDU."
            }, status=status.HTTP_400_BAD_REQUEST)

        relevant_ports = [(pp.port_number, pp.pdu) for pp in asset.power_port_set.all()]
        try:
            left_html = requests.get(NETWORX_GET_ROOT_URL, params={"pdu": pdu_l_name}, timeout=2).text
            right_html = requests.get(NETWORX_GET_ROOT_URL, params={"pdu": pdu_r_name}, timeout=2).text
        except requests.exceptions.RequestException:
            return Response({
                'status': 'Error. The PDU Networx 98 Pro service is unavailable.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # return Response({
        #     "left": left_html,
        #     "right": right_html
        # })

        left_statuses = {}
        right_statuses = {}
        statuses = []

        for pp in asset.power_port_set.all():
            try:
                name = pp.pdu.name
                num = pp.port_number
            except AttributeError:
                statuses.append("DISCONNECTED")
                continue
            regex = rf">{pp.port_number}\s*<td><span style='background-color:\#[0-9a-f]*'>([A-Z]+)"
            if pp.pdu.name == pdu_l_name:
                s = re.search(regex, left_html)
                if s:
                    # return Response({"hello": "world"})

                    state = s.group(1)
                    left_statuses[pp.port_number] = state
                    statuses.append(state)

            else:
                s = re.search(regex, right_html)
                if s:
                    # return Response({"hello": "world"})

                    state = s.group(1)
                    right_statuses[pp.port_number] = state
                    statuses.append(state)

        return Response({
            "statuses": statuses
        })
