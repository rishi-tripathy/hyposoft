from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status, request
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .serializers import UserSerializer
from rest_framework import viewsets
from usr_man.filters import UserFilter
import requests
from django.contrib.auth import authenticate, login
import rest_framework.status

ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
USER_ORDERING_FILTERING_FIELDS = ['username', 'first_name', 'last_name', 'email']

class UserViewSet(viewsets.ModelViewSet):
    # API endpoint that allows users to be viewed or edited.

    def get_permissions(self):
        # Instantiates and returns the list of permissions that this view requires.
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        elif self.action == 'who_am_i' or self.action == 'netid_login':
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

    @action(detail=False, methods=[GET])
    def am_i_admin(self, request, *args, **kwargs):
        return Response({
            'is_admin': request.user.is_staff
        })

    @action(detail=False, methods=[GET])
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

    @action(detail=False, methods=[GET, POST])
    def netid_login(self, request, *args, **kwargs):
        url = 'https://api.colab.duke.edu/identity/v1/'
        token = request.query_params.get('token') or ''

        headers ={"Accept": "application/json",
                  "Authorization": "Bearer {}".format(token),
                  "x-api-key": "hyposoft"}

        r = requests.get(url, headers=headers)

        netid_info = r.json()

        resp_draft = {'email': "{}@duke.edu".format(netid_info['netid']),
                      'username': netid_info['netid'],
                      'first_name': netid_info['firstName'],
                      'last_name': netid_info['lastName'],
                      'password': hash(netid_info['LDAP']['key'])
        }

        user = User.objects.all().filter(username=netid_info['netid']).first()
        loginrequest = {
                      'username': netid_info['netid'],
                      'password': hash(netid_info['LDAP']['key'])
        }
        if user:
            to_log_in = authenticate(loginrequest, username=loginrequest['username'], password=loginrequest['password'])
            login(loginrequest, to_log_in)
            return Response({
                'login': 'success'
            })
        else:
            serializer = self.get_serializer(data=resp_draft)
            serializer.is_valid(raise_exception=True)
            us = serializer.create(resp_draft)
            return Response(serializer.data)
