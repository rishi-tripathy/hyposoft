from rest_framework import viewsets
from ass_man.models import Decommissioned
from ass_man.serializers.decommissioned_serializers import DecommissionedSerializer
from ass_man.filters import DecommissionedFilter
from django_filters import rest_framework as djfiltBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated

DECOMMISSIONED_ORDERING_FILTERING_FIELDS = ['username', 'timestamp']

class DecommissionedViewSet(viewsets.ModelViewSet):
    queryset = Decommissioned.objects.all()
    serializer_class = DecommissionedSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    ordering_fields = DECOMMISSIONED_ORDERING_FILTERING_FIELDS
    ordering = ['username', 'timestamp']
    filterset_fields = DECOMMISSIONED_ORDERING_FILTERING_FIELDS

    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend,
                       ]
    filterset_class = DecommissionedFilter
