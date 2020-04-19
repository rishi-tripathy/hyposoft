from ass_man.models import Asset, Power_Port, Network_Port, PDU, Asset_Number, BladeServer
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

class ChassisSerializer(serializers.ModelSerializer):
    model = ModelAssetSerializer()
    class Meta:
        model = Asset
        fields = ['id', 'hostname', 'model', 'ovr_color', 'ovr_storage', 'ovr_cpu', 'ovr_memory']

class AssetSerializer(serializers.HyperlinkedModelSerializer):
    # hostname = serializers.CharField(validators=[UniqueValidator(queryset=Asset.objects.all())])

    # network_ports = NetworkPortSerializer()
    # power_ports = PowerPortSerializer()
    # model = ModelAssetSerializer()

    def check_rack_u_validity(self, validated_data, asset=None):
        if validated_data['datacenter'].is_offline:
            return
        rack = validated_data['rack']
        rack_u = validated_data['rack_u']
        if not rack:
            raise serializers.ValidationError({
                'Bad Rack': 'You must specify a rack for an asset in an online datacenter.'
            })
        if not rack_u:
            raise serializers.ValidationError({
                'Bad rack_u': 'You must specify a rack_u for an asset in an online datacenter.'
            })
        if rack_u < 1:
            raise serializers.ValidationError({
                'Bad rack_u': 'The specified rack_u must be a positive integer.'
            })
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

    def check_mac_format(self, mac):
        return re.match(
            '^([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})',
            mac.lower())

    def check_network_ports(self, network_ports, validated_data, asset):
        if network_ports:
            np_list = []
            for i in network_ports:
                try:
                    mac = i['mac']
                except KeyError:
                    mac = ''
                if mac and not self.check_mac_format(mac):
                    raise serializers.ValidationError({
                        'Bad MAC address': mac
                    })
                try:
                    connection_port_id = i['connection']['network_port_id']
                    connection_port = Network_Port.objects.get(pk=connection_port_id)
                except (ObjectDoesNotExist, KeyError) as e:
                    connection_asset = None
                    connection_port = None
                    continue
                # check if connected port is in the same datacenter
                try:
                    assert connection_port.asset.datacenter == validated_data['datacenter']
                except AssertionError:
                    raise serializers.ValidationError({
                        'Network Port Error': 'This action would cause a prohibited network connection between Asset {} in Datacenter {} and Asset {} in in Datacenter {}.'
                            .format(validated_data["hostname"], validated_data["datacenter"],
                                    connection_port.asset.hostname, connection_port.asset.datacenter)
                    })
                # check if connected port is occupied
                try:
                    assert connection_port.connection is None
                except AssertionError:
                    if asset and connection_port.connection.asset.id == asset.id:
                        pass
                    else:
                        raise serializers.ValidationError({
                            'Network Port Error': 'Port {} on host {} is already occupied by a connection to port {} on host {}.'.format(
                                connection_port.name, connection_port.asset.hostname, connection_port.connection.name,
                                connection_port.connection.asset.hostname)
                        })
                if connection_port and connection_port in np_list:
                    raise serializers.ValidationError({
                    'Network Port Error': 'Connection port {} on asset {} is used multiple times by this asset'.format(connection_port.name,connection_port.asset.asset_number)
                    })
                else:
                    np_list.append(connection_port)

    def check_power_ports(self, power_ports, asset):
        if power_ports:
            pp_dict = {}
            for i in power_ports:
                if not i.get('pdu'):
                    continue
                try:
                    pdu = PDU.objects.get(name=i['pdu'])
                except PDU.DoesNotExist:
                    raise serializers.ValidationError({
                        'PDU Error': 'the PDU referenced by name {} does not exist.'.format(name=i['pdu'])
                    })
                try:
                    # pdu = i['pdu']
                    pdu_port = int(i['port_number'])
                    pp = pdu.power_port_set.all().filter(port_number=pdu_port).first()
                except Power_Port.DoesNotExist:
                    pp = None
                try:
                    assert pp is None
                except AssertionError:
                    if asset and pp.asset.id == asset.id:
                        pass
                    else:
                        raise serializers.ValidationError({
                            'PDU Error': 'PDU port {} on PDU {} is already in use by asset {}.'.format(pp.port_number,
                                                                                                       pdu.name,
                                                                                                       pp.asset.hostname)
                        })
                if i['pdu'] in pp_dict.keys():
                    if i['port_number'] in pp_dict[i['pdu']]:
                        raise serializers.ValidationError({
                        'PDU Port Error': 'PDU port {} on PDU {} is used multiple times by this asset'.format(i['port_number'], i['pdu'])
                        })
                    else:
                        pp_dict[i['pdu']].append(i['port_number'])
                else:
                    pp_dict[i['pdu']] = [i['port_number']]

    def create(self, validated_data):
        self.check_rack_u_validity(validated_data)
        self.check_power_ports(self.context['power_ports'], None)
        self.check_network_ports(self.context['network_ports'], validated_data, None)
        validated_data = self.check_asset_number(validated_data)
        return super().create(validated_data)

    def update(self, asset, validated_data):
        self.check_rack_u_validity(validated_data, asset)
        self.check_power_ports(self.context['power_ports'], asset)
        self.check_network_ports(self.context['network_ports'], validated_data, asset)
        try:
            assert asset.model == validated_data['model']
        except AssertionError:
            raise serializers.ValidationError({
                'model': 'The model of a deployed asset may not be changed to another model.'
            })
        return super().update(asset, validated_data)

    # adapted from https://stackoverflow.com/questions/2063213/regular-expression-for-validating-dns-label-host-name

    def validate_hostname(self, value):
        print("CALLED VALIDATE HOSTNAME")
        if not value:
            return value
        if not re.match('^(?![0-9]+$)(?!-)[a-zA-Z0-9-]{,63}(?<!-)$', value):
            raise serializers.ValidationError(
                '{} is not an valid hostname. Please ensure this value is a valid hostname as per RFC 1034.'.format(
                    value.__str__())
            )
        if value:
            try:
                Asset.objects.all().get(hostname=value)
                raise serializers.ValidationError(
                    '{} is not a unique hostname. Please ensure this value is unique across all assets.'.format(
                        value.__str__())
                )
                BladeServer.objects.all().get(hostname=value)
                raise serializers.ValidationError(
                    '{} is not a unique hostname. Please ensure this value is unique across all assets.'.format(
                        value.__str__())
                )
            except (Asset.DoesNotExist, BladeServer.DoesNotExist):
                pass
        return value

    def check_asset_number(self, validated_data):
        print('check asset number')
        try:
            validated_data['asset_number']
            bladeserver= True
            asset = True
            try:
                BladeServer.objects.get(asset_number=validated_data['asset_number'])
            except BladeServer.DoesNotExist:
                bladeserver = False
            try:
                Asset.objects.get(asset_number=validated_data['asset_number'])
            except Asset.DoesNotExist:
                asset = False
            if not bladeserver and not asset:
                print('asset number does not exist')
                bladeserver= True
                asset = True
                num = Asset_Number.objects.all().first()
                if not num:
                    num = Asset_Number.objects.create(next_avail=100000)
                    print('new num')
                if validated_data['asset_number'] == num.next_avail:
                    print('input is next avail')
                    curr = num.next_avail+1
                    while True:
                        bladeserver= True
                        asset = True
                        try:
                            BladeServer.objects.get(asset_number=curr)
                        except BladeServer.DoesNotExist:
                            bladeserver = False
                        try:
                            Asset.objects.get(asset_number=curr)
                        except Asset.DoesNotExist:
                            asset = False
                        print(asset)
                        print(bladeserver)
                        print(curr)
                        if not asset and not bladeserver:
                            num.next_avail = curr
                            num.save()
                            break
                        curr += 1

                return validated_data
            raise serializers.ValidationError(
                "Asset Number: {} is already taken.".format(validated_data['asset_number'])
            )
        except KeyError:
            print('key error')
            print(validated_data)
            num = Asset_Number.objects.all().first()
            if not num:
                num = Asset_Number.objects.create(next_avail=100000)
            # try:
            #     num = Asset_Number.objects.get(pk=1)
            # except Asset_Number.DoesNotExist:
            #     num = Asset_Number.objects.create(next_avail=100000)

            curr = num.next_avail
            bladeserver= True
            asset = True
            notset = True
            while True:
                try:
                    BladeServer.objects.get(asset_number=curr)
                except BladeServer.DoesNotExist:
                    bladeserver = False
                try:
                    Asset.objects.get(asset_number=curr)
                except Asset.DoesNotExist:
                    asset = False
                if not asset and not bladeserver:
                    if notset:
                        validated_data['asset_number'] = curr
                        notset = False
                    else:
                        num.next_avail = curr
                        num.save()
                        break
                curr += 1

            return validated_data

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname', 'datacenter', 'rack', 'rack_u', 'owner',
                  'ovr_color', 'ovr_storage', 'ovr_cpu', 'ovr_memory', 'comment', 'asset_number']


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
                  'power_ports', 'ovr_color', 'ovr_storage', 'ovr_cpu', 'ovr_memory', 'asset_number']


