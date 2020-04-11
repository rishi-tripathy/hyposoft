from ass_man.models import BladeServer
from rest_framework import serializers
from ass_man.serializers.asset_serializers import ChassisSerializer
from ass_man.serializers.model_serializers import ModelAssetSerializer
from usr_man.serializers import UserOfAssetSerializer
from ass_man.serializers.datacenter_serializers import DatacenterSerializer

class BladeServerSerializer(serializers.ModelSerializer):
    model = ModelAssetSerializer()
    owner = UserOfAssetSerializer()
    datacenter = DatacenterSerializer()
    location = ChassisSerializer()
    class Meta:
        model = BladeServer
        fields = ['id', 'model', 'hostname', 'datacenter', 'location', 'slot_number', 'owner', 'comment', 'asset_number']

class BladeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BladeServer
        fields = ['id', 'model', 'hostname', 'datacenter', 'location', 'slot_number', 'owner', 'comment', 'asset_number']
