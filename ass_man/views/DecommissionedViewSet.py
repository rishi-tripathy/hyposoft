from rest_framework import viewsets
from ass_man.models import Decommissioned
from ass_man.serializers.decommissioned_serializers import DecommissionedSerializer

class DecommissionedViewSet(viewsets.ModelViewSet):
    queryset = Decommissioned.objects.all()
    serializer_class = DecommissionedSerializer
