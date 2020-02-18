from ass_man.models import Network_Port
from rest_framework import serializers


class NetworkPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Network_Port
        fields = ['name', 'mac', 'connection']
