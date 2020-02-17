from ass_man.models import Model, Asset, Rack, Network_Port, Power_Port, Datacenter, PDU
from rest_framework import serializers, status
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator
from django.core.validators import MinLengthValidator, MinValueValidator
from usr_man.serializers import UserOfAssetSerializer
import re
from rest_framework.fields import ListField
from django.core.exceptions import ObjectDoesNotExist


class DatacenterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Datacenter
        fields = ['abbreviation', 'name']


class ModelSerializer(serializers.HyperlinkedModelSerializer):
    display_color = serializers.CharField()
    network_ports = serializers.ListField(child=serializers.CharField())

    def update(self, model, validated_data):
        matches = Asset.objects.filter(model=model)
        if matches:  # only need to check if there are deployed assets
            try:
                assert model.height == validated_data['height']
            except AssertionError:
                raise serializers.ValidationError({
                    'height': 'Height may not be updated as there are {} deployed assets. See detail page of this model.'.format(
                        len(matches))
                }
                )

            try:
                assert model.network_ports == validated_data['network_ports']
            except AssertionError:
                raise serializers.ValidationError({
                    'network_ports': 'Network port names may not be updated as there are {} deployed assets. See detail page of this model.'.format(
                        len(matches))
                }
                )

            try:
                assert model.power_ports == validated_data['power_ports']
            except AssertionError:
                raise serializers.ValidationError({
                    'power_ports': 'Number of power ports may not be updated as there are {} deployed assets. See detail page of this model.'.format(
                        len(matches))
                }
                )

        return super().update(model, validated_data)

    def validate_display_color(self, value):
        if not re.match('^[A-Fa-f0-9]{6}$', value):
            raise serializers.ValidationError(
                '{} is not an valid color. '
                'Please ensure this value is a RGB specifier between 000000-FFFFFF'.format(value.__str__())
            )
        return value

    class Meta:
        model = Model
        fields = ['id', 'vendor', 'model_number', 'height', 'display_color',
                  'network_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment']
        validators = [
            UniqueTogetherValidator(
                queryset=Model.objects.all(),
                fields=['vendor', 'model_number']
            )
        ]


class ModelShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['id', 'vendor', 'model_number', 'height', 'display_color', 'network_ports', 'power_ports', 'cpu',
                  'memory', 'storage']


class UniqueModelsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['id', 'url', 'vendor', 'model_number']


class ModelAssetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['url', 'vendor', 'model_number', 'display_color']


class VendorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = ['vendor', 'url']


class NetworkPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Network_Port
        fields = ['name', 'mac', 'connection']

class PowerPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Power_Port
        fields = ['pdu', 'port_number']


class PowerPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Power_Port
        fields = ['pdu', 'port_number', 'asset']

class PDUSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDU
        fields = ['name']


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


# Used to fetch the Rack associated with an Asset
class RackOfAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rack
        fields = ['url', 'rack_number']


# Used to fetch the Rack associated with an Asset
class RackOfAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rack
        fields = ['url', 'rack_number']


class AssetFetchSerializer(AssetSerializer):
    model = ModelAssetSerializer()
    rack = RackOfAssetSerializer()
    owner = UserOfAssetSerializer()
    network_ports = NetworkPortSerializer(source='network_port_set', many=True)
    power_ports = PowerPortSerializer(source='power_port_set', many=True)
    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname', 'datacenter', 'rack', 'rack_u', 'owner', 'comment', 'network_ports', 'power_ports', 'asset_number']


class AssetShortSerializer(AssetSerializer):
    model = ModelAssetSerializer()
    rack = RackOfAssetSerializer()
    owner = UserOfAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname', 'rack', 'rack_u', 'owner']


class RackSerializer(serializers.HyperlinkedModelSerializer):
    rack_number = serializers.CharField(
        validators=[UniqueValidator(queryset=Rack.objects.all())]
    )

    def create(self, validated_data):
        rack = super().create(validated_data)
        root_name = 'hpdu-{}-{}'.format(validated_data['datacenter'].abbreviation, validated_data['rack_number'])
        rack.pdu_l = PDU.objects.create(name=(root_name + '-l'))
        rack.pdu_r = PDU.objects.create(name=(root_name + '-r'))
        rack.save()
        return rack

    def validate_rack_number(self, value):
        if not re.match('^[A-Z][0-9]+$', value):
            raise serializers.ValidationError(
                '{} is not a valid rack number. Please ensure this value is a capital letter followed by a positive number, e.g. "B12"'.format(
                    value.__str__())
            )
        return value

    class Meta:
        model = Rack
        fields = ['id', 'rack_number', 'datacenter', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10',
                  'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                  'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                  'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                  'u41', 'u42']


class AssetOfModelSerializer(serializers.HyperlinkedModelSerializer):
    rack = RackOfAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'url', 'hostname', 'rack', 'rack_u', 'owner']


class RackAssetSerializer(serializers.ModelSerializer):
    model = ModelAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname']


class RackFetchSerializer(serializers.HyperlinkedModelSerializer):
    pdu_l = PDUSerializer()
    pdu_r = PDUSerializer()

    for i in range(1, 43):
        s = 'u{} = RackAssetSerializer()'.format(i)
        exec(s)

    class Meta:
        model = Rack
        fields = ['id', 'url', 'rack_number', 'pdu_l', 'pdu_r', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10',
                  'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                  'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                  'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                  'u41', 'u42']
