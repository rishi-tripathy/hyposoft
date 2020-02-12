from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models.fields import IntegerField
from django.db.models.functions import Concat, Substr, Cast
from django.db.models.deletion import ProtectedError
from django.db.models import CharField
# API
from rest_framework import viewsets
from ass_man.serializers import (InstanceShortSerializer,
                                 InstanceSerializer,
                                 InstanceFetchSerializer,
                                 ModelShortSerializer,
                                 ModelSerializer,
                                 RackSerializer,
                                 RackFetchSerializer,
                                 InstanceOfModelSerializer,
                                 VendorsSerializer,
                                 UniqueModelsSerializer)

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import Model, Asset, Rack
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as djfiltBackend
from ass_man.filters import InstanceFilter, ModelFilter, RackFilter, InstanceFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json
from ass_man.import_manager import import_instance_file, import_model_file
from ass_man.export_manager import export_models, export_instances

JSON_TRUE = 'true'
ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}
GET = 'GET'
POST = 'POST'
DELETE = 'DELETE'
PUT = 'PUT'

MODEL_ORDERING_FILTERING_FIELDS = ['vendor', 'model_number', 'height', 'display_color',
                                   'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage']
MODEL_HEIGHT_UPDATE_ERROR_MSG = \
    'This update fails- the height of models may not be changed if instances of the model exist.'
MODEL_DESTROY_ERROR_MSG = 'Cannot delete this model as there are associated instances: '

INSTANCE_ORDERING_FILTERING_FIELDS = ['model', 'model__model_number', 'model__vendor',
                                      'hostname', 'rack', 'rack_u', 'owner']

RACK_ORDERING_FILTERING_FIELDS = ['rack_number']
RACK_DESTROY_SINGLE_ERR_MSG = 'Cannot delete rack as it contains the following instances:'
RACK_MANY_INCOMPLETE_QUERY_PARAMS_ERROR_MSG = 'Invalid rack range- must specify start and end rack number'
RACK_MANY_BAD_LETTER_ERROR_MSG = 'Your start letter must be less than or equal to your end letter'
RACK_MANY_BAD_NUMBER_ERROR_MSG = 'Your start number must be less than or equal to your end number'
RACK_MANY_CREATE_EXISTING_RACK_WARNING_MSG = 'Warning: skipping rack {} as it already exists.'
RACK_MANY_DELETE_NONEXISTENT_ERROR_MSG = 'Error: rack {} cannot be deleted as it does not exist. Continuing...'
RACK_MANY_DELETE_NOT_EMPTY_ERROR_MSG = 'Error: rack {} cannot be deleted as it is not empty. Continuing...'


# Docs for ModelViewSet: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset


class ModelViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Model.objects.all()

    def get_serializer_class(self):
        if self.request.method == GET:
            serializer_class = ModelSerializer if self.detail else ModelShortSerializer
        else:
            serializer_class = ModelSerializer
        return serializer_class

    ordering_fields = MODEL_ORDERING_FILTERING_FIELDS
    ordering = ['vendor', 'model_number']  # default ordering
    filterset_fields = MODEL_ORDERING_FILTERING_FIELDS
    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend]
    filterset_class = ModelFilter

    # Overriding of super functions
    def update(self, request, *args, **kwargs):
        model = self.get_object()
        prev_height = model.height
        instances = Asset.objects.all().filter(model=self.get_object())
        serializer = self.get_serializer(model, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        # Check to see if it's OK to update this model (if all instances still fit
        new_height = int(request.data['height'])

        if prev_height != new_height and instances.exists():
            return Response({
                'Error': MODEL_HEIGHT_UPDATE_ERROR_MSG
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()  # Save updates to the model

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        matches = Asset.objects.filter(model=self.get_object())
        if matches.count() > 0:
            offending_instances = []
            for match in matches:
                offending_instances.append(match.hostname.__str__() +
                                           ' at ' +
                                           match.rack.rack_number.__str__() +
                                           ' U' +
                                           match.rack_u.__str__())

            return Response(MODEL_DESTROY_ERROR_MSG +
                            ', '.join(offending_instances),
                            status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(self, request, *args, **kwargs)

    def list(self, request, *args, **kwargs):

        if request.query_params.get('export') == JSON_TRUE:
            queryset = self.filter_queryset(self.get_queryset())
            return export_models(queryset)

        return super().list(self, request, *args, *kwargs)

    # Custom actions below

    @action(detail=False, methods=['POST'])
    def import_file(self, request, *args, **kwargs):
        return import_model_file(request)

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

    @action(detail=True, methods=[GET])
    def can_delete(self, request, *args, **kwargs):
        matches = Asset.objects.all().filter(model=self.get_object())
        if matches.count() > 0:
            return Response({
                'can_delete': 'false'
            })
        return Response({
            'can_delete': 'true'
        })

    @action(detail=False, methods=[GET])
    def vendors(self, request, *args, **kwargs):
        vendor_typed = self.request.query_params.get('vendor') or ''
        vendors = list(
            Model.objects.values_list('vendor', flat=True).filter(vendor__istartswith=vendor_typed).distinct())
        return Response({
            'vendors': vendors
        })

    @action(detail=True, methods=[GET])
    def instances(self, request, *args, **kwargs):
        instances = Asset.objects.all().filter(model=self.get_object())
        page = self.paginate_queryset(instances)
        if page is not None:
            serializer = InstanceOfModelSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = InstanceOfModelSerializer(instances, many=True, context={'request': request})
        return Response(serializer.data)


class InstanceViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Asset.objects.all()

    def get_serializer_class(self):
        if self.request.method == GET:
            serializer_class = InstanceFetchSerializer if self.detail else InstanceShortSerializer
        else:
            serializer_class = InstanceSerializer
        return serializer_class

    ordering_fields = INSTANCE_ORDERING_FILTERING_FIELDS
    ordering = ['-id']
    filterset_fields = INSTANCE_ORDERING_FILTERING_FIELDS

    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend,
                       InstanceFilterByRack]
    filterset_class = InstanceFilter

    # Overriding of super functions

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        rack = instance.rack
        for i in range(instance.rack_u, instance.rack_u + instance.model.height):
            exec('rack.u{} = instance'.format(i))
        rack.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        prev_rack = instance.rack
        prev_rack_u = instance.rack_u
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        for i in range(prev_rack_u, prev_rack_u + instance.model.height + 1):
            exec('prev_rack.u{} = None'.format(i))
        prev_rack.save()
        self.perform_update(serializer)
        instance = self.get_object()
        new_rack = instance.rack
        for i in range(instance.rack_u, instance.rack_u + instance.model.height):
            exec('new_rack.u{} = instance'.format(i))
        new_rack.save()
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        if request.query_params.get('export') == 'true':
            # hostname,rack,rack_position,vendor,model_number,owner,comment
            queryset = self.filter_queryset(self.get_queryset())
            return export_instances(queryset)

        return super().list(self, request, *args, **kwargs)

    # Custom actions below
    @action(detail=False, methods=['POST'])
    def import_file(self, request, *args, **kwargs):
        return import_instance_file(request)


    @action(detail=False, methods=[GET])
    def filter_fields(self, request, *args, **kwargs):
        fields = ['model', 'vendor', 'model_number', 'hostname', 'rack', 'rack_u', 'owner_username', 'comment',
                  'rack_num_start', 'rack_num_end']
        return Response({
            'filter_fields': fields
        })

    @action(detail=False, methods=[GET])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'sorting_fields': self.ordering_fields
        })

    @action(detail=False, methods=[GET])
    def model_names(self, request, *args, **kwargs):
        name_typed = self.request.query_params.get('name') or ''
        models = Model.objects.annotate(
            unique_name=Concat('vendor', 'model_number')). \
            filter(unique_name__icontains=name_typed).all()
        serializer = UniqueModelsSerializer(models, many=True, context={'request': request})
        return Response(serializer.data)


class RackViewSet(viewsets.ModelViewSet):

    # View Housekeeping (permissions, serializers, filter fields, etc
    def get_permissions(self):
        if self.action in ADMIN_ACTIONS:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    queryset = Rack.objects.all() \
        .annotate(rack_letter=Substr('rack_number', 1, 1)) \
        .annotate(numstr_in_rack=Substr('rack_number', 2))
    queryset = queryset.annotate(number_in_rack=Cast('numstr_in_rack', IntegerField()))

    ordering = ['rack_letter', 'number_in_rack']
    ordering_fields = RACK_ORDERING_FILTERING_FIELDS

    filter_backends = [OrderingFilter,
                       djfiltBackend.DjangoFilterBackend,
                       RackFilter]
    filterset_fields = RACK_ORDERING_FILTERING_FIELDS

    def get_serializer_class(self):
        if self.request.method == GET:
            serializer_class = RackFetchSerializer
        else:
            serializer_class = RackSerializer
        return serializer_class

    # Overriding of super functions
    def destroy(self, request, *args, **kwargs):
        slots = ['u{}'.format(i) for i in range(1, 43)]
        offending_instances = []
        for slot in slots:
            match = getattr(self.get_object(), slot)
            if match:
                offending_instances.append(match.hostname.__str__()
                                           + ' at ' +
                                           match.rack.rack_number.__str__() +
                                           ' ' +
                                           slot.__str__())
        if len(offending_instances) > 0:
            err_message = RACK_DESTROY_SINGLE_ERR_MSG + ', '.join(offending_instances)
            return Response({
                'Error:', err_message
            }, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(self, request, *args, **kwargs)

    # New Actions
    @action(detail=False, methods=[GET])
    def filter_fields(self, request, *args, **kwargs):
        fields = RACK_ORDERING_FILTERING_FIELDS.copy()
        fields.extend(['rack_num_start', 'rack_num_end'])
        return Response({
            'filter_fields': fields
        })

    @action(detail=False, methods=[GET])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'sorting_fields': self.ordering_fields
        })

    @action(detail=False, methods=[POST, DELETE])
    def many(self, request, *args, **kwargs):
        try:
            srn = request.data['rack_num_start']
            ern = request.data['rack_num_end']
        except KeyError:
            return Response({
                'Error': RACK_MANY_INCOMPLETE_QUERY_PARAMS_ERROR_MSG
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            s_letter = srn[0].upper()
            e_letter = ern[0].upper()
            s_number = int(srn[1:])
            e_number = int(ern[1:])

            try:
                assert (s_letter <= e_letter)
            except AssertionError:
                return Response({
                    'Error': RACK_MANY_BAD_LETTER_ERROR_MSG
                }, status=status.HTTP_400_BAD_REQUEST)
            try:
                assert (s_number <= e_number)
            except AssertionError:
                return Response({
                    'Error': RACK_MANY_BAD_NUMBER_ERROR_MSG
                }, status=status.HTTP_400_BAD_REQUEST)

            rack_numbers = [x + y
                            for x in
                            (chr(i) for i in range(ord(s_letter), ord(e_letter) + 1))
                            for y in
                            (str(j) for j in range(s_number, e_number + 1))
                            ]
            results = []
            for rn in rack_numbers:
                rn_request_data = {
                    "rack_number": rn
                }
                if request.method == POST:
                    try:
                        serializer = self.get_serializer(data=rn_request_data)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        results.append(rn + ' successfully created')
                    except ValidationError:
                        results.append(RACK_MANY_CREATE_EXISTING_RACK_WARNING_MSG.format(rn))

                elif request.method == DELETE:
                    try:
                        rack = self.queryset.get(rack_number__iexact=rn)
                    except self.queryset.model.DoesNotExist:
                        results.append((RACK_MANY_DELETE_NONEXISTENT_ERROR_MSG.format(rn)))
                        continue
                    try:
                        rack.delete()
                    except ProtectedError:
                        results.append(RACK_MANY_DELETE_NOT_EMPTY_ERROR_MSG.format(rn))
                        continue
                    results.append(rn + ' successfully deleted')

        except (IndexError, ValueError) as e:
            return Response({
                'Error': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'results': ', '.join(results)
        }, status=status.HTTP_207_MULTI_STATUS)

    @action(detail=True, methods=[GET])
    def is_empty(self, request, *args, **kwargs):
        u_filled = 0
        slots = ['u{}'.format(i) for i in range(1, 43)]
        for field_name in slots:
            if getattr(self.get_object(), field_name):
                u_filled += 1
        if u_filled > 0:
            return Response({
                'is_empty': 'false'
            })
        return Response({
            'is_empty': 'true'
        })


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

    instances = Asset.objects.all()
    vendor_dict = {}
    model_dict = {}
    owner_dict = {}
    for instance in instances:
        if instance.model_id in model_dict:
            model_dict[instance.model_id] += 1
        else:
            model_dict[instance.model_id] = 1
        if instance.owner_id in owner_dict:
            owner_dict[instance.owner_id] += 1
        else:
            owner_dict[instance.owner_id] = 1

    model_dict_by_model_number = {}
    for model in model_dict.keys():
        model_obj = Model.objects.get(pk=model)
        model_dict_by_model_number[model_obj.vendor+' '+model_obj.model_number] = model_dict[model]
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
