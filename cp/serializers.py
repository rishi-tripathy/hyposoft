from cp.models import AssetCP, NPCP, PPCP, ChangePlan
from ass_man.serializers.model_serializers import ModelAssetSerializer
from ass_man.serializers.datacenter_serializers import DatacenterSerializer
from ass_man.serializers.rack_serializers import RackOfAssetSerializer
from ass_man.serializers.network_port_serializers import ConnectionNPSerializer
from ass_man.serializers.pdu_serializers import PDUSerializer

from ass_man.serializers.power_port_serializers import PowerPortSerializer
from usr_man.serializers import UserOfAssetSerializer
from rest_framework import serializers


class AssetCPSerializer(serializers.ModelSerializer):

    model = ModelAssetSerializer()
    datacenter = DatacenterSerializer()
    rack = RackOfAssetSerializer()
    owner = UserOfAssetSerializer()

    class Meta:
        model = AssetCP
        fields = ['id', 'id_ref', 'cp', 'model', 'datacenter', 'rack', 'rack_u', 'owner', 'comment', 'asset_number']


class RemoteNPCPSerializer(serializers.ModelSerializer):

    class Meta:
        model = NPCP
        fields = ['id', 'id_ref']


class NPCPSerializer(serializers.ModelSerializer):
    connection = ConnectionNPSerializer()

    class Meta:
        model = NPCP
        fields = ['id', 'id_ref', 'name', 'mac', 'connection', 'conn_cp_id', 'asset_cp_id', ]


class PPCPSerializer(serializers.ModelSerializer):
    pdu = PDUSerializer()

    class Meta:
        Model = PPCP
        fields = ['id', 'id_ref', 'name', 'pdu', 'port_number', 'asset', 'asset_cp_id']


class ChangePlanListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChangePlan
        fields = ['id', 'name', 'owner']



class ChangePlanSerializer(serializers.ModelSerializer):

    assets_cp = AssetCPSerializer(source='assetcp_set', many=True)
    nps_cp = NPCPSerializer(source='npcp_set', many=True)
    pps_cp = PPCPSerializer(source='ppcp_set', many=True)

    class Meta:
        model = ChangePlan
        fields = ['id', 'name', 'owner', 'assets_cp', 'nps_cp', 'pps_cp']