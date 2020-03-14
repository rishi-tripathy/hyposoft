from ass_man.models import Asset, Rack, PDU
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
import re

from ass_man.serializers.pdu_serializers import PDUSerializer
from ass_man.serializers.model_serializers import ModelAssetSerializer


class RackAssetSerializer(serializers.ModelSerializer):
    model = ModelAssetSerializer()

    class Meta:
        model = Asset
        fields = ['id', 'model', 'hostname']


class RackSerializer(serializers.HyperlinkedModelSerializer):

    def create(self, validated_data):
        rack = super().create(validated_data)
        if len(validated_data['rack_number']) < 3:
            root_name = 'hpdu-{}-{}'.format(validated_data['datacenter'].abbreviation.lower(), validated_data['rack_number'][0]+"0"+validated_data['rack_number'][1])
        else:
            root_name = 'hpdu-{}-{}'.format(validated_data['datacenter'].abbreviation.lower(), validated_data['rack_number'])
        rack.pdu_l = PDU.objects.create(name=(root_name + 'L'), rack=rack)
        rack.pdu_r = PDU.objects.create(name=(root_name + 'R'), rack=rack)
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
        validators = [
            UniqueTogetherValidator(
                queryset=Rack.objects.all(),
                fields=['datacenter', 'rack_number']
            )
        ]


# Used to fetch the Rack associated with an Asset
class RackOfAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rack
        fields = ['id', 'url', 'rack_number']


class RackFetchSerializer(serializers.HyperlinkedModelSerializer):
    pdu_l = PDUSerializer()
    pdu_r = PDUSerializer()

    for i in range(1, 43):
        s = 'u{} = RackAssetSerializer()'.format(i)
        exec(s)

    class Meta:
        model = Rack
        fields = ['id', 'url', 'datacenter', 'rack_number', 'pdu_l', 'pdu_r', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7',
                  'u8', 'u9', 'u10',
                  'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                  'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                  'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                  'u41', 'u42']
