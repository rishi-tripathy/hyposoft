from ass_man.models import Model, Asset
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
import re


class ModelSerializer(serializers.HyperlinkedModelSerializer):
    display_color = serializers.CharField()
    network_ports = serializers.ListField(child=serializers.CharField())

    def update(self, model, validated_data):
        matches = Asset.objects.filter(model=model)
        if matches:  # only need to check if there are deployed assets
            try:
                assert model.height == validated_data['height']
            except AssertionError:
                raise serializers.ValidationError({
                    'height': 'Height may not be updated as there are {} deployed assets. See detail page of this model.'.format(
                        len(matches))
                }
                )

            try:
                assert model.network_ports == validated_data['network_ports']
            except AssertionError:
                raise serializers.ValidationError({
                    'network_ports': 'Network port names may not be updated as there are {} deployed assets. See detail page of this model.'.format(
                        len(matches))
                }
                )

            try:
                assert model.power_ports == validated_data['power_ports']
            except AssertionError:
                raise serializers.ValidationError({
                    'power_ports': 'Number of power ports may not be updated as there are {} deployed assets. See detail page of this model.'.format(
                        len(matches))
                }
                )

        return super().update(model, validated_data)

    def validate_display_color(self, value):
        if not re.match('^[A-Fa-f0-9]{6}$', value):
            raise serializers.ValidationError(
                '{} is not an valid color. '
                'Please ensure this value is a RGB specifier between 000000-FFFFFF'.format(value.__str__())
            )
        return value

    class Meta:
        model = Model
        fields = ['id', 'vendor', 'model_number', 'height', 'display_color',
                  'network_ports_num', 'network_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment']
        validators = [
            UniqueTogetherValidator(
                queryset=Model.objects.all(),
                fields=['vendor', 'model_number']
            )
        ]


class ModelShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['id', 'vendor', 'model_number', 'height', 'display_color', 'network_ports_num', 'network_ports', 'power_ports', 'cpu',
                  'memory', 'storage']


class UniqueModelsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['id', 'url', 'vendor', 'model_number']


class ModelAssetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Model
        fields = ['url', 'vendor', 'model_number', 'display_color']


