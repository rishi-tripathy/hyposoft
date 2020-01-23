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
                                 RackSerializer)
# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# Project
from ass_man.models import Model, Instance, Rack

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

    filter_backends = [OrderingFilter, ]

    ordering_fields = ['vendor', 'model_number', 'height', 'display_color',
                       'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment']

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

    def destroy(self, request, *args, **kwargs):
        matches = Instance.objects.filter(model=self.get_object())
        if matches.count() > 0:
            return Response('Cannot delete this model as there exists an associated instance',
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


    filter_backends = [OrderingFilter, ]

    def create(self, request, *args, **kwargs):
        model_id_str = re.search(r"models/(\d+)", request.data['model'])
        model_id = int(model_id_str.groups()[0])
        model = Model.objects.get(pk=model_id)
        owner_id_str = re.search(r"users/(\d+)", request.data['owner'])
        owner_id = int(owner_id_str.groups()[0])
        owner = User.objects.get(pk=owner_id)
        rack_uri = request.data['rack']
        rack_id_str = re.search(r"racks/(\d+)", rack_uri)
        rack_id = int(rack_id_str.groups()[0])
        rack = Rack.objects.get(pk=rack_id)
        instance = Instance(model=model, hostname=request.data['hostname'], rack=rack, rack_u=request.data['rack_u'], owner=owner, comment=request.data['comment'])
        instance.save()

        rack_u_str = request.data['rack_u']
        rack_u = int(rack_u_str)
        for i in range(model.height):
            rack_u_field = 'u'+str(rack_u)
            setattr(rack, rack_u_field, instance)
            rack_u+=1
        rack.save()
        return super().create(request)


    def get_serializer_class(self):
        detail = self.request.query_params.get('detail')
        serializer_class = InstanceShortSerializer if detail == 'short' else InstanceSerializer
        return serializer_class

    ordering_fields = ['model', 'model__model_number', 'model__vendor',
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

    serializer_class = RackSerializer

    filter_backends = [OrderingFilter, ]

    ordering_fields = ['rack_number', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8',
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
