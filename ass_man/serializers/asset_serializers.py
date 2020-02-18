from ass_man.models import Asset, Power_Port, Network_Port, PDU
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.validators import MinValueValidator
from usr_man.serializers import UserOfAssetSerializer
import re
from django.core.exceptions import ObjectDoesNotExist

from ass_man.serializers.model_serializers import ModelAssetSerializer

from ass_man.serializers.network_port_serializers import NetworkPortSerializer
from ass_man.serializers.power_port_serializers import PowerPortSerializer
from ass_man.serializers.rack_serializers import RackOfAssetSerializer
from ass_man.serializers.datacenter_serializers import DatacenterSerializer


class AssetSerializer(serializers.HyperlinkedModelSerializer):
    hostname = serializers.CharField(validators=[UniqueValidator(queryset=Asset.objects.all())])
    rack_u = serializers.IntegerField(validators=[MinValueValidator(1)])

    # network_ports = NetworkPortSerializer()
    # power_ports = PowerPortSerializer()
    # model = ModelAssetSerializer()

    def check_rack_u_validity(self, validated_data, asset=None):
        rack = validated_data['rack']
        rack_u = validated_data['rack_u']
        model = validated_data['model']
        height = model.height
        invalid_list = []
        if (rack_u + height - 1) > 42:
            raise serializers.ValidationError({
                'Height conflict': 'this asset would exceed past the top of the rack.'
            })
        for i in range(rack_u, rack_u + height):
            if eval('rack.u{} and (rack.u{} != asset)'.format(i, i)):
                invalid_list.append('Conflict: host ' +
                                    eval('rack.u{}.__str__()'.format(i)) +
                                    ' conflicts at U{}'.format(i))
        if len(invalid_list) > 0:
            raise serializers.ValidationError({
                'Invalid Rack U': invalid_list
            })
        return

    def create(self, validated_data):
        self.check_rack_u_validity(validated_data)
        if self.context['power_ports']:
            for i in self.context['power_ports']:
                try:
                    pdu = PDU.objects.get(name=i['pdu'])
                except PDU.DoesNotExist:
                    raise serializers.ValidationError({
                        'PDU Error': 'the PDU referenced by name does not exist.'
                    })
                try:
                    pdu_port = int(i['port_number'])
                    pp = pdu.power_port_set.get(port_number=pdu_port)
                except Power_Port.DoesNotExist:
                    pp = None
                try:
                    assert pp is None
                except AssertionError:
                    raise serializers.ValidationError({
                        'PDU Error': 'this PDU port is already in use.'
                    })
        if self.context['network_ports']:
            for i in self.context['network_ports']:
                connection_asset_num = i['connection']['asset_number']
                connection_port_name = i['connection']['port_name']
                try:
                    connection_asset = Asset.objects.get(asset_number=connection_asset_num)
                    connection_port = connection_asset.network_port_set.get(name=connection_port_name)
                except ObjectDoesNotExist:
                    connection_asset = None
                    connection_port = None
                    continue

                # check if connected port is in the same datacenter
                try:
                    assert connection_asset.datacenter == validated_data['datacenter']
                except AssertionError:
                    raise serializers.ValidationError({
                        'Network Port Error': 'the network connection port is in a different datacenter.'
                    })
                # check if connected port is occupied
                try:
                    assert connection_port.connection is None
                except AssertionError:
                    raise serializers.ValidationError({
                        'Network Port Error': 'the network connection port is already occupied.'
                    })
        return super().create(validated_data)

    def update(self, asset, validated_data):
        self.check_rack_u_validity(validated_data, asset)
        try:
            assert asset.model == validated_data['model']
        except AssertionError:
            raise serializers.ValidationError({
                'model': 'The model of a deployed asset may not be changed to another model.'
            })
        return super().update(asset, validated_data)

    # adapted from https://stackoverflow.com/questions/2063213/regular-expression-for-validating-dns-label-host-name

    def validate_hostname(self, value):
        if not re.match('^(?![0-9]+$)(?!-)[a-zA-Z0-9-]{,63}(?<!-)$', value):
            raise serializers.ValidationError(
                '{} is not an valid hostname. Please ensure this value is a valid hostname as per RFC 1034.'.format(
                    value.__str__())
            )
        return value

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname', 'datacenter', 'rack', 'rack_u', 'owner', 'comment', 'asset_number']


class AssetFetchSerializer(AssetSerializer):
    model = ModelAssetSerializer()
    rack = RackOfAssetSerializer()
    owner = UserOfAssetSerializer()
    datacenter = DatacenterSerializer()
    network_ports = NetworkPortSerializer(source='network_port_set', many=True)
    power_ports = PowerPortSerializer(source='power_port_set', many=True)

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname', 'datacenter', 'rack', 'rack_u', 'owner', 'comment', 'network_ports',
                  'power_ports', 'asset_number']


class AssetShortSerializer(AssetSerializer):
    model = ModelAssetSerializer()
    rack = RackOfAssetSerializer()
    owner = UserOfAssetSerializer()
    datacenter = DatacenterSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname', 'datacenter', 'rack', 'rack_u', 'owner']


class AssetOfModelSerializer(serializers.HyperlinkedModelSerializer):
    rack = RackOfAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'url', 'hostname', 'rack', 'rack_u', 'owner']


# For the network graph

class AssetTwoLevelsAwaySerializer(serializers.ModelSerializer):
    rack = RackOfAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'url,' 'hostname', 'rack', 'rack_u', 'asset_number']


class NetworkPortTwoDegreeAwaySerializer(serializers.ModelSerializer):
    asset = AssetTwoLevelsAwaySerializer()

    class Meta:
        model = Network_Port
        fields = ['name', 'mac', 'asset']


class NetworkPortOneDegreeAwaySerializer(serializers.ModelSerializer):
    connection = NetworkPortTwoDegreeAwaySerializer()

    class Meta:
        model = Network_Port
        fields = ['name', 'mac', 'connection']


class AssetOneLevelAwaySerializer():
    rack = RackOfAssetSerializer()
    network_ports = NetworkPortOneDegreeAwaySerializer(source='network_port_set', many=True)

    class Meta:
        model = Asset
        fields = ['id', 'url', 'hostname', 'rack', 'rack_u', 'network_ports', 'asset_number']


class NetworkPortOneDegreeAwayNearsideSerializer(serializers.ModelSerializer):
    asset = AssetOneLevelAwaySerializer()

    class Meta:
        model = Network_Port
        fields = ['name', 'mac', 'asset']


class NetworkPortForSeedSerializer(serializers.ModelSerializer):
    connection = NetworkPortOneDegreeAwayNearsideSerializer()

    class Meta:
        model = Network_Port
        fields = ['name', 'mac', 'connection']


class AssetSeedForGraphSerializer(serializers.ModelSerializer):
    rack = RackOfAssetSerializer()
    network_ports = NetworkPortForSeedSerializer(source='network_port_set', many=True)

    class Meta:
        model = Asset
        fields = ['id', 'url', 'hostname', 'rack', 'rack_u', 'network_ports', 'asset_number']

# This is defined in the Rack serializer to remove a circular dependency

# class RackAssetSerializer(serializers.ModelSerializer):
#     model = ModelAssetSerializer()
#
#     class Meta:
#         model = Asset
#         fields = ['id', 'model', 'hostname']
