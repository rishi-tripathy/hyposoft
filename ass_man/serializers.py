from ass_man.models import Model, Instance, Rack
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator
from django.core.validators import MinLengthValidator, MinValueValidator
from ass_man.validators import (validate_color as ColorValidator,
                                validate_hostname as HostnameValidator,
                                validate_rack_number as RackNumberValidator)


class ModelSerializer(serializers.HyperlinkedModelSerializer):
    display_color = serializers.CharField(validators=
                                          [ColorValidator,
                                           MinLengthValidator(6)]
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


class InstanceSerializer(serializers.HyperlinkedModelSerializer):
    hostname = serializers.CharField(validators=[HostnameValidator])
    rack_u = serializers.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        model = Instance
        fields = ['id', 'model', 'hostname', 'rack', 'rack_u', 'owner', 'comment']


class InstanceShortSerializer(serializers.ModelSerializer):
    model = serializers.StringRelatedField()

    class Meta:
        model = Instance
        fields = ['id', 'model', 'hostname']


class RackSerializer(serializers.HyperlinkedModelSerializer):
    rack_number = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=Rack.objects.all()), RackNumberValidator]
    )

    class Meta:
        model = Rack
        fields = ['id', 'rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10',
                  'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                  'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                  'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                  'u41', 'u42']

