from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import Concat
from django.db.models import CharField
from django.http import HttpResponse
# API
from rest_framework import viewsets
from ass_man.serializers import (InstanceShortSerializer,
                                 InstanceSerializer,
                                 InstanceFetchSerializer,
                                 ModelShortSerializer,
                                 ModelSerializer,
                                 RackSerializer,
                                 RackFetchSerializer,
                                 InstanceOfModelSerializer,
                                 VendorsSerializer,
                                 UniqueModelsSerializer,
                                 VendorsSerializer)

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import Model, Instance, Rack
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend as DjangoFiltersBackend
from ass_man.filters import InstanceFilter, ModelFilter, RackFilter, InstanceFilterByRack

import csv

ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}


# Docs for ModelViewSet: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset

class ModelViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Model.objects.all()


    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = ModelSerializer if self.detail else ModelShortSerializer
        else:
            serializer_class = ModelSerializer
        return serializer_class

    ordering_fields = ['vendor', 'model_number', 'height', 'display_color',
                       'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage']

    filterset_fields = ['vendor', 'model_number', 'height', 'display_color',
                        'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage']

    # Overriding of super functions
    def destroy(self, request, *args, **kwargs):
        matches = Instance.objects.filter(model=self.get_object())
        if matches.count() > 0:
            offending_instances = []
            for match in matches:
                offending_instances.append(match.hostname.__str__() +
                                           ' at ' +
                                           match.rack.rack_number.__str__() +
                                           ' U' +
                                           match.rack_u.__str__())
            return Response('Cannot delete this model as there are associated instances: ' +
                            ', '.join(offending_instances),
                            status=status.HTTP_400_BAD_REQUEST)
        super().destroy(self, request, *args, **kwargs)

    # Custom actions below
    @action(detail=False, methods=['GET'])
    def export(self, request, *args, **kwargs):
        models = Model.objects.all()
    #    vendor,model_number,height,display_color,ethernet_ports,power_ports,cpu,memory,storage,comment
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="models.csv"'

        writer = csv.writer(response)
        writer.writerow(['vendor', 'model_number', 'height', 'display_color', 'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment'])
        for model in models:
            writer.writerow([model.vendor, model.model_number, model.height, model.display_color, model.ethernet_ports, model.power_ports, model.cpu, model.memory, model.storage, model.comment])


        return response

    @action(detail=True, methods=['GET'])
    def can_delete(self, request, *args, **kwargs):
        matches = Instance.objects.all().filter(model=self.get_object())
        if matches.count() > 0:
            return Response({
                'can_delete': 'false'
            })
        return Response({
            'can_delete': 'true'
        })

    @action(detail=False, methods=['GET'])
    def vendors(self, request, *args, **kwargs):
        vendor_typed = self.request.query_params.get('vendor') or ''
        vendors = Model.objects.all().filter(vendor__istartswith=vendor_typed).distinct()
        serializer = VendorsSerializer(vendors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def instances(self, request, *args, **kwargs):
        instances = Instance.objects.all().filter(model=self.get_object())
        page = self.paginate_queryset(instances)
        if page is not None:
            serializer = InstanceOfModelSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = InstanceOfModelSerializer(instances, many=True, context={'request': request})
        return Response(serializer.data)


class InstanceViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Instance.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = InstanceFetchSerializer if self.detail else InstanceShortSerializer
        else:
            serializer_class = InstanceSerializer
        return serializer_class

    ordering_fields = ['model', 'model__model_number', 'model__vendor',
                       'hostname', 'rack', 'rack_u', 'owner']

    filterset_fields = ['model', 'model__model_number', 'model__vendor',
                        'hostname', 'rack', 'rack_u', 'owner']

    filter_backends = [OrderingFilter,
                       DjangoFiltersBackend,
                       InstanceFilterByRack]
    # Overriding of super functions

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        rack = instance.rack
        for i in range(instance.rack_u, instance.rack_u+instance.model.height):
            exec('rack.u{} = instance'.format(i))
        rack.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        prev_rack = instance.rack
        prev_rack_u = instance.rack_u
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        for i in range(prev_rack_u, prev_rack_u + instance.model.height):
            exec('prev_rack.u{} = None'.format(i))
        prev_rack.save()
        self.perform_update(serializer)
        instance = self.get_object()
        new_rack = instance.rack
        for i in range(instance.rack_u, instance.rack_u+instance.model.height):
            exec('new_rack.u{} = instance'.format(i))
        new_rack.save()
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    # Custom actions below

    @action(detail=False, methods=['GET'])
    def model_names(self, request, *args, **kwargs):
        name_typed = self.request.query_params.get('name') or ''
        models = Model.objects.annotate(
            unique_name=Concat('vendor', 'model_number')).\
            filter(unique_name__icontains=name_typed).all()
        serializer = UniqueModelsSerializer(models, many=True, context={'request': request})
        return Response(serializer.data)


class RackViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Rack.objects.all()

    ordering_fields = ['rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8',
                       'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                       'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                       'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                       'u41', 'u42']

    filter_backends = [OrderingFilter,
                       DjangoFiltersBackend,
                       RackFilter]

    filterset_fields = ['rack_number']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = RackFetchSerializer
        else:
            serializer_class = RackSerializer
        return serializer_class

    # Overriding of super functions
    def destroy(self, request, *args, **kwargs):
        slots = ['u{}'.format(i) for i in range(1, 43)]
        offending_instances = []
        for slot in slots:
            match = getattr(self.get_object(), slot)
            if match:
                offending_instances.append(match.hostname.__str__()
                                           + ' at ' +
                                           match.rack.rack_number.__str__() +
                                           ' ' +
                                           slot.__str__())
        if len(offending_instances) > 0:
            return Response('Cannot delete this rack as it contains instances: ' +
                            ', '.join(offending_instances),
                            status=status.HTTP_400_BAD_REQUEST)
        super().destroy(self, request, *args, **kwargs)

    # New Actions
    @action(detail=True, methods=['GET'])
    def is_empty(self, request, *args, **kwargs):
        u_filled = 0
        slots = ['u{}'.format(i) for i in range(1, 43)]
        for field_name in slots:
            if getattr(self.get_object(), field_name):
                u_filled += 1
        if u_filled > 0:
            return Response({
                'is_empty': 'false'
            })
        return Response({
            'is_empty': 'true'
        })

    # Custom actions below
@api_view(['GET'])
def report(request):
    racks = Rack.objects.all()
    total = 0
    occupied = 0
    slots = ['u{}'.format(i) for i in range(1, 43)]
    for rack in racks:
        for field_name in slots:
            if getattr(rack, field_name):
                occupied += 1
            total += 1
    if (total == 0):
        total += 1
    percentage_occupied = occupied/total*100
    percentage_free = (total-occupied)/total*100

    instances = Instance.objects.all()
    vendor_dict = {}
    model_dict = {}
    owner_dict = {}
    for instance in instances:
        if instance.model_id in model_dict:
            model_dict[instance.model_id] += 1
        else:
            model_dict[instance.model_id] = 1
        if instance.owner_id in owner_dict:
            owner_dict[instance.owner_id] += 1
        else:
            owner_dict[instance.owner_id] = 1

    model_dict_by_model_number = {}
    for model in model_dict.keys():
        model_obj = Model.objects.get(pk=model)
        model_dict_by_model_number[model_obj.model_number] = model_dict[model]
        if model_obj.vendor in vendor_dict:
            vendor_dict[model_obj.vendor] += model_dict[model]
        else:
            vendor_dict[model_obj.vendor] = model_dict[model]

    owner_dict_by_username = {}
    for owner_id in owner_dict.keys():
        owner = User.objects.get(pk=owner_id)
        owner_dict_by_username[owner.username] = owner_dict[owner_id]

    return Response({
    'rackspace_used': percentage_occupied,
    'rackspace_free': percentage_free,
    'models_allocated':model_dict_by_model_number,
    'vendors_allocated':vendor_dict,
    'owners_allocated':owner_dict_by_username
    })
