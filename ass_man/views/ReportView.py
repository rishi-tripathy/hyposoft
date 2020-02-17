from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import Model, Asset, Rack, Datacenter

JSON_TRUE = 'true'
ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'

MODEL_ORDERING_FILTERING_FIELDS = ['vendor', 'model_number', 'height', 'display_color',
                                   'network_ports', 'power_ports', 'cpu', 'memory', 'storage']
MODEL_HEIGHT_UPDATE_ERROR_MSG = \
    'This update fails- the height of models may not be changed if assets of the model exist.'
MODEL_DESTROY_ERROR_MSG = 'Cannot delete this model as there are associated assets: '

ASSET_ORDERING_FILTERING_FIELDS = ['model', 'datacenter', 'model__model_number', 'model__vendor',
                                   'hostname', 'rack', 'rack_u', 'owner']

RACK_ORDERING_FILTERING_FIELDS = ['rack_number', 'datacenter']
RACK_DESTROY_SINGLE_ERR_MSG = 'Cannot delete rack as it contains the following assets:'
RACK_MANY_INCOMPLETE_QUERY_PARAMS_ERROR_MSG = 'Invalid rack range- must specify start and end rack number'
RACK_MANY_BAD_LETTER_ERROR_MSG = 'Your start letter must be less than or equal to your end letter'
RACK_MANY_BAD_NUMBER_ERROR_MSG = 'Your start number must be less than or equal to your end number'
RACK_MANY_CREATE_EXISTING_RACK_WARNING_MSG = 'Warning: skipping rack {} as it already exists.'
RACK_MANY_DELETE_NONEXISTENT_ERROR_MSG = 'Error: rack {} cannot be deleted as it does not exist. Continuing...'
RACK_MANY_DELETE_NOT_EMPTY_ERROR_MSG = 'Error: rack {} cannot be deleted as it is not empty. Continuing...'


# Docs for ModelViewSet: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset


# Custom actions below

@api_view([GET])
@permission_classes([IsAuthenticated])
def report(request):
    racks = Rack.objects.all()
    total = 0
    occupied = 0
    slots = ['u{}'.format(i) for i in range(1, 43)]
    for rack in racks:
        for field_name in slots:
            if getattr(rack, field_name):
                occupied += 1
            total += 1
    if total == 0:
        total += 1
    percentage_occupied = occupied / total * 100
    percentage_free = (total - occupied) / total * 100

    assets = Asset.objects.all()
    vendor_dict = {}
    model_dict = {}
    owner_dict = {}
    for asset in assets:
        if asset.model_id in model_dict:
            model_dict[asset.model_id] += 1
        else:
            model_dict[asset.model_id] = 1
        if asset.owner_id in owner_dict:
            owner_dict[asset.owner_id] += 1
        else:
            owner_dict[asset.owner_id] = 1

    model_dict_by_model_number = {}
    for model in model_dict.keys():
        model_obj = Model.objects.get(pk=model)
        model_dict_by_model_number[model_obj.vendor + ' ' + model_obj.model_number] = model_dict[model]
        if model_obj.vendor in vendor_dict:
            vendor_dict[model_obj.vendor] += model_dict[model]
        else:
            vendor_dict[model_obj.vendor] = model_dict[model]

    owner_dict_by_username = {}
    for owner_id in owner_dict.keys():
        try:
            owner = User.objects.get(pk=owner_id)
        except User.DoesNotExist:
            continue
        owner_dict_by_username[owner.username] = owner_dict[owner_id]

    return Response({
        'rackspace_used': percentage_occupied,
        'rackspace_free': percentage_free,
        'models_allocated': model_dict_by_model_number,
        'vendors_allocated': vendor_dict,
        'owners_allocated': owner_dict_by_username
    })
