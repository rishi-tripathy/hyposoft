from ass_man.models import AllAssets
from rest_framework import serializers
from ass_man.serializers.asset_serializers import AssetShortSerializer
from ass_man.serializers.blade_serializer import BladeServerSerializer


class AllAssetsSerializer(serializers.ModelSerializer):
    asset = AssetShortSerializer()
    bladeserver = BladeServerSerializer()
    class Meta:
        model = AllAssets
        fields = ['id', 'asset', 'bladeserver']
