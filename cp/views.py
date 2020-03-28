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
from cp.serializers import ChangePlanFetchSerializer, AssetCPFetchSerializer, AssetCPSerializer, ChangePlanListSerializer, NPCPSerializer, PPCPSerializer
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
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = ChangePlan.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = ChangePlanFetchSerializer if self.detail else ChangePlanListSerializer
        else:
            serializer_class = ChangePlanListSerializer
        return serializer_class

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
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # Helper method for execute
    def move_asset(self, asset, asset_cp):
        prev_rack = asset.rack
        prev_rack_u = asset.rack_u

        new_dc = asset_cp.datacenter
        new_rack = asset_cp.rack
        new_rack_u = asset_cp.rack_u

        asset.datacenter = new_dc
        asset.rack = new_rack
        asset.rack_u = new_rack_u
        asset.save()

        for i in range(prev_rack_u, prev_rack_u + asset.model.height + 1):
            exec('prev_rack.u{} = None'.format(i))
        prev_rack.save()

        for i in range(new_rack_u, new_rack_u + asset.model.height):
            exec('new_rack.u{} = asset'.format(i))
        new_rack.save()

        return

    @action(detail=True, methods=['GET'])
    def execute(self, request, *args, **kwargs):
        # Get the change plan we're working with
        target = self.get_object()
        # Validate here
        assets_cp = AssetCP.objects.all().filter(cp=target)
        for a in assets_cp:
            # a = AssetCP() # REMOVE THIS LINE AFTER CODING

            if a.id_ref: # if referencing a preexisting asset

                # Handle Asset Metadata

                a_ref = Asset.objects.get(id=a.id_ref)
                # model is static
                # hostname can change
                a_ref.hostname = a.hostname
                ChangePlanViewSet.move_asset(self, a_ref, a)


                # owner can change
                a_ref.owner = a.owner
                # comment can change
                a_ref.comment = a.comment
                # asset number can change (how do we want to handle this??)

                a_ref.save()
            else:
                a_new = Asset(model=a.model, hostname=a.hostname, datacenter=a.datacenter,
                              rack=a.rack, rack_u = a.rack_u, owner=a.owner, comment=a.comment,
                              asset_number=a.asset_number)
                ChangePlanViewSet.move_asset(self, a_new, a)
                a_new.save()
                a.id_ref=a_new.pk #when doing network ports, now have a way to access to the real object
        # Make all assets before doing NP or CP

        for a in assets_cp:

            # Handle Network Ports for this CP Asset
            for n in NPCP.objects.all().filter(asset_cp_id=a): # target.npcp_set.filter(asset_cp_id=a):
                if n.id_ref: # if referencing existing np
                    n_ref = Network_Port.objects.get(id=n.id_ref)

                    # name may change
                    n_ref.name = n.name
                    # mac may change
                    n_ref.mac = n.mac
                    # connection may change
                    n_ref.connection = n.connection # This assumes that the CPNP n is planned to be connected to a preexisting NP
                    n.connection = n_ref

                    n_ref.save()
                    n.connection.save()

                    # not sure how to process connected to another new NP (created in CP)

                    # asset cannot change

                else: # creating new NPs

                    n_new = Network_Port(name=n.name, mac=n.mac, connection=n.connection,
                                         asset=Asset.objects.get(AssetCP.objects.get(id=n.asset_cp_id).id_ref)) # This assumes that the CPNP n is planned to be connected to a preexisting NP

                    n_new.save()


            # Handle Power Ports for this CP Asset
            for p in PPCP.objects.all().filter(asset_cp_id=a):
                if p.id_ref: # if referencing existing pp
                    pass

                else: #creating new PP
                    p_new = Power_Port(name="", pdu=p.pdu, port_number=p.port_number,
                                       asset=Asset.objects.get(AssetCP.objects.get(id=n.asset_cp_id).id_ref))

                    p_new.save()


            return Response({
                'hostname': assets_cp.hostname
            })


class AssetCPViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = AssetCP.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = AssetCPFetchSerializer if self.detail else AssetCPFetchSerializer
        else:
            serializer_class = AssetCPSerializer
        return serializer_class

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(owner=request.user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class NPCPViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = NPCP.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = NPCPSerializer # AssetCPFetchSerializer if self.detail else AssetCPFetchSerializer
        else:
            serializer_class = NPCPSerializer
        return serializer_class

    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset().filter(owner=request.user)
    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)
    #
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response(serializer.data)


class PPCPViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = PPCP.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = PPCPSerializer # AssetCPFetchSerializer if self.detail else AssetCPFetchSerializer
        else:
            serializer_class = PPCPSerializer
        return serializer_class

    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset().filter(owner=request.user)
    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)
    #
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response(serializer.data)