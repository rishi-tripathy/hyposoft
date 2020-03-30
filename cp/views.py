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

    def validate_helper(self, target):
        conflicts = []
        asset_cps = AssetCP.objects.all().filter(cp=target)
        affected_asset_ids = [a.id_ref for a in asset_cps]
        npcp_of_this_cp = NPCP.objects.filter(asset_cp_id__cp=target)
        affected_np_ids = [n.id_ref for n in npcp_of_this_cp]
        ppcp_of_this_cp = PPCP.objects.filter(asset_cp_id__cp=target)
        affected_pp_ids = [n.id_ref for n in ppcp_of_this_cp]



        # Validate asset metadata
        for a in asset_cps:
            # Hostname
            ahn = a.hostname
            if len(ahn) > 0:

                # check against assets in cp
                if asset_cps.filter(hostname=ahn).count() > 1: # Conflict
                    conflicts.append('Change Plan Asset {}'.format(a.id) + ': Hostname conflict with another asset in this change plan')

                # check against assets not in CP
                unaffected_matches = Asset.objects.all().exclude(pk=a.id_ref).filter(hostname=ahn)
                if unaffected_matches.exists():
                    if unaffected_matches.first().id not in affected_asset_ids:
                        conflicts.append('Change Plan Asset {}'.format(a.id) +
                                         ': Hostname conflict with asset {} in live data at location {} {} {}'
                                         .format(unaffected_matches.first().hostname,
                                                 unaffected_matches.first().datacenter.name,
                                                 unaffected_matches.first().rack.rack_number,
                                                 unaffected_matches.first().rack_u))


            # Location

            this_rack = a.rack
            this_u = a.rack_u
            this_height = a.model.height
            this_lb = this_u
            this_ub = this_lb + this_height

            # check against things in same CP on same rack
            cp_rackmates = asset_cps.filter(rack=this_rack).exclude(pk=a.id)
            for mate in cp_rackmates:
                for i in range(mate.rack_u, mate.rack_u+mate.model.height-1):
                    if i in range(this_lb, this_ub):
                        conflicts.append('Change Plan Asset {}'.format(a.id) + ': Location conflict with change plan asset {}, name {} in this change plan at Rack {} U {}'.format(
                            mate.id, mate.hostname, this_rack.rack_number, i))

            # check against things in live db that are not in the cp
            live_rackmates = Asset.objects.filter(rack=this_rack)
            for mate in live_rackmates:
                if mate.id in affected_asset_ids:
                    continue
                for i in range(mate.rack_u, mate.rack_u+mate.model.height-1):
                    if i in range(this_lb, this_ub):
                        conflicts.append('Change Plan Asset {}'.format(a.id)  + ': Location conflict with asset {}, name {} in live data at Rack {} U {}'.format(
                            mate.id, mate.hostname, this_rack.rack_number, i))


            this_np_cps = NPCP.objects.all().filter(asset_cp_id=a)
            for n in this_np_cps: #Validate each NP in the CP

                # name may not change

                # Validate Mac
                if not re.match(
                    '^([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})[-:_]?([0-9a-f]{2})',
                    n.mac.lower()):
                    conflicts.append('Change Plan Network Port {}'.format(n.id) + ' Invalid MAC Address')

                # Validate connection
                if not n.connection and not n.conn_cp_id:  # not connected to anything
                    continue

                if n.connection and not n.conn_cp_id: # planning to connect to something real
                    if n.connection.id in affected_np_ids:
                        if npcp_of_this_cp.filter(id_ref=n.connection.id).first().connection not in [n, None]:
                            conflicts.append('Change Plan Network Port {} with name {} on asset {}'.format(n.id, n.name, n.asset_cp_id.hostname) +
                                             ': conflicting proposed connection {} on asset {} in this change plan is planned on connecting to {} instead'.format(
                                                 n.connection.name, n.connection.asset.hostname, n.connection.connection.name
                                             ))
                        else: #not conflicting with someting else in this change plan
                            continue
                    else: # Proposed connection is not affected by this change plan, need to make sure it's clear
                        if n.connection.connection not in [Network_Port.objects.get(pk=n.id_ref), None]:
                            conflicts.append('Change Plan Network Port {} with name {} on asset {}'.format(n.id, n.name, n.asset_cp_id.hostname) +
                                             ': conflicting proposed connection {} on asset {} is already connecting to {} on host {} instead'.format(
                                                 n.connection.name, n.connection.asset.hostname,
                                                 n.connection.connection.name, n.connection.connection.asset.hostname
                                             ))
                if n.conn_cp_id: # planning to connect to something else in this cp
                    ncon = n.conn_cp_id
                    if ncon.conn_cp_id not in [n, None]:
                        if ncon.connection not in [Network_Port.objects.get(pk=n.id_ref), None]:
                            conflicts.append('Change Plan Network Port {} with name {} on asset {}'.format(n.id, n.name,
                                                                                                           n.asset_cp_id.hostname) +
                                             ': conflicting proposed connection {} on asset {} is already connecting to {} on host {} instead'.format(
                                                 ncon.name, ncon.asset.hostname,
                                                 ncon.connection.name, ncon.connection.asset.hostname
                                             ))


                # others may not change


        # Validate power connections
            this_pp_cps = PPCP.objects.all().filter(asset_cp_id=a)
            for p in this_pp_cps:
                this_pp_pdu = p.pdu
                pdu_pp_real = Power_Port.objects.all().filter(pdu=this_pp_pdu).exclude(pk=p.id_ref)
                pdu_pp_cp = PPCP.objects.all().filter(asset_id__cp=target).filter(pdu=this_pp_pdu).exclude(pk=p.id)
                for pp in pdu_pp_cp:
                    if pp.port_number == p.port_number:
                        conflicts.append('Change plan Power Port on asset {}'.format(p.asset.hostname) + ': Attempting to connect to already occupied port {} on PDU {}- occupied by power port on host {}'
                                         .format(p.port_number, p.pdu, pp.asset.hostname))
                for pp in pdu_pp_real:
                    if pp.port_number == p.port_number:
                        conflicts.append('Change plan Power Port on asset {}'.format(p.asset.hostname) + ': Attempting to connect to already occupied port {} on PDU {}- occupied by power port on host {}'
                                         .format(p.port_number, p.pdu, pp.asset.hostname))

            return conflicts


    @action(detail=True, methods=['GET'])
    def validate(self, request, *args, **kwargs):
        conflicts = self.validate_helper(self.get_object())
        if len(conflicts) == 0:
            return Response(status.HTTP_200_OK)
        else:
            return Response({
                'Conflicts': conflicts
            }, status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['GET'])
    def execute(self, request, *args, **kwargs):
        # Get the change plan we're working with
        target = self.get_object()
        conflicts = self.validate_helper(self.get_object())
        if len(conflicts) > 0:
            return Response({
                'Cannot execute due to conflicts': conflicts
            }, status.HTTP_400_BAD_REQUEST)
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
                              rack=a.rack, rack_u = a.rack_u, owner=a.owner, comment=a.comment)
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
                    if n.connection:
                        n_ref.connection = n.connection # This assumes that the CPNP n is planned to be connected to a preexisting NP
                        n.connection.connection = n_ref
                        n.connection.save()

                    n_ref.save()


                    # not sure how to process connected to another new NP (created in CP)

                    # asset cannot change

                else: # creating new NPs

                    n_new = Network_Port(name=n.name, mac=n.mac, connection=n.connection,
                                         asset=Asset.objects.get(AssetCP.objects.get(id=n.asset_cp_id).id_ref)) # This assumes that the CPNP n is planned to be connected to a preexisting NP

                    if n.connection:
                        n.connection.connection = n_new
                        n.connection.save()

                    n_new.save()

            # Handle Power Ports for this CP Asset
            for p in PPCP.objects.all().filter(asset_cp_id=a):
                if p.id_ref: # if referencing existing pp
                    p_ref = Power_Port.objects.get(id=p.id_ref)
                    p_ref.pdu = p.pdu
                    p_ref.port_number = p.port_number
                    # asset may not change
                    p_ref.save()

                else: # creating new PP
                    p_new = Power_Port(name="", pdu=p.pdu, port_number=p.port_number,
                                       asset=Asset.objects.get(AssetCP.objects.get(id=n.asset_cp_id).id_ref))

                    p_new.save()

        target.executed = True
        target.save()

        return Response({
            'status': 'ok!'
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