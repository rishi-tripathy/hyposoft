from ass_man.models import Power_Port
from ass_man.serializers.pdu_serializers import PDUSerializer
from rest_framework import serializers


class PowerPortSerializer(serializers.ModelSerializer):
    pdu = PDUSerializer()
    class Meta:
        model = Power_Port
        fields = ['id', 'name', 'pdu', 'port_number', 'asset']
