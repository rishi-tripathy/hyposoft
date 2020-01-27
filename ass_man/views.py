from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
import re
from ass_man.models import Rack, Instance, Model
from django.contrib.auth.models import User


# Create your views here.

# API
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from ass_man.serializers import (InstanceShortSerializer,
                                 InstanceSerializer,
                                 ModelShortSerializer,
                                 ModelSerializer,
                                 RackSerializer,
                                 RackFetchSerializer,
                                 InstanceOfModelSerializer,
                                 VendorsSerializer)
# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# Project
from ass_man.models import Model, Instance, Rack
from ass_man.filters import ModelFilter

ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}


# Docs for ModelViewSet: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset

class ModelViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        # Instantiates and returns the list of permissions that this view requires.
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Model.objects.all()

    def get_serializer_class(self):
        detail = self.request.query_params.get('detail')
        serializer_class = ModelShortSerializer if detail == 'short' else ModelSerializer
        return serializer_class

    ordering_fields = ['vendor', 'model_number', 'height', 'display_color',
                       'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment']

    filterset_class = ModelFilter

    @action(detail=False, methods=['GET'])
    def vendors(self, request, *args, **kwargs):
        vendor_typed = self.request.query_params.get('vendor') or ''
        vendors = Model.objects.all().filter(vendor__istartswith=vendor_typed).distinct()
        serializer = VendorsSerializer(vendors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def instances(self, request, *args, **kwargs):
        instances = Instance.objects.all().filter(model=self.get_object())
        serializer = InstanceOfModelSerializer(instances, many=True, context={'request': request})
        return Response(serializer.data)

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

    # @action(detail=True, methods=['GET'])
    # def instances(self, request, *args, **kwargs):
    #     matches = Instance.objects.all().filter(model=self.get_object())
    #     return matches

    def destroy(self, request, *args, **kwargs):
        matches = Instance.objects.filter(model=self.get_object())
        if matches.count() > 0:
            offending_instances = []
            for match in matches:
                offending_instances.append(match.rack.rack_number.__str__() + match.rack_u.__str__())
            return Response('Cannot delete this model as there are associated instances at the following locations: ' +
                            ', '.join(offending_instances),
                            status=status.HTTP_400_BAD_REQUEST)
        super().destroy(self, request, *args, **kwargs)


class InstanceViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        # Instantiates and returns the list of permissions that this view requires.
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Instance.objects.all()

# TODO: Update, partial update

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inst = serializer.save()
        rack = inst.rack
        for i in range(inst.rack_u, inst.rack_u+inst.model.height):
            exec('rack.u{} = inst'.format(i))
        rack.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer_class(self):
        detail = self.request.query_params.get('detail')
        serializer_class = InstanceShortSerializer if detail == 'short' else InstanceSerializer
        return serializer_class

    ordering_fields = ['model', 'model__model_number', 'model__vendor',
                       'hostname', 'rack', 'rack_u', 'owner', 'comment']

    filterset_fields = ['model', 'model__model_number', 'model__vendor',
                        'hostname', 'rack', 'rack_u', 'owner', 'comment']


class RackViewSet(viewsets.ModelViewSet):
    # API endpoint that allows groups to be viewed or edited.

    def get_permissions(self):
        # Instantiates and returns the list of permissions that this view requires.
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

    filterset_fields = ['rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8',
                        'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'u19', 'u20',
                        'u21', 'u22', 'u23', 'u24', 'u25', 'u26', 'u27', 'u28', 'u29', 'u30',
                        'u31', 'u32', 'u33', 'u34', 'u35', 'u36', 'u37', 'u38', 'u39', 'u40',
                        'u41', 'u42']

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

    def destroy(self, request, *args, **kwargs):
        u_filled = 0
        slots = ['u{}'.format(i) for i in range(1, 43)]
        for slot in slots:
            if getattr(self.get_object(), slot):
                u_filled += 1
        if u_filled > 0:
            return Response('Cannot delete this rack as it is not empty.',
                            status=status.HTTP_400_BAD_REQUEST)
        super().destroy(self, request, *args, **kwargs)

    def get_serializer_class(self):
        serializer_class = RackFetchSerializer if self.request.method == 'GET' else RackSerializer
        return serializer_class
