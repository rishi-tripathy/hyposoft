from django.contrib.auth.models import User
from backend.ass_man.models import Model, Instance, Rack
from rest_framework import serializers


class ModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
<<<<<<< HEAD
        fields = ['vendor', 'model_number', 'height', 'display_color',
        'ethernet_ports','power_ports', 'cpu', 'memory', 'storage', 'comment']

=======
        fields = ['id', 'vendor', 'model_number', 'height', 'display_color',
        'ethernet_ports','power_ports', 'cpu', 'memory', 'storage', 'comment']

class ModelShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['id', 'vendor', 'model_number', 'cpu', 'storage']

>>>>>>> dd96b0cbc881a66cafbf3cd4652df463e91c20ed

class InstanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Instance
<<<<<<< HEAD
        fields = ['model', 'hostname', 'rack', 'rack_u', 'owner', 'comment']
=======
        fields = ['id', 'model', 'hostname', 'rack', 'rack_u', 'owner', 'comment']

class InstanceShortSerializer(serializers.ModelSerializer):
    model = serializers.StringRelatedField()
    class Meta:
        model = Instance
        fields = ['id', 'model', 'hostname']
>>>>>>> dd96b0cbc881a66cafbf3cd4652df463e91c20ed


class RackSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rack
<<<<<<< HEAD
        fields = ['rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8',
=======
        fields = ['id', 'rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8',
>>>>>>> dd96b0cbc881a66cafbf3cd4652df463e91c20ed
        'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
        'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
        'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
        'u41', 'u42']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
<<<<<<< HEAD
        fields = ['url', 'username', 'email', 'groups']
=======
        fields = ['id', 'url', 'username', 'email', 'groups']
>>>>>>> dd96b0cbc881a66cafbf3cd4652df463e91c20ed
