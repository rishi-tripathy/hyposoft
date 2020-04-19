from rest_framework import viewsets
from ass_man.models import AllAssets
from ass_man.serializers.all_assets_serializers import AllAssetsSerializer
from ass_man.filters import AllAssetsFilter, AllAssetFilterByRack
from django_filters import rest_framework as djfiltBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Greatest
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
from ass_man.models import Model, Asset, Rack, Datacenter, Network_Port, Power_Port, PDU, Asset_Number, Decommissioned
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend
from ass_man.filters import AssetFilter, AssetFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json
from ass_man.import_manager import import_asset_file, import_network_port_file
from ass_man.export_manager import export_assets, export_network_ports
from ass_man.network_port_jsonify import restructure_net_port_data

ALLASSETS_ORDERING_FIELDS = ['model', 'datacenter', 'model_number',
'vendor', 'mount_type', 'hostname', 'owner', 'asset_number', 'rack_number', 'rack_u',
'location', 'slot_number']

ALLASSETS_FILTERING_FIELDS = ['model', 'model_number',
'vendor', 'mount_type', 'hostname', 'owner', 'asset_number', 'rack_number', 'rack_u',
'location', 'slot_number']

class AllAssetViewSet(viewsets.ModelViewSet):
    # queryset = AllAssets.objects.all()
    queryset = AllAssets.objects.all()\
        .annotate(model=Greatest('asset__model', 'bladeserver__model'))\
        .annotate(datacenter=Greatest('asset__datacenter', 'bladeserver__datacenter'))\
        .annotate(is_offline=Greatest('asset__datacenter__is_offline', 'bladeserver__datacenter__is_offline'))\
        .annotate(model_number=Greatest('asset__model__model_number', 'bladeserver__model__model_number'))\
        .annotate(vendor=Greatest('asset__model__vendor', 'bladeserver__model__vendor'))\
        .annotate(mount_type=Greatest('asset__model__mount_type', 'bladeserver__model__mount_type'))\
        .annotate(hostname=Greatest('asset__hostname', 'bladeserver__hostname'))\
        .annotate(owner=Greatest('asset__owner', 'bladeserver__owner'))\
        .annotate(asset_number=Greatest('asset__asset_number', 'bladeserver__asset_number'))\
        .annotate(rack_number=Greatest('asset__rack__rack_number', None))\
        .annotate(rack_u=Greatest('asset__rack_u', None))\
        .annotate(location=Greatest('bladeserver__location__hostname', None))\
        .annotate(slot_number=Greatest('bladeserver__slot_number', None))


    serializer_class = AllAssetsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    ordering_fields = ALLASSETS_ORDERING_FIELDS
    filterset_fields = ALLASSETS_FILTERING_FIELDS
    ordering = ['asset_number']
    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend,
                       AllAssetFilterByRack]
    filterset_class = AllAssetsFilter

    def list(self, request, *args, **kwargs):
            if request.query_params.get('offline') == 'true':

                queryset = self.filter_queryset(self.get_queryset().all().annotate(rack_letter=Cast('id', CharField()))
                                                .annotate(numstr_in_rack=Cast('id', CharField()))
                                                .annotate(number_in_racknum=Cast('id', IntegerField()))
                                                .exclude(is_offline=False))

                page = self.paginate_queryset(queryset)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)

            if not request.query_params.get('offline') == 'true':
                queryset = self.filter_queryset(self.get_queryset()).exclude(is_offline=True)

                page = self.paginate_queryset(queryset)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)


            return super().list(self, request, *args, **kwargs)
