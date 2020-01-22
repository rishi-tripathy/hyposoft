from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .serializers import UserSerializer
from rest_framework import viewsets


class UserViewSet(viewsets.ModelViewSet):
    # API endpoint that allows users to be viewed or edited.

    # def get_permissions(self):
    #     # Instantiates and returns the list of permissions that this view requires.
    #     if self.action in ADMIN_ACTIONS:
    #         permission_classes = [IsAdminUser]
    #     else:
    #         permission_classes = [IsAuthenticated]
    #     return [permission() for permission in permission_classes]

    permission_classes = [AllowAny]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

# Create your views here.
