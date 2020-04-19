from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
# API
from rest_framework import viewsets
from ass_man.serializers.blade_serializer import BladeServerSerializer, BladeCreateSerializer
import paramiko
import time
import re
import os
# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import BladeServer, Datacenter, Decommissioned

JSON_TRUE = 'true'
ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'


class BladeViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            if IsAdminUser:
                try:
                    user = User.objects.get(username=self.request.user.username)
                    if self.action is not 'create':
                        permission_classes = [IsAuthenticated]
                        return [permission() for permission in permission_classes]
                        # datacenter = self.get_object().datacenter
                    else:
                        datacenter_url = self.request.data.get('datacenter')
                        datacenter = Datacenter.objects.all().get(pk=datacenter_url[-2])
                    if user.is_superuser or user.is_staff or user.permission_set.get(name='global-asset', user=user) or user.permission_set.get(name='asset', datacenter=datacenter):
                        permission_classes = [IsAuthenticated]
                except:
                    permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = BladeServer.objects.all()

    ordering = ['hostname']

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update':
            serializer_class = BladeCreateSerializer
        else:
            serializer_class = BladeServerSerializer
        return serializer_class

    def destroy(self, request, *args, **kwargs):
        serialized_blade = BladeServerSerializer(self.get_object(), context={'request': request})
        decom_blade = Decommissioned(username=request.user.username, \
        asset_state=serialized_blade.data)
        decom_blade.save()
        if self.request.query_params.get('decommissioned')=='true':
            serialized_blade = BladeServerSerializer(self.get_object(), context={'request': request})
            decom_blade = Decommissioned(username=request.user.username, \
            asset_state=serialized_blade.data)
            decom_blade.save()
        return super().destroy(self, request, *args, **kwargs)

    @action(detail=True, methods=['POST'])
    def set_power(self, request, *args, **kwargs):

        chassis_hostname = self.get_object().location.hostname
        slot_num = self.get_object().slot_number
        action = request.data.get('action').lower()
        ip = 'hyposoft-mgt.colab.duke.edu'
        username = os.getenv('BCMAN_UN')
        password = os.getenv('BCMAN_PW')
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            ssh.connect(ip, username=username, password=password, port=2222,
                        look_for_keys=False, allow_agent=False)
            remote_conn = ssh.invoke_shell()
            time.sleep(.005)
            remote_conn.send(f'chassis {chassis_hostname}\n')
            remote_conn.send(f'blade {str(slot_num)}\n')
            remote_conn.send(f'power {action}\n')
            time.sleep(.4)
            output = remote_conn.recv(65535)
            ssh.close()
            match = re.search(r"powering (ON|OFF)", str(output))
            return Response({
                'new state': str(match.group(1))
            })
        except Exception as e:
            ssh.close()
            return Response('Unable to connect to BCMAN. Please try again later.', status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['GET'])
    def get_power(self, request, *args, **kwargs):
        chassis_hostname = self.get_object().location.hostname
        slot_num = self.get_object().slot_number
        ip = 'hyposoft-mgt.colab.duke.edu'
        username = os.getenv('BCMAN_UN')
        password = os.getenv('BCMAN_PW')
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            ssh.connect(ip, username=username, password=password, port=2222,
                        look_for_keys=False, allow_agent=False)
            remote_conn = ssh.invoke_shell()
            time.sleep(.1)
            remote_conn.send(f'chassis {chassis_hostname}\n')
            remote_conn.send(f'blade {str(slot_num)}\n')
            remote_conn.send(f'power\n')
            time.sleep(.4)
            output = remote_conn.recv(65535)
            match = re.search(r"is (ON|OFF)", str(output))
            ssh.close()
            return Response({
                'status': str(match.group(1))
            })

        except Exception as e:
            ssh.close()
            raise e
            return Response('Unable to connect to BCMAN. Please try again later.', status=status.HTTP_400_BAD_REQUEST)

