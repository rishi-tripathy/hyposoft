from rest_framework import viewsets
from ass_man.models import Decommissioned
from ass_man.serializers.decommissioned_serializers import DecommissionedSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny



@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_permissions(request):
    user = User.objects.all().get(pk=request.POST.get('user'))
    if request.POST.get('model') and request.POST.get('model') is 'true':
        try:
            p = Permission.objects.all().get(name='model',user=user)
        except:
            p = Permission(name='model', user=user)
            p.save()
    elif request.POST.get('model') and request.POST.get('model') is 'false':
        try:
            p = Permission.objects.all().get(name='model',user=user)
            p.delete()
        except:
            pass
    if request.POST.get('asset'):
        for dc_id in request.POST.get('asset'):
            dc = Datacenter.objects.all().get(pk=dc_id)
            if request.POST.get('asset')[dc_id] is 'true':

                try:
                    p = Permission.objects.all().get(name='asset', datacenter=dc, user=user)
                except:
                    p = Permission(name='asset', datacenter=dc, user=user)
                    p.save()
            elif request.POST.get('asset').get(pk=dc_id) is 'false':
                try:
                    p = Permission.objects.all().get(name='asset', datacenter=dc, user=user)
                    p.delete()
                except:
                    pass
    if request.POST.get('power'):
        if request.POST.get('power') is 'true':
            try:
                p = Permission.objects.all().get(name='power', user=user)
            except:
                p = Permission(name='power', user=user)
                p.save()
        elif request.POST.get('power') is 'false':
            try:
                p = Permission.objects.all().get(name='power', user=user)
                p.delete()
            except:
                pass
    if request.POST.get('log'):
        if request.POST.get('log') is 'true':
            try:
                p = Permission.objects.all().get(name='log', user=user)
            except:
                p = Permission(name='log', user=user)
                p.save()
        elif request.POST.get('log') is 'false':
            try:
                p = Permission.objects.all().get(name='log', user=user)
                p.delete()
            except:
                pass





# class PermissionViewSet(viewsets.ModelViewSet):
#     queryset = Decommissioned.objects.all()
#     http_method_names = ['get', 'post', 'delete']
#
#     def create(self, request, *args, **kwargs):
#         user = User.objects.all().get(pk=request.POST.get('user'))
#         if request.POST.get('model') and request.POST.get('model') is 'true':
#             try:
#                 p = Permission.objects.all().get(name='model',user=user)
#             except:
#                 p = Permission(name='model', user=user)
#                 p.save()
#         elif request.POST.get('model') and request.POST.get('model') is 'false':
#             try:
#                 p = Permission.objects.all().get(name='model',user=user)
#                 p.delete()
#             except:
#                 pass
#         if request.POST.get('asset'):
#             for dc_id in request.POST.get('asset'):
#                 dc = Datacenter.objects.all().get(pk=dc_id)
#                 if request.POST.get('asset')[dc_id] is 'true':
#                     try:
#                         p = Permission.objects.all().get(name='asset', datacenter=dc, user=user)
#                     except:
#                         p = Permission(name='asset', datacenter=dc, user=user)
#                         p.save()
#                 elif request.POST.get('asset').get(pk=dc_id) is 'false':
#                     try:
#                         p = Permission.objects.all().get(name='asset', datacenter=dc, user=user)
#                         p.delete()
#                     except:
#                         pass
#
