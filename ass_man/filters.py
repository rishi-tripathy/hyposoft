from rest_framework import generics
from django_filters import rest_framework as filters
from ass_man.models import Model, Instance, Rack
from rest_framework import filters as rest_filters
from django.db.models.functions import Substr
from rest_framework.validators import ValidationError
from rest_framework.response import Response


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


class InstanceFilterByRack(rest_filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        # If this filter is not being invoked:
        if not request.query_params.get('rack_num_start') or not request.query_params.get('rack_num_end'):
            return queryset

        # If it is being invoked:
        start_letter = request.query_params.get('rack_num_start')[0]
        start_number = request.query_params.get('rack_num_start')[1:]
        end_letter = request.query_params.get('rack_num_end')[0]
        end_number = request.query_params.get('rack_num_end')[1:]
        return queryset \
            .annotate(rack_num_letter=Substr('rack__rack_number', 1, 1)) \
            .annotate(rack_num_number=Substr('rack__rack_number', 2, None)) \
            .filter(rack__rack_num_letter__range=(start_letter, end_letter)) \
            .filter(rack__rack_num_number__range=(start_number, end_number))


class RackFilter(rest_filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        # If this filter is not being invoked:
        if not request.query_params.get('rack_num_start') or not request.query_params.get('rack_num_end'):
            return queryset

        # If it is being invoked:
        start_letter = request.query_params.get('rack_num_start')[0]
        start_number = request.query_params.get('rack_num_start')[1:]
        end_letter = request.query_params.get('rack_num_end')[0]
        end_number = request.query_params.get('rack_num_end')[1:]
        return queryset\
            .annotate(rack_num_letter=Substr('rack_number', 1, 1))\
            .annotate(rack_num_number=Substr('rack_number', 2, None))\
            .filter(rack_num_letter__range=(start_letter, end_letter))\
            .filter(rack_num_number__range=(start_number, end_number))

