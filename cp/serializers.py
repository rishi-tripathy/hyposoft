from cp.models import AssetCP, NPCP, PPCP, ChangePlan
from ass_man.serializers.model_serializers import ModelAssetSerializer
from ass_man.serializers.datacenter_serializers import DatacenterSerializer
from ass_man.serializers.rack_serializers import RackOfAssetSerializer
from ass_man.serializers.network_port_serializers import ConnectionNPSerializer
from ass_man.serializers.pdu_serializers import PDUSerializer

from ass_man.serializers.power_port_serializers import PowerPortSerializer
from usr_man.serializers import UserOfAssetSerializer
from rest_framework import serializers


class RemoteNPCPSerializer(serializers.ModelSerializer):

    class Meta:
        model = NPCP
        fields = ['id', 'id_ref']


class NPCPSerializer(serializers.ModelSerializer):

    class Meta:
        model = NPCP
        fields = ['id', 'id_ref', 'name', 'mac', 'connection', 'conn_cp_id', 'asset_cp_id', ]


class PPCPSerializer(serializers.ModelSerializer):
    #pdu = PDUSerializer()

    class Meta:
        model = PPCP
        fields = ['id', 'id_ref', 'name', 'pdu', 'port_number', 'asset', 'asset_cp_id']


class AssetCPSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssetCP
        fields = ['id', 'id_ref', 'hostname', 'cp', 'model', 'datacenter', 'rack', 'rack_u', 'owner']


class AssetCPFetchSerializer(serializers.ModelSerializer):

    model = ModelAssetSerializer()
    datacenter = DatacenterSerializer()
    rack = RackOfAssetSerializer()
    owner = UserOfAssetSerializer()
    nps_cp = NPCPSerializer(source='npcp_set', many=True, read_only=True)
    pps_cp = PPCPSerializer(source='ppcp_set', many=True, read_only=True)

    class Meta:
        model = AssetCP
        fields = ['id', 'id_ref', 'hostname', 'cp', 'model', 'datacenter', 'rack', 'rack_u', 'nps_cp', 'pps_cp', 'owner', 'comment']





class ChangePlanListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChangePlan
        fields = ['id', 'name', 'datacenter', 'owner', 'executed']


class ChangePlanFetchSerializer(serializers.ModelSerializer):

    assets_cp = AssetCPFetchSerializer(source='assetcp_set', many=True, read_only=True)


    class Meta:
        model = ChangePlan
        fields = ['id', 'name', 'owner', 'datacenter', 'assets_cp', 'executed']

