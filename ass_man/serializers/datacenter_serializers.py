from ass_man.models import Datacenter
from rest_framework import serializers


class DatacenterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Datacenter
        fields = ['id', 'abbreviation', 'name']
