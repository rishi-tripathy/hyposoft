from rest_framework import viewsets
from ass_man.models import AllAssets
from ass_man.serializers.all_assets_serializers import AllAssetsSerializer
from ass_man.filters import AllAssetsFilter, AllAssetFilterByRack
from django_filters import rest_framework as djfiltBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Greatest

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
