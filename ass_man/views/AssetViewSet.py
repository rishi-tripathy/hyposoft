from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models.fields import IntegerField
from django.db.models.functions import Concat, Substr, Cast
from django.db.models.deletion import ProtectedError
from django.db.models import CharField
from django.core.exceptions import ObjectDoesNotExist
# API
from rest_framework import viewsets

from ass_man.serializers.asset_serializers import AssetSerializer, AssetFetchSerializer, AssetShortSerializer
from ass_man.serializers.model_serializers import UniqueModelsSerializer

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# Project
from ass_man.models import Model, Asset, Rack, Datacenter, Network_Port, Power_Port, PDU
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend
from ass_man.filters import AssetFilter, AssetFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json
from ass_man.import_manager import import_asset_file
from ass_man.export_manager import export_assets

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        asset = serializer.save()
        asset.asset_number = asset.id + 100000
        # ports = []
        try:
            network_ports_json = request.data["network_ports"]
        except KeyError:
            network_ports_json = {}
        try:
            power_ports_json = request.data["power_ports"]
        except KeyError:
            power_ports_json = {}

        for i in power_ports_json:
            try:
                pdu = PDU.objects.get(name=i['pdu'])
            except PDU.DoesNotExist:
                pdu = None
            port_num = int(i['port_number'])
            pp = Power_Port.objects.create(pdu=pdu, port_number=port_num, asset=asset)

        for i in network_ports_json:
            try:
                connection_asset = Asset.objects.get(asset_number=i['connection']['asset_number'])
                print(connection_asset.id)
                connection_port = connection_asset.network_port_set.get(name=i['connection']['port_name'])
                print(connection_port.id)
            except ObjectDoesNotExist:
                connection_port = None
            port = Network_Port.objects.create(name=i['name'], mac=i['mac'], connection=connection_port, asset=asset)
            # ports.append(port)
        # for p in ports:
        #     asset.network_port_set.add(p)
        asset.save()
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
        if getattr(asset, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the asset.
            asset._prefetched_objects_cache = {}
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        if request.query_params.get('export') == 'true':
            # hostname,rack,rack_position,vendor,model_number,owner,comment
            queryset = self.filter_queryset(self.get_queryset())
            return export_assets(queryset)

        return super().list(self, request, *args, **kwargs)

    # Custom actions below
    @action(detail=False, methods=['POST'])
    def import_file(self, request, *args, **kwargs):
        return import_asset_file(request)

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
