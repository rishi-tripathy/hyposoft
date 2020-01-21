from django.contrib.auth.models import User
from backend.ass_man.models import Model, Instance, Rack
from rest_framework import serializers


class ModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['vendor', 'model_number', 'height', 'display_color',
        'ethernet_ports','power_ports', 'cpu', 'memory', 'storage', 'comment']


class InstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Instance
        fields = ['model', 'hostname', 'rack', 'rack_u', 'owner', 'comment']


class RackSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rack
        fields = ['rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8',
        'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
        'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
        'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
        'u41', 'u42']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']
