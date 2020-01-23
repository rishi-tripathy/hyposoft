from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
import re
from ass_man.models import Rack, Instance, Model
from django.contrib.auth.models import User

# Create your views here.

# API
from rest_framework import viewsets
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

    # permission_classes = [AllowAny]
    queryset = Model.objects.all()

    def get_serializer_class(self):
        detail = self.request.query_params.get('detail')
        serializer_class = ModelShortSerializer if detail == 'short' else ModelSerializer
        return serializer_class

    # Example for how to add custom actions below
    # @action(detail=True)
    # def short(self, request, *args, **kwargs):
    #     queryset = Model.objects.all()
    #     serializer_class = ModelShortSerializer(queryset, many=True)
    #     return Response(serializer_class.data)


class InstanceViewSet(viewsets.ModelViewSet):
    # API endpoint that allows groups to be viewed or edited.

    def get_permissions(self):
        # Instantiates and returns the list of permissions that this view requires.
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # permission_classes = [AllowAny]
    queryset = Instance.objects.all()

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
            if rack_u == 1:
                rack.u1 = instance
            elif rack_u == 2:
                rack.u2 = instance
            elif rack_u == 3:
                rack.u3 = instance
            elif rack_u == 4:
                rack.u4 = instance
            elif rack_u == 5:
                rack.u5 = instance
            elif rack_u == 6:
                rack.u6 = instance
            elif rack_u == 7:
                rack.u7 = instance
            elif rack_u == 8:
                rack.u8 = instance
            elif rack_u == 9:
                rack.u9 = instance
            elif rack_u == 10:
                rack.u10 = instance
            elif rack_u == 11:
                rack.u11 = instance
            elif rack_u == 12:
                rack.u12 = instance
            elif rack_u == 13:
                rack.u14 = instance
            elif rack_u == 15:
                rack.u15 = instan
            elif rack_u == 16:
                rack.u16 = instance
            elif rack_u == 17:
                rack.u17 = instance
            elif rack_u == 18:
                rack.u18 = instance
            elif rack_u == 19:
                rack.u19 = instance
            elif rack_u == 20:
                rack.u20 = instance
            elif rack_u == 21:
                rack.u21 = instance
            elif rack_u == 22:
                rack.u22 = instance
            elif rack_u == 23:
                rack.u23 = instance
            elif rack_u == 24:
                rack.u24 = instance
            elif rack_u == 25:
                rack.u25 = instance
            elif rack_u == 26:
                rack.u26 = instance
            elif rack_u == 27:
                rack.u27 = instance
            elif rack_u == 28:
                rack.u28 = instance
            elif rack_u == 29:
                rack.u29 = instance
            elif rack_u == 30:
                rack.u30 = instance
            elif rack_u == 31:
                rack.u31 = instance
            elif rack_u == 32:
                rack.u32 = instance
            elif rack_u == 33:
                rack.u33 = instance
            elif rack_u == 34:
                rack.u34 = instance
            elif rack_u == 35:
                rack.u35 = instance
            elif rack_u == 36:
                rack.u36 = instance
            elif rack_u == 37:
                rack.u37 = instance
            elif rack_u == 38:
                rack.u38 = instance
            elif rack_u == 39:
                rack.u39 = instance
            elif rack_u == 40:
                rack.u40 = instance
            elif rack_u == 41:
                rack.u41 = instance
            elif rack_u == 42:
                rack.u42 = instance
            rack_u+=1

        #setattr(rack, rack_u, instance)
        rack.save()
        return super().create(request)

    def get_serializer_class(self):
        detail = self.request.query_params.get('detail')
        serializer_class = InstanceShortSerializer if detail == 'short' else InstanceSerializer
        return serializer_class


class RackViewSet(viewsets.ModelViewSet):
    # API endpoint that allows groups to be viewed or edited.

    def get_permissions(self):
        # Instantiates and returns the list of permissions that this view requires.
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # permission_classes = [AllowAny]
    queryset = Rack.objects.all()
    serializer_class = RackSerializer
