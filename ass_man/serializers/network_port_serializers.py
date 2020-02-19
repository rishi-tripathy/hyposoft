from ass_man.models import Network_Port, Asset
from rest_framework import serializers


class AssetHostnameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['id', 'hostname']


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
