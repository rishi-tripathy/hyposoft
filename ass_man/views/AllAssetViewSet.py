from rest_framework import viewsets
from ass_man.models import AllAssets
from ass_man.serializers.all_assets_serializers import AllAssetsSerializer
from ass_man.filters import AllAssetsFilter
from django_filters import rest_framework as djfiltBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated

ALLASSETS_ORDERING_FILTERING_FIELDS = ['model', 'datacenter', 'model__model_number',
'model__vendor', 'model__mount_type', 'hostname', 'owner', 'asset_number']

class AllAssetViewSet(viewsets.ModelViewSet):
    queryset = AllAssets.objects.all()
    serializer_class = AllAssetsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    ordering_fields = ALLASSETS_ORDERING_FILTERING_FIELDS
    filterset_fields = ALLASSETS_ORDERING_FILTERING_FIELDS

    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend,
                       ]
    filterset_class = AllAssetsFilter
