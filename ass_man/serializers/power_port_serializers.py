from ass_man.models import Power_Port
from rest_framework import serializers


class PowerPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Power_Port
        fields = ['pdu', 'port_number', 'asset']
