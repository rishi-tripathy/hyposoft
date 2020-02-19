from ass_man.models import Network_Port
from rest_framework import serializers
from ass_man.serializers.asset_serializers import AssetHostnameSerializer


class ConnectionNPSerializer(serializers.ModelSerializer):
    asset = AssetHostnameSerializer()

    class Meta:
        model = Network_Port
        fields = ['id', 'name', 'asset']


class NetworkPortSerializer(serializers.ModelSerializer):
    connection = ConnectionNPSerializer()

    class Meta:
        model = Network_Port
        fields = ['id', 'name', 'mac', 'connection']
