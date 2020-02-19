from ass_man.models import Datacenter
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class DatacenterSerializer(serializers.HyperlinkedModelSerializer):
    abbreviation = serializers.CharField(validators=[UniqueValidator(queryset=Datacenter.objects.all())])
    name = serializers.CharField(validators=[UniqueValidator(queryset=Datacenter.objects.all())])

    class Meta:
        model = Datacenter
        fields = ['id', 'abbreviation', 'name']
