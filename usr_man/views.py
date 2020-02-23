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
from django.contrib.auth import authenticate, login, hashers
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

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        to_delete = User.objects.get(id=user.id)
        if to_delete.has_usable_password():
            return super().destroy(request, *args, **kwargs)
        else:
            return Response({
                "status": "Failure. You may not delete a NetID user."
            })

    # Override default actions here
    def partial_update(self, request, *args, **kwargs):

        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if user.username is 'admin': # can't update admin permissions
            return Response({
                "status": "You may not change the permissions of the admin user."
            },
                status=status.HTTP_400_BAD_REQUEST)

        if request.data.get('is_admin') == 'true':
            user.is_superuser = True
            user.is_staff = True

        if request.data.get('is_staff') == 'true':
            user.is_staff = True

        if request.data.get('is_admin') == 'false':
            user.is_superuser = False
            user.is_staff = False

        if request.data.get('is_staff') == 'false':
            user.is_staff = False

        self.perform_update(serializer)

        if getattr(user, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            user._prefetched_objects_cache = {}

        return Response(serializer.data)

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
            is_admin = request.user.is_staff
        except AttributeError:
            return Response({
                'current_user': None
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'current_user': un,
            'first_name': fn,
            'last_name': ln,
            'is_admin': is_admin
        })

    @action(detail=False, methods=[GET, POST])
    def netid_login(self, request, *args, **kwargs):
        url = 'https://api.colab.duke.edu/identity/v1/'
        token = requests. #or ''  # 'cbe2d5243b68b6556dc879cf7e72e397ed8af57a'  #

        headers = {"Accept": "application/json",
                   "Authorization": "Bearer {}".format(token),
                   "x-api-key": "hyposoft-ev2"}

        r = requests.get(url, headers=headers)

        netid_info = r.json()

        if r.status_code is not 200:
            return Response(r.json(), status.HTTP_400_BAD_REQUEST)

        resp_draft = {'email': "{}@duke.edu".format(netid_info['netid']),
                      'username': netid_info['netid'],
                      'first_name': netid_info['firstName'],
                      'last_name': netid_info['lastName'],
                      'password': hashers.make_password(None)
                      }

        user = User.objects.all().filter(username=netid_info['netid']).first()
        if user:
            login(request, user)
            return Response({
                'login': 'success'
            })
        else:
            serializer = self.get_serializer(data=resp_draft)
            serializer.is_valid(raise_exception=True)
            user = serializer.create(resp_draft)

            login(request, user)
            return Response({
                'creation': 'success',
                'login': 'success'
            })
