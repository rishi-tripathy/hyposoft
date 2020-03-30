from ass_man.models import Decommissioned
from rest_framework import serializers

class DecommissionedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Decommissioned
        fields = ['id', 'username', 'timestamp', 'asset_state', 'network_graph']
