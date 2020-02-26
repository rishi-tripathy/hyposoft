from ass_man.models import PDU
from rest_framework import serializers


class PDUSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDU
        fields = ['id', 'name']
