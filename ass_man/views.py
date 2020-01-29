from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import Concat
from django.db.models import CharField
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
# Project
from ass_man.models import Model, Instance, Rack
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend as DjangoFiltersBackend
from ass_man.filters import InstanceFilter, ModelFilter, RackFilter, InstanceFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json

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
        return super().destroy(self, request, *args, **kwargs)

    # Custom actions below
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
        return super().destroy(self, request, *args, **kwargs)

    # New Actions
    @action(detail=False, methods=['POST', 'DELETE'])
    def many(self, request, *args, **kwargs):
        try:
            srn = request.data['start_rack_num']
            ern = request.data['end_rack_num']
        except KeyError:
            return Response('Invalid rack range- must specify start and end rack number',
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            s_letter = srn[0].upper()
            e_letter = ern[0].upper()
            s_number = int(srn[1:])
            e_number = int(ern[1:])

            try:
                assert(s_letter <= e_letter)
            except AssertionError:
                return Response('Your start letter must be less than or equal to your end letter',
                                status=status.HTTP_400_BAD_REQUEST)
            try:
                assert(s_number <= e_number)
            except AssertionError:
                return Response('Your start number must be less than or equal to your end number',
                                status=status.HTTP_400_BAD_REQUEST)
            rack_numbers = [x + y
                            for x in
                            (chr(i) for i in range(ord(s_letter), ord(e_letter) + 1))
                            for y in
                            (str(j) for j in range(s_number, e_number + 1))
                            ]
            results = []
            for rn in rack_numbers:
                rn_request_data = {
                    "rack_number": rn
                }
                if request.method == 'POST':
                    try:
                        serializer = self.get_serializer(data=rn_request_data)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        results.append(rn + ' successfully created')
                    except ValidationError:
                        results.append('Warning: skipping rack ' + rn + ' as it already exists')

                elif request.method == 'DELETE':
                    try:
                        instance = self.queryset.get(rack_number__iexact=rn)
                        instance.delete()
                        results.append(rn + ' successfully deleted')
                    except AssertionError:
                        results.append(('Error: rack ' + rn + ' cannot be deleted as it does not exist. Continuing...'))
        except (IndexError, ValueError) as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(results, status.HTTP_207_MULTI_STATUS)

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


