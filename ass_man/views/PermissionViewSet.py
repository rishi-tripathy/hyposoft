from rest_framework import viewsets
from ass_man.models import Decommissioned
from ass_man.serializers.decommissioned_serializers import DecommissionedSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from ass_man.models import Model, Asset, Datacenter, Permission


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_permissions(request):
    curr_user = request.user
    permissions = {}
    permissions['user_id'] = curr_user.id
    permissions['username'] = curr_user.username
    try:
        curr_user.permission_set.get(name='model')
        permissions['model_permission'] = 'true'
    except Permission.DoesNotExist:
        permissions['model_permission'] = 'false'

    permissions['asset_permission'] = []
    for p in curr_user.permission_set.filter(name='asset'):
        permissions['asset_permission'].append(p.datacenter.id)
    try:
        curr_user.permission_set.get(name='power')
        permissions['power_permission'] = 'true'
    except Permission.DoesNotExist:
        permissions['power_permission'] ='false'
    try:
        curr_user.permission_set.get(name='log')
        permissions['log_permission'] = 'true'
    except Permission.DoesNotExist:
        permissions['log_permission'] = 'false'

    return Response(permissions)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_permissions(request):
    user_set = []
    single = False
    if request.query_params.get('id'):
        id = request.query_params.get('id')
        user_set.append(User.objects.all().get(pk=id))
        single = True
    else:
        user_set = User.objects.all()
    users = []
    for u in user_set:
        user_permissions = {}
        user_permissions['user_id'] = u.id
        user_permissions['username'] = u.username
        try:
            u.permission_set.get(name='model')
            user_permissions['model_permission'] = 'true'
        except Permission.DoesNotExist:
            user_permissions['model_permission'] = 'false'

        user_permissions['asset_permission'] = []
        for p in u.permission_set.filter(name='asset'):
            user_permissions['asset_permission'].append(p.datacenter.id)
        try:
            u.permission_set.get(name='power')
            user_permissions['power_permission'] = 'true'
        except Permission.DoesNotExist:
            user_permissions['power_permission'] ='false'
        try:
            u.permission_set.get(name='log')
            user_permissions['log_permission'] = 'true'
        except Permission.DoesNotExist:
            user_permissions['log_permission'] = 'false'
        users.append(user_permissions)

    if single:
        return Response(users[0])
    else:
        return Response(users)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_permissions(request):
    print('here we go')
    try:
        user = User.objects.all().get(username=request.data.get('username'))
        print(user.username)
    except:
        print('user not found')
        print(request.data.get('username'))
        return Response('User not found.')
    # print(request.data.get('model'))
    # print(type(request.data.get('model')))
    # b = request.data.get('model') == 'false'
    # c = request.data.get('model') is 'false'
    # m = request.data.get('model')
    # d = m is 'true'
    # print(b)
    # print(c)
    # print(d)
    # j = request.data.get('power') is request.data.get('model')
    # print(request.data.get('power'))
    # aa = request.data.get('power') is 'false'
    # print(aa)
    if request.data.get('model') and request.data.get('model') == 'true':
        print('model is true')
        try:
            p = Permission.objects.all().get(name='model',user=user)
            print('found exisiting permission')
        except:
            p = Permission(name='model', user=user)
            p.save()
            print('created new permission')
    elif request.data.get('model') and request.data.get('model') == 'false':
        print('model is false')
        try:
            p = Permission.objects.all().get(name='model',user=user)
            p.delete()
            print('permission deleted')
        except:
            print('none found')
            pass
    if request.data.get('asset'):
        for dc_id in request.data.get('asset'):
            print(dc_id)
            dc = Datacenter.objects.all().get(pk=dc_id)
            try:
                p = Permission.objects.all().get(name='asset', datacenter=dc, user=user)
                print('exisiting permission')
            except:
                p = Permission(name='asset', datacenter=dc, user=user)
                p.save()

            # if request.data.get('asset')[dc_id]:
            #     print('val is true')
            #     try:
            #         p = Permission.objects.all().get(name='asset', datacenter=dc, user=user)
            #         print('exisiting permission')
            #     except:
            #         p = Permission(name='asset', datacenter=dc, user=user)
            #         p.save()
            #         print('created new one')
            # elif request.data.get('asset').get(pk=dc_id) is 'false':
            #     try:
            #         p = Permission.objects.all().get(name='asset', datacenter=dc, user=user)
            #         p.delete()
            #     except:
            #         pass
    if request.data.get('power'):
        if request.data.get('power') == 'true':
            try:
                p = Permission.objects.all().get(name='power', user=user)
            except:
                p = Permission(name='power', user=user)
                p.save()
        elif request.data.get('power') == 'false':
            try:
                p = Permission.objects.all().get(name='power', user=user)
                p.delete()
            except:
                pass
    if request.data.get('log'):
        if request.data.get('log') == 'true':
            try:
                p = Permission.objects.all().get(name='log', user=user)
            except:
                p = Permission(name='log', user=user)
                p.save()
        elif request.data.get('log') == 'false':
            try:
                p = Permission.objects.all().get(name='log', user=user)
                p.delete()
            except:
                pass
    return Response('Permissions updated')




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