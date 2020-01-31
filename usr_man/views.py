from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status, request
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .serializers import UserSerializer
from rest_framework import viewsets
from usr_man.filters import UserFilter

ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}


class UserViewSet(viewsets.ModelViewSet):
    # API endpoint that allows users to be viewed or edited.

    def get_permissions(self):
        # Instantiates and returns the list of permissions that this view requires.
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        elif self.action == 'who_am_i':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # permission_classes = [AllowAny]
    queryset = User.objects.all().order_by('-date_joined')

    serializer_class = UserSerializer

    filterset_class = UserFilter
    ordering_fields = ['username', 'first_name', 'last_name', 'email']

    # Override default actions here

    # Implement custom actions below
    @action(detail=False, methods=['GET'])
    def filter_fields(self, request, *args, **kwargs):
        return Response({
            'filter_fields': ['username', 'first_name', 'last_name', 'email']
        })

    @action(detail=False, methods=['GET'])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'filter_fields': self.ordering_fields
        })

    @action(detail=False, methods=['GET'])
    def am_i_admin(self, request, *args, **kwargs):
        return Response({
            'is_admin': request.user.is_staff
        })

    @action(detail=False, methods=['GET'])
    def who_am_i(self, request, *args, **kwargs):
        return Response({
            'current_user': request.user.username
        })

