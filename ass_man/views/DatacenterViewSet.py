from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models.fields import IntegerField
from django.db.models.functions import Concat, Substr, Cast
from django.db.models.deletion import ProtectedError
from django.db.models import CharField
from django.core.exceptions import ObjectDoesNotExist
# API
from rest_framework import viewsets
from ass_man.serializers.datacenter_serializers import DatacenterSerializer
from ass_man.serializers.rack_serializers import RackOfAssetSerializer
from ass_man.serializers.asset_serializers import AssetOfModelSerializer

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import Model, Asset, Rack, Datacenter, Network_Port, Power_Port, PDU
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend

JSON_TRUE = 'true'
ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'


class DatacenterViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            try:
                user = User.objects.get(username=self.request.user.username)
                if user.is_staff or len(user.permission_set.all().filter(name='asset')) > 0:
                    permission_classes = [IsAuthenticated]
                else:
                    permission_classes = [IsAdmin]
            except:
                permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Datacenter.objects.all()

    ordering = ['name']

    def get_serializer_class(self):
        serializer_class = DatacenterSerializer
        return serializer_class

    # Override superfunctions
    def list(self, request, *args, **kwargs):
        if request.query_params.get('offline') == 'true':
            queryset = self.filter_queryset(self.get_queryset()).exclude(is_offline=False)
        elif request.query_params.get('offline') == 'false':
            queryset = self.filter_queryset(self.get_queryset()).exclude(is_offline=True)
        else:
            queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def update(self, request, *args, **kwargs):
        resp = super().update(request, *args, **kwargs)
        if resp.status_code == 200:
            for rack in self.get_object().rack_set.all():

                if len(rack.rack_number) < 3:
                    root_name = 'hpdu-{}-{}'.format(rack.datacenter.abbreviation,
                                                    rack.rack_number[0] + "0" +
                                                    rack.rack_number[1])
                else:
                    root_name = 'hpdu-{}-{}'.format(rack.datacenter.abbreviation,
                                                    rack.rack_number)

                rack.pdu_l.name = root_name + 'L'
                rack.pdu_r.name = root_name + 'R'
                rack.pdu_l.save()
                rack.pdu_r.save()
        return resp

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            if self.get_object().is_offline():
                return Response({
                    'Error': 'Cannot delete this offline storage site as it contains assets.'
                }, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'Error': 'Cannot delete this datacenter as it contains racks.'
            }, status=status.HTTP_400_BAD_REQUEST)

    # Custom Endpoints
    @action(detail=False, methods=[GET])
    def all_chassis(self, request, *args, **kwargs):
        chassis = Asset.objects.filter(model__mount_type='chassis')
        serializer = AssetOfModelSerializer(chassis, many=True, context={'request': request})
        return Response(serializer.data)
    @action(detail=True, methods=[GET])
    def chassis(self, request, *args, **kwargs):
        chassis = {}
        chassis['chassis'] = []
        dc = self.get_object()
        chassis = Asset.objects.filter(model__mount_type='chassis', datacenter=dc)
        serializer = AssetOfModelSerializer(chassis, many=True, context={'request': request})
        return Response(serializer.data)

    # This is used for asset creation, not for displaying racks (should use Rack filter endpoint)
    @action(detail=True, methods=[GET])
    def racks(self, request, *args, **kwargs):
        if self.get_object().is_offline:
            return Response({
                'Error': 'Cannot get racks of an offline storage site.'
            }, status=status.HTTP_400_BAD_REQUEST)
        matches = self.get_object().rack_set  # Rack.objects.filter(datacenter=self.get_object())
        rs = RackOfAssetSerializer(matches, many=True, context={'request': request})
        return Response(sorted(rs.data, key=lambda k: k['id']))

    @action(detail=True, methods=[GET])
    def asset_options_cp(self, request, *args, **kwargs):
        this_dc = self.get_object()

        matches = Asset.objects.all().filter(datacenter=this_dc)
        options = {}
        for match in matches:
            options[' '.join([match.hostname, match.model.vendor, match.model.model_number,
                              match.rack.rack_number, str(match.rack_u)])] = match.pk
        return Response({
            'data': options
        })
