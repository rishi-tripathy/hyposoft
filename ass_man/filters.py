from rest_framework import generics
from django_filters import rest_framework as filters
from ass_man.models import Model, Instance, Rack


class ModelFilter(filters.FilterSet):
    vendor = filters.CharFilter(field_name='vendor', lookup_expr='icontains')
    model_number = filters.CharFilter(field_name='model_number', lookup_expr='icontains')
    height = filters.NumericRangeFilter(field_name='height', lookup_expr='range')
    color = filters.CharFilter(field_name='display_color', lookup_expr='iexact')
    ethernet = filters.NumericRangeFilter(field_name='height', lookup_expr='range')
    power = filters.NumericRangeFilter(field_name='power_ports', lookup_expr='range')
    cpu = filters.CharFilter(field_name='cpu', lookup_expr='icontains')
    memory = filters.NumericRangeFilter(field_name='memory', lookup_expr='range')
    storage = filters.CharFilter(field_name='storage', lookup_expr='icontains')
    comment = filters.CharFilter(field_name='comment', lookup_expr='icontains')

    class Meta:
        model = Model
        fields = ['vendor', 'model_number', 'height', 'color', 'ethernet',
                  'power', 'cpu', 'memory', 'storage', 'comment']


class InstanceFilter(filters.FilterSet):
    vendor = filters.CharFilter(field_name='model__vendor', lookup_expr='icontains')
    model_number = filters.CharFilter(field_name='model__model_number', lookup_expr='icontains')
    hostname = filters.CharFilter(field_name='hostname', lookup_expr='icontains')
    owner = filters.CharFilter(field_name='owner__username', lookup_expr='icontains')
    comment = filters.CharFilter(field_name='comment', lookup_expr='icontains')

    class Meta:
        model = Instance
        fields = ['vendor', 'model_number', 'hostname', 'owner', 'comment']




