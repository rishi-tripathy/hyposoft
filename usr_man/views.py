from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status, request
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .serializers import UserSerializer
from rest_framework import viewsets
from usr_man.filters import UserFilter
import rest_framework.status

ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
USER_ORDERING_FILTERING_FIELDS = ['username', 'first_name', 'last_name', 'email']

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
    queryset = User.objects.all().order_by('last_name')

    serializer_class = UserSerializer
    filterset_class = UserFilter
    filterset_fields = USER_ORDERING_FILTERING_FIELDS


    ordering_fields = USER_ORDERING_FILTERING_FIELDS
    # Override default actions here

    # Implement custom actions below
    @action(detail=False, methods=['GET'])
    def filter_fields(self, request, *args, **kwargs):
        return Response({
            'filter_fields': self.filterset_fields
        })

    @action(detail=False, methods=['GET'])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'sorting_fields': self.ordering_fields
        })

    @action(detail=False, methods=['GET'])
    def am_i_admin(self, request, *args, **kwargs):
        return Response({
            'is_admin': request.user.is_staff
        })

    @action(detail=False, methods=['GET'])
    def who_am_i(self, request, *args, **kwargs):
        try:
            un = request.user.username
            fn = request.user.first_name or None
            ln = request.user.last_name or None
        except AttributeError:
            return Response({
                'current_user': None
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'current_user': un,
            'first_name': fn,
            'last_name': ln
        })

