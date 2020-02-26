from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models.fields import IntegerField
from django.db.models.functions import Concat, Substr, Cast
from django.db.models.deletion import ProtectedError
from django.db.models import CharField
from django.core.exceptions import ObjectDoesNotExist
import re, requests
# API
from rest_framework import viewsets

from ass_man.serializers.asset_serializers import AssetSerializer, AssetFetchSerializer, AssetShortSerializer, \
    AssetSeedForGraphSerializer
from ass_man.serializers.model_serializers import UniqueModelsSerializer

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# Project
from ass_man.models import Model, Asset, Rack, Datacenter, Network_Port, Power_Port, PDU, Asset_Number
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend
from ass_man.filters import AssetFilter, AssetFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json
from ass_man.import_manager import import_asset_file, import_network_port_file
from ass_man.export_manager import export_assets, export_network_ports

# CHANGE THIS FOR PRODUCTION
NETWORX_PORT = ":8000"
NETWORX_GET_ROOT_URL = "http://hyposoft-mgt.colab.duke.edu{}/pdu.php".format(NETWORX_PORT)
NETWORX_POST_URL = "http://hyposoft-mgt.colab.duke.edu{}/power.php".format(NETWORX_PORT)

JSON_TRUE = 'true'
ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'

ASSET_ORDERING_FILTERING_FIELDS = ['model', 'datacenter', 'model__model_number', 'model__vendor',
                                   'hostname', 'rack', 'rack_u', 'owner']


class AssetViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
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
                if (pp.pdu != pdu or pp.port_number != port_num):
                    pp.pdu = pdu
                    pp.port_number = port_num
                    pp.save()
            except(Power_Port.DoesNotExist, KeyError):
                pp = Power_Port.objects.create(pdu=pdu, port_number=port_num, asset=asset)
        if not power_ports_json:
            for i in range(asset.model.power_ports):
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
        for i in range(prev_rack_u, prev_rack_u + asset.model.height + 1):
            exec('prev_rack.u{} = None'.format(i))
        prev_rack.save()
        self.perform_update(serializer)
        asset = self.get_object()
        new_rack = asset.rack
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
        if request.query_params.get('export') == 'true':
            queryset = self.filter_queryset(self.get_queryset())
            if request.query_params.get('np') == 'true':
                return export_network_ports(queryset)
            return export_assets(queryset)

        return super().list(self, request, *args, **kwargs)

    # Custom actions below
    @action(detail=False, methods=[GET])
    def asset_number(self, request, *args, **kwargs):
        try:
            num = Asset_Number.objects.get(pk=1)
            ass_num = num.next_avail
        except Asset_Number.DoesNotExist:
            num = Asset_Number.objects.create(next_avail=100000)
            ass_num = num.next_avail
        return Response({
            'asset_number': ass_num
        })

    @action(detail=True, methods=[GET])
    def network_graph(self, request, *args, **kwargs):
        graph_serializer = AssetSeedForGraphSerializer(self.get_object(), context={'request': request})

        assets = []
        nodes = []
        seen_asset_ids = set()
        assets1 = []
        nps1 = []
        assets2 = []
        links = []
        newlinks = []

        master_data = graph_serializer.data
        data = graph_serializer.data

        root = {
            "id": data.get("id"),
            "hostname": data.get("hostname"),
            "location": "Rack {} U{}".format(data.get("rack").get("rack_number"), data.get("rack_u"))
        }

        assets.append(root)
        nodes.append({
            'id': root.get("hostname")
        })
        seen_asset_ids.add(data.get("id"))

        def process_l2(np, l1_id):
            c = np.get("connection")
            if c:
                data = c.get("asset")
                if data and (data.get("id") not in seen_asset_ids):
                    a2 = {
                        "id": data.get("id"),
                        "hostname": data.get("hostname"),
                        "location": "Rack {} U{}".format(data.get("rack").get("rack_number"), data.get("rack_u"))
                    }
                    assets.append(a2)
                    nodes.append({
                        'id': a2.get("hostname")
                    })
                    if int(l1_id) < int(data.get("id")):
                        links.append("{},{}".format(l1_id, data.get("id")))
                        newlinks.append({
                            'source': Asset.objects.get(id=l1_id).hostname,
                            'destination': data.get("hostname"),
                        })
                    else:
                        links.append("{},{}".format(data.get("id"), l1_id, ))
                        newlinks.append({
                            'source': data.get("hostname"),
                            'destination': Asset.objects.get(id=l1_id).hostname,
                        })

        root_nps = data.get("network_ports")
        for np in root_nps:
            c = np.get("connection")
            if c:
                data = c.get("asset")
                if data and (data.get("id") not in seen_asset_ids):
                    a1 = {
                        "id": data.get("id"),
                        "hostname": data.get("hostname"),
                        "location": "Rack {} U{}".format(data.get("rack").get("rack_number"), data.get("rack_u"))
                    }
                    assets.append(a1)
                    nodes.append({
                        'id': a1.get("hostname")
                    })
                    if int(root.get("id")) < int(data.get("id")):
                        links.append("{},{}".format(root.get("id"), data.get("id")))
                        newlinks.append({
                            'source': root.get("hostname"),
                            'destination': data.get("hostname")
                        })
                    else:
                        links.append("{},{}".format(data.get("id"), root.get("id")))
                        newlinks.append({
                            'source': data.get("hostname"),
                            'destination': root.get("hostname")
                        })

                    for np2 in data.get("network_ports"):
                        process_l2(np2, data.get("id"))

        resp = {
            "data": {
                "assets": [dict(t) for t in {tuple(d.items()) for d in assets}],
                "connections": list(set(links))
            }
        }
        newresp = {
            "data": {
                "nodes": nodes,
                "links": newlinks,
                "focusNodeId": root.get("hostname")
            }
        }

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
            # assert re.match("hpdu-rtp1-[A-Z0-9]+[LR]]", pdu_name)
            # assert int(port_number) < 25
            assert act in ['on', 'off', 'cycle']
        except AssertionError:
            return Response({
                'Invalid Data': "You must choose one action of 'on' or 'off', on one port of port 1-24 for a valid Networx PDU."
            }, status=status.HTTP_400_BAD_REQUEST)

        def on():
            for pp in self.get_object().power_port_set.all():
                name = pp.pdu.name
                num = pp.port_number
                try:
                    resp = requests.post(NETWORX_POST_URL, {
                        'pdu': name,
                        'port': num,
                        'v': 'on'
                    }, timeout=2)
                    return Response(resp.text)
                except requests.exceptions.RequestException:
                    return Response({
                        'status': 'Error. The PDU Networx 98 Pro service is unavailable.'
                    }, status=status.HTTP_400_BAD_REQUEST)

        def off():
            for pp in self.get_object().power_port_set.all():
                name = pp.pdu.name
                num = pp.port_number
                try:
                    resp = requests.post(NETWORX_POST_URL, {
                        'pdu': name,
                        'port': num,
                        'v': 'off'
                    }, timeout=2)
                    return Response(resp.text)
                except requests.exceptions.RequestException:
                    return Response({
                        'status': 'Error. The PDU Networx 98 Pro service is unavailable.'
                    }, status=status.HTTP_400_BAD_REQUEST)

        if act == 'on':
            return on()
        if act == 'off':
            return off()

        return Response({
            'status': 'Error. The PDU Networx 98 Pro service is unavailable.'
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=[GET])
    def get_pp_status(self, request, *args, **kwargs):
        asset = self.get_object()
        pdu_l_name = asset.rack.pdu_l.name
        pdu_r_name = asset.rack.pdu_r.name
        try:
            assert re.match("hpdu-rtp1-[a-e][0-1][0-9]l", pdu_l_name.lower())
            assert re.match("hpdu-rtp1-[a-e][0-1][0-9]r", pdu_r_name.lower())
        except AssertionError:
            return Response({
                "status": "Failed to get PDU port data because this asset is not connected to a networked PDU."
            }, status=status.HTTP_400_BAD_REQUEST)

        relevant_ports = [(pp.port_number, pp.pdu) for pp in asset.power_port_set.all()]
        try:
            left_html = requests.get(NETWORX_GET_ROOT_URL, params={"pdu": pdu_l_name}, timeout=3).text
            right_html = requests.get(NETWORX_GET_ROOT_URL, params={"pdu": pdu_r_name}, timeout=3).text
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
            regex = rf">{pp.port_number}<td><span style='background-color:\#[0-9a-f]*'>([A-Z]+)"
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
