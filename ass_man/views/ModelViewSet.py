from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
# API
from rest_framework import viewsets
from ass_man.serializers.asset_serializers import AssetOfModelSerializer
from ass_man.serializers.model_serializers import ModelSerializer, ModelShortSerializer

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import Model, Asset
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend
from ass_man.filters import ModelFilter
import json
from ass_man.import_manager import import_model_file
from ass_man.export_manager import export_models

JSON_TRUE = 'true'
ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'

MODEL_ORDERING_FILTERING_FIELDS = ['vendor', 'model_number', 'height', 'display_color',
                                   'network_ports_num', 'power_ports', 'cpu', 'memory', 'storage']
MODEL_HEIGHT_UPDATE_ERROR_MSG = \
    'This update fails- the height of models may not be changed if assets of the model exist.'
MODEL_DESTROY_ERROR_MSG = 'Cannot delete this model as there are associated assets: '


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
        if self.request.method == GET:
            serializer_class = ModelSerializer if self.detail else ModelShortSerializer
        else:
            serializer_class = ModelSerializer
        return serializer_class

    ordering_fields = MODEL_ORDERING_FILTERING_FIELDS
    ordering = ['vendor', 'model_number']  # default ordering
    filterset_fields = MODEL_ORDERING_FILTERING_FIELDS
    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend]

    filterset_class = ModelFilter

    def destroy(self, request, *args, **kwargs):
        matches = self.get_object().asset_set.all()
        if matches.count() > 0:
            offending_assets = []
            for match in matches:
                offending_assets.append(match.hostname.__str__() +
                                        ' at ' +
                                        match.rack.rack_number.__str__() +
                                        ' U' +
                                        match.rack_u.__str__())

            return Response(MODEL_DESTROY_ERROR_MSG +
                            ', '.join(offending_assets),
                            status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(self, request, *args, **kwargs)

    def list(self, request, *args, **kwargs):

        if request.query_params.get('export') == JSON_TRUE:
            queryset = self.filter_queryset(self.get_queryset())
            return export_models(queryset)

        return super().list(self, request, *args, *kwargs)

    # Custom actions below

    @action(detail=False, methods=['POST'])
    def import_file(self, request, *args, **kwargs):
        return import_model_file(request)

    @action(detail=False, methods=[GET])
    def filter_fields(self, request, *args, **kwargs):
        return Response({
            'filter_fields': self.filterset_fields
        })

    @action(detail=False, methods=[GET])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'sorting_fields': self.ordering_fields
        })

    @action(detail=True, methods=[GET])
    def can_delete(self, request, *args, **kwargs):
        matches = Asset.objects.all().filter(model=self.get_object())
        if matches.count() > 0:
            return Response({
                'can_delete': 'false'
            })
        return Response({
            'can_delete': 'true'
        })

    @action(detail=False, methods=[GET])
    def vendors(self, request, *args, **kwargs):
        vendor_typed = self.request.query_params.get('vendor') or ''
        vendors = list(
            Model.objects.values_list('vendor', flat=True).filter(vendor__istartswith=vendor_typed).distinct())
        return Response({
            'vendors': vendors
        })

    # used on model detail page
    @action(detail=True, methods=[GET])
    def assets(self, request, *args, **kwargs):
        assets = Asset.objects.all().filter(model=self.get_object())
        page = self.paginate_queryset(assets)
        if page is not None:
            serializer = AssetOfModelSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = AssetOfModelSerializer(assets, many=True, context={'request': request})
        return Response(serializer.data)
