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
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # permission_classes = [AllowAny]
    queryset = User.objects.all().order_by('-date_joined')

    serializer_class = UserSerializer

    filterset_class = UserFilter
    ordering_fields = ['username', 'first_name', 'last_name', 'email']



    def create(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def am_i_admin(self, request, *args, **kwargs):
        return Response({
            'is_admin': request.user.is_staff
        })
# Create your views here.
