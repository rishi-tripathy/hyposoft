from rest_framework import viewsets
from ass_man.models import AllAssets
from ass_man.serializers.all_assets_serializers import AllAssetsSerializer
from ass_man.filters import AllAssetsFilter
from django_filters import rest_framework as djfiltBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Greatest

ALLASSETS_ORDERING_FILTERING_FIELDS = ['model', 'datacenter', 'model__model_number',
'model__vendor', 'model__mount_type', 'hostname', 'owner', 'asset_number']

class AllAssetViewSet(viewsets.ModelViewSet):
    queryset = AllAssets.objects.all()\
        .annotate(model=Greatest('asset__model', 'bladeserver__model'))\
        .annotate(datacenter=Greatest('asset__datacenter', 'bladeserver__datacenter'))\
        .annotate(model__model_number=Greatest('asset__model__model_number', 'bladeserver__model__model_number'))\
        .annotate(model__vendor=Greatest('asset__model__vendor', 'bladeserver__model__vendor'))\
        .annotate(model__mount_type=Greatest('asset__model__mount_type', 'bladeserver__model__mount_type'))\
        .annotate(hostname=Greatest('asset__hostname', 'bladeserver__hostname'))\
        .annotate(owner=Greatest('asset__owner', 'bladeserver__owner'))\
        .annotate(asset_number=Greatest('asset__asset_number', 'bladeserver__asset_number'))

    serializer_class = AllAssetsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    ordering_fields = ALLASSETS_ORDERING_FILTERING_FIELDS
    filterset_fields = ALLASSETS_ORDERING_FILTERING_FIELDS

    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend,
                       ]
    filterset_class = AllAssetsFilter