class AssetShortSerializer(AssetSerializer):
    model = ModelAssetSerializer()
    rack = RackOfAssetSerializer()
    owner = UserOfAssetSerializer()
    datacenter = DatacenterSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname', 'datacenter', 'rack', 'rack_u',
                  'ovr_color', 'ovr_storage', 'ovr_cpu', 'ovr_memory', 'asset_number', 'owner']

class AssetOfModelSerializer(serializers.HyperlinkedModelSerializer):
    datacenter = DatacenterSerializer()
    rack = RackOfAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'url', 'hostname', 'asset_number', 'datacenter', 'rack', 'rack_u',
                  'ovr_color', 'ovr_storage', 'ovr_cpu', 'ovr_memory', 'owner']


# For the network graph

class AssetTwoLevelsAwaySerializer(serializers.ModelSerializer):
    rack = RackOfAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'hostname', 'rack', 'rack_u']


class NetworkPortTwoDegreeAwaySerializer(serializers.ModelSerializer):
    asset = AssetTwoLevelsAwaySerializer()

    class Meta:
        model = Network_Port
        fields = ['name', 'asset']


class NetworkPortOneDegreeAwaySerializer(serializers.ModelSerializer):
    connection = NetworkPortTwoDegreeAwaySerializer()

    class Meta:
        model = Network_Port
        fields = ['name', 'connection']


class AssetOneLevelAwaySerializer(serializers.ModelSerializer):
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
