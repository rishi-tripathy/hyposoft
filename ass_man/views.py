from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import Concat
from django.db.models import CharField
from django.http import HttpResponse
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
                                 UniqueModelsSerializer,
                                 VendorsSerializer)

# Auth
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth.models import User
# Project
from ass_man.models import Model, Instance, Rack
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend as DjangoFiltersBackend
from ass_man.filters import InstanceFilter, ModelFilter, RackFilter, InstanceFilterByRack
from rest_framework.serializers import ValidationError
from rest_framework.request import Request, HttpRequest
import json
import csv


ADMIN_ACTIONS = {'create', 'update', 'partial_update', 'destroy'}


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
        if self.request.method == 'GET':
            serializer_class = ModelSerializer if self.detail else ModelShortSerializer
        else:
            serializer_class = ModelSerializer
        return serializer_class

    ordering_fields = ['vendor', 'model_number', 'height', 'display_color',
                       'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage']

    filterset_fields = ['vendor', 'model_number', 'height', 'display_color',
                        'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage']

    # Overriding of super functions
    def update(self, request, *args, **kwargs):
        model = self.get_object()
        prev_height = model.height
        instances = Instance.objects.all().filter(model=self.get_object())
        serializer = self.get_serializer(model, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        # Check to see if it's OK to update this model (if all instances still fit
        new_height = int(request.data['height'])

        if prev_height != new_height and instances.exists():
            return Response(
              'This update fails- the height of models may not be changed if instances of the model exist.',
              status=status.HTTP_400_BAD_REQUEST)


        serializer.save()  # Save updates to the model

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        matches = Instance.objects.filter(model=self.get_object())
        if matches.count() > 0:
            offending_instances = []
            for match in matches:
                offending_instances.append(match.hostname.__str__() +
                                           ' at ' +
                                           match.rack.rack_number.__str__() +
                                           ' U' +
                                           match.rack_u.__str__())
            return Response('Cannot delete this model as there are associated instances: ' +
                            ', '.join(offending_instances),
                            status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(self, request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if request.query_params.get('export') == 'true':
        #    vendor,model_number,height,display_color,ethernet_ports,power_ports,cpu,memory,storage,comment
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="models.csv"'

            writer = csv.writer(response)
            writer.writerow(['vendor', 'model_number', 'height', 'display_color', 'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment'])
            for model in queryset:
                writer.writerow([model.vendor, model.model_number, model.height, model.display_color, model.ethernet_ports, model.power_ports, model.cpu, model.memory, model.storage, model.comment])
            return response
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Custom actions below
    @action(detail=False, methods=['POST'])
    def import_file(self, request, *args, **kwargs):
        file = request.data['file']
        reader = csv.reader(file)
        models_created = []
        models_to_override
        for row in reader:
            obj, create = Model.objects.get_or_create(
            vendor=row[0],
            model_number=row[1]
            )
            #object already exisits
            if not create:
                models_to_override.append(obj)
            elif create:
                obj.display_color=row[2]
                obj.ethernet_ports=row[3]
                obj.power_ports=row[4]
                obj.cpu=row[5]
                obj.memory=row[6
                obj.storage=row[7]
                obj.comment=row[8]
            if create:
                models_created.append(obj)
            else:

        return Response()

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

    @action(detail=True, methods=['GET'])
    def can_delete(self, request, *args, **kwargs):
        matches = Instance.objects.all().filter(model=self.get_object())
        if matches.count() > 0:
            return Response({
                'can_delete': 'false'
            })
        return Response({
            'can_delete': 'true'
        })

    @action(detail=False, methods=['GET'])
    def vendors(self, request, *args, **kwargs):
        vendor_typed = self.request.query_params.get('vendor') or ''
        vendors = list(Model.objects.values_list('vendor', flat=True).filter(vendor__istartswith=vendor_typed).distinct())
        return Response({
            'vendors': vendors
        })

    @action(detail=True, methods=['GET'])
    def instances(self, request, *args, **kwargs):
        instances = Instance.objects.all().filter(model=self.get_object())
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

    queryset = Instance.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            serializer_class = InstanceFetchSerializer if self.detail else InstanceShortSerializer
        else:
            serializer_class = InstanceSerializer
        return serializer_class

    ordering_fields = ['model', 'model__model_number', 'model__vendor',
                       'hostname', 'rack', 'rack_u', 'owner']

    filterset_fields = ['model', 'model__model_number', 'model__vendor',
                        'hostname', 'rack', 'rack_u', 'owner']

    filter_backends = [OrderingFilter,
                       DjangoFiltersBackend,
                       InstanceFilterByRack]
    # Overriding of super functions

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        rack = instance.rack
        for i in range(instance.rack_u, instance.rack_u+instance.model.height):
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
        for i in range(instance.rack_u, instance.rack_u+instance.model.height):
            exec('new_rack.u{} = instance'.format(i))
        new_rack.save()
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if request.query_params.get('export') == 'true':
        #    hostname,rack,rack_position,vendor,model_number,owner,comment
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="models.csv"'

            writer = csv.writer(response)
            writer.writerow(['hostname', 'rack', 'rack_position', 'vendor', 'model_number', 'owner', 'comment'])
            for instance in queryset:
                writer.writerow([instance.hostname, instance.rack.rack_number, instance.rack_u, instance.model.vendor, instance.model.model_number, instance.owner.username, instance.comment])
            return response
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Custom actions below

    @action(detail=False, methods=['GET'])
    def filter_fields(self, request, *args, **kwargs):
        fields = self.filterset_fields
        fields.extend(('start_rack_num', 'end_rack_num'))
        return Response({
            'filter_fields': fields
        })

    @action(detail=False, methods=['GET'])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'sorting_fields': self.ordering_fields
        })

    @action(detail=False, methods=['GET'])
    def model_names(self, request, *args, **kwargs):
        name_typed = self.request.query_params.get('name') or ''
        models = Model.objects.annotate(
            unique_name=Concat('vendor', 'model_number')).\
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

    queryset = Rack.objects.all()

    ordering_fields = ['rack_number']

    filter_backends = [OrderingFilter,
                       DjangoFiltersBackend,
                       RackFilter]


    filter_backends = [OrderingFilter,
                       DjangoFiltersBackend,
                       RackFilter]


    filterset_fields = ['rack_number']

    def get_serializer_class(self):
        if self.request.method == 'GET':
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
            err_message = 'Cannot delete this rack as it contains instances: ' +', '.join(offending_instances)
            return Response({
                'Error:', err_message
            }, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(self, request, *args, **kwargs)

    # New Actions
    @action(detail=False, methods=['GET'])
    def filter_fields(self, request, *args, **kwargs):
        fields = self.filterset_fields
        fields.extend(('start_rack_num', 'end_rack_num'))
        return Response({
            'filter_fields': fields
        })

    @action(detail=False, methods=['GET'])
    def sorting_fields(self, request, *args, **kwargs):
        return Response({
            'sorting_fields': self.ordering_fields
        })

    @action(detail=False, methods=['POST', 'DELETE'])
    def many(self, request, *args, **kwargs):
        try:
            srn = request.data['start_rack_num']
            ern = request.data['end_rack_num']
        except KeyError:
            return Response({
                'Error': 'Invalid rack range- must specify start and end rack number'
            },status=status.HTTP_400_BAD_REQUEST)
        try:
            s_letter = srn[0].upper()
            e_letter = ern[0].upper()
            s_number = int(srn[1:])
            e_number = int(ern[1:])

            try:
                assert(s_letter <= e_letter)
            except AssertionError:
                return Response({
                    'Error': 'Your start letter must be less than or equal to your end letter'
                }, status=status.HTTP_400_BAD_REQUEST)
            try:
                assert(s_number <= e_number)
            except AssertionError:
                return Response({
                    'Error': 'Your start number must be less than or equal to your end number'
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
                if request.method == 'POST':
                    try:
                        serializer = self.get_serializer(data=rn_request_data)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        results.append(rn + ' successfully created')
                    except ValidationError:
                        results.append('Warning: skipping rack ' + rn + ' as it already exists')

                elif request.method == 'DELETE':
                    try:
                        rack = self.queryset.get(rack_number__iexact=rn)
                    except AssertionError:
                        results.append(('Error: rack ' + rn + ' cannot be deleted as it does not exist. Continuing...'))
                        continue
                    try:
                        resp = rack.delete()
                        assert (resp.status != status.HTTP_400_BAD_REQUEST)
                    except AssertionError:
                        results.append('Error: rack ' + rn + ' cannot be deleted as it is not empty. Continuing...')
                        continue
                    results.append(rn + ' successfully deleted')

        except (IndexError, ValueError) as e:
            return Response({
                'Error': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'results': results
        }, status=status.HTTP_207_MULTI_STATUS)

    @action(detail=True, methods=['GET'])
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

@api_view(['GET'])
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
    percentage_occupied = occupied/total*100
    percentage_free = (total-occupied)/total*100

    instances = Instance.objects.all()
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
        model_dict_by_model_number[model_obj.model_number] = model_dict[model]
        if model_obj.vendor in vendor_dict:
            vendor_dict[model_obj.vendor] += model_dict[model]
        else:
            vendor_dict[model_obj.vendor] = model_dict[model]

    owner_dict_by_username = {}
    for owner_id in owner_dict.keys():
        owner = User.objects.get(pk=owner_id)
        owner_dict_by_username[owner.username] = owner_dict[owner_id]

    return Response({
        'rackspace_used': percentage_occupied,
        'rackspace_free': percentage_free,
        'models_allocated': model_dict_by_model_number,
        'vendors_allocated': vendor_dict,
        'owners_allocated': owner_dict_by_username
    })
