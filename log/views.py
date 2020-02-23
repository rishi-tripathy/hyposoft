from django.shortcuts import render
from log.serializers import CRUDEventSerializer
from easyaudit.models import CRUDEvent
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

# API
from rest_framework import viewsets

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import Model, Asset, Rack, Datacenter, Network_Port, Power_Port, PDU
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend

JSON_TRUE = 'true'
DISALLOWED_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'


# Docs for ModelViewSet: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset


# Custom actions below

class LogViewSet(viewsets.ModelViewSet):
    queryset = CRUDEvent.objects.all()

    def get_permissions(self):
        if self.action in DISALLOWED_ACTIONS:
            permission_classes = [None]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        serializer_class = CRUDEventSerializer
        return serializer_class

    @action(detail=False, methods=[GET])
    def log(self, request, *args, **kwargs):
        page = self.paginate_queryset(self.queryset)
        if page is not None:
            serializer = CRUDEventSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = CRUDEventSerializer(self.queryset, many=True, context={'request': request})
        return Response(serializer.data)
