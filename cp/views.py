from django.shortcuts import render
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models.fields import IntegerField
from django.db.models.functions import Concat, Substr, Cast
from django.db.models.deletion import ProtectedError
from django.db.models import CharField
from django.core.exceptions import ObjectDoesNotExist
import re, requests
# API
from rest_framework import viewsets

from ass_man.serializers.asset_serializers import AssetSerializer, AssetFetchSerializer, AssetShortSerializer, \
    AssetSeedForGraphSerializer
from ass_man.serializers.model_serializers import UniqueModelsSerializer

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# Project
from ass_man.models import Model, Asset, Rack, Datacenter, Network_Port, Power_Port, PDU, Asset_Number
from cp.models import ChangePlan, NPCP, AssetCP, PPCP
from cp.serializers import ChangePlanSerializer, AssetCPSerializer, NPCPSerializer, PPCPSerializer
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend
from ass_man.filters import AssetFilter, AssetFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json
from ass_man.import_manager import import_asset_file, import_network_port_file
from ass_man.export_manager import export_assets, export_network_ports
# Create your views here.


class ChangePlanViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        # Update with better permissions
        return IsAuthenticated

    queryset = ChangePlan.objects.all()

    def get_serializer_class(self):
        return ChangePlanSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(owner=request.user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ChangePlanSerializer
        return Response(serializer.data)


class AssetCPViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        return IsAuthenticated

    queryset = AssetCP.objects.all()

    def get_serializer_class(self):
        return AssetCPSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(owner=request.user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
