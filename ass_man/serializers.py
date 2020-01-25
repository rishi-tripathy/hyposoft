from ass_man.models import Model, Instance, Rack
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator
from django.core.validators import MinLengthValidator, MinValueValidator


import re
from django.core.exceptions import ValidationError


class ModelSerializer(serializers.HyperlinkedModelSerializer):
    display_color = serializers.CharField(validators=[MinLengthValidator(6)])


    def validate_display_color(self, value):
        if not re.match('^[A-Fa-f0-9]*$', value):
            raise ValidationError(
                '%(value)s is not an valid color. Please ensure this value is a RGB specifier between 000000-FFFFFF',
                params={'value': value},
            )

    class Meta:
        model = Model
        fields = ['id', 'vendor', 'model_number', 'height', 'display_color',
                  'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment']
        validators = [
            UniqueTogetherValidator(
                queryset=Model.objects.all(),
                fields=['vendor', 'model_number']
            )
        ]


class ModelShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['id', 'vendor', 'model_number', 'cpu', 'storage']

class ModelInstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['url', 'vendor', 'model_number', 'display_color']


class InstanceSerializer(serializers.HyperlinkedModelSerializer):
    rack_u = serializers.IntegerField(validators=[MinValueValidator(1)])
    model = ModelInstanceSerializer()
    # adapted from https://stackoverflow.com/questions/2063213/regular-expression-for-validating-dns-label-host-name
    def validate_hostname(self, value):
        if not re.match('^(?![0-9]+$)(?!-)[a-zA-Z0-9-]{,63}(?<!-)$', value):
            raise ValidationError(
                '%(value)s is not an valid hostname. Please ensure this value is a valid hostname as per RFC 1034.',
                params={'value': value},
            )

    class Meta:
        model = Instance
        fields = ['id', 'model', 'hostname', 'rack', 'rack_u', 'owner', 'comment']


class InstanceShortSerializer(serializers.ModelSerializer):
    model = ModelInstanceSerializer()

    class Meta:
        model = Instance
        fields = ['id', 'model', 'hostname']


class RackSerializer(serializers.HyperlinkedModelSerializer):
    rack_number = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=Rack.objects.all())]
    )

    def validate_rack_number(self, value):
        if not re.match('^[A-Z][0-9]+$', value):
            raise ValidationError(
                '%(value)s is not a valid rack number. Please ensure this value is a '
                'capital letter followed by a positive number, e.g. "B12"',
                params={'value': value},
            )

    class Meta:
        model = Rack
        fields = ['id', 'rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10',
                  'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                  'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                  'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                  'u41', 'u42']

class InstaceOfModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Instance
        fields = ['url', 'model', 'hostname', 'rack', 'owner']

class RackInstanceSerializer(serializers.ModelSerializer):
    model = ModelInstanceSerializer()
    class Meta:
        model = Instance
        fields = ['url', 'model', 'hostname']

class RackFetchSerializer(serializers.HyperlinkedModelSerializer):
    for i in range(1,42):
        s = 'u%d = RackInstanceSerializer()'%(i)
        exec(s)
    #u1 = RackInstanceSerializer(source='u1')

    class Meta:
        model = Rack
        fields = ['id', 'rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10',
                  'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                  'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                  'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                  'u41', 'u42']

# class InstanceFetchSerializer(serializers.HyperlinkedModelSerializer):
#     model = ModelInstanceSerializer()
#
#     class Meta:
#         model = Instance
#         fields = ['id', 'model', 'hostname', 'rack', 'rack_u', 'owner', 'comment']
