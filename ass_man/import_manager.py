import csv, io
from ass_man.models import Model, Instance, Rack
from rest_framework.response import Response

def import_model_file(request):
    file = request.FILES['file']
    reader = csv.DictReader(io.StringIO(file.read().decode('utf-8-sig')))
    models_to_create = []
    models_to_update = []
    models_to_ignore = []
    should_override = request.query_params.get('override') or False
    overriden = 0
    ignored = 0
    fields_overriden = {}
    for row in reader:
        override = False
        should_update = False
        try:
            model = Model.objects.get(vendor=row['vendor'], model_number=row['model_number'])
        except Model.DoesNotExist:
            model = None
        disp_col = row['display_color']
        if disp_col.startswith('#'):
            disp_col = disp_col[1:]
        if model is None:
            new_model = Model(vendor=row['vendor'], model_number=row['model_number'],height=row['height'], \
            cpu=row['cpu'], storage=row['storage'], comment=row['comment'])
            if disp_col:
                new_model.display_color=disp_col
            if row['ethernet_ports']:
                new_model.ethernet_ports=row['ethernet_ports']
            if row['power_ports']:
                new_model.power_ports=row['power_ports']
            if row['memory']:
                new_model.memory=row['memory']
            models_to_create.append(new_model)
            continue
        if str(model.height) != row['height']:
            if should_override:
                model.height = row['height']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_height"
                fields_overriden[key] = [model.height, row['height']]
            override = True
        if model.display_color != disp_col and (model.display_color != '777777' and not disp_col):
            if should_override:
                model.display_color = disp_col
                should_update = True
            else:
                key = model.vendor + model.model_number + "_display_color"
                fields_overriden[key] = [model.display_color, disp_col]
            override = True
        if str(model.ethernet_ports) != row['ethernet_ports'] and (model.ethernet_ports or row['ethernet_ports']):
            if should_override:
                model.ethernet_ports = row['ethernet_ports']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_ethernet_ports"
                fields_overriden[key] = [model.ethernet_ports, row['ethernet_ports']]
            override = True
        if str(model.power_ports) != row['power_ports'] and (model.power_ports or row['power_ports']):
            if should_override:
                model.power_ports = row['power_ports']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_power_ports"
                fields_overriden[key] = [model.power_ports, row['power_ports']]
            override = True
        if model.cpu != row['cpu'] and (model.cpu or row['cpu']):
            if should_override:
                model.cpu = row['cpu']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_cpu"
                fields_overriden[key] = [model.cpu, row['cpu']]
            override = True
        if str(model.memory) != row['memory'] and (model.memory or row['memory']):
            if should_override:
                model.memory = row['memory']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_memory"
                fields_overriden[key] = [model.memory, row['memory']]
            override = True
        if model.storage != row['storage'] and (model.storage or row['storage']):
            if should_override:
                model.storage = row['storage']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_storage"
                fields_overriden[key] = [model.storage, row['storage']]
            override = True
        if model.comment != row['comment'] and (model.comment or row['comment']):
            if should_override:
                model.comment = row['comment']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_comment"
                fields_overriden[key] = [model.comment, row['comment']]
            override = True
        if should_update:
            models_to_update.append(model)
        if override:
            overriden+=1
        else:
            ignored+=1
            models_to_ignore.append(model)

    if overriden > 0 and not should_override:
        err_message = "Do you want to overwrite the following "\
        "fields: "
        count = 0
        for field in fields_overriden.keys():
            err_message += "For " + field + " overwrite " + str(fields_overriden[field][0]) \
            + " with " + fields_overriden[field][1] + ". "

        return Response({
            'Warning' : err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    created_models = ''
    for model in models_to_create:
        model.save()
        created_models += model.vendor+' '+model.model_number+' ,'
    updated_models = ''
    for model in models_to_update:
        model.save()
        updated_models += model.vendor+' '+model.model_number+' ,'
    ignored_models = ''
    for model in models_to_ignore:
        ignored_models += model.vendor+' '+model.model_number+' ,'

    return Response({
    'Number of models created': (len(models_to_create)),
    'Number of models ignored': ignored,
    'Number of models updated': overriden,
    'Models created': created_models,
    'Models updated': updated_models,
    'Models ignored': ignored_models
    })

def import_instance_file(request):
    file = request.FILES['file']
    reader = csv.DictReader(io.StringIO(file.read().decode('utf-8-sig')))
    instances_to_create = []
    instances_to_update = []
    instances_to_ignore = []
    racks_to_save = []
    should_override = request.query_params.get('override') or False
    overriden = 0
    ignored = 0
    uncreated_objects = {}
    uncreated_objects['model'] = []
    uncreated_objects['rack'] = []
    uncreated_objects['user'] = []
    fields_overriden = {}
    blocked_instances = {}
    for row in reader:
        override = False
        should_update = False
        try:
            instance = Instance.objects.get(hostname=row['hostname'])
        except Instance.DoesNotExist:
            instance = None
        if instance is None:
            dont_add = False
            try:
                model = Model.objects.get(vendor=row['vendor'], model_number=row['model_number'])
            except Model.DoesNotExist:
                uncreated_objects['model'].append((row['vendor'] + row['model_number']))
                dont_add = True
            try:
                rack_set = False
                for r in racks_to_save:
                    if r.rack_number == row['rack']:
                        rack = r
                        rack_set = True
                        break
                if not rack_set:
                    rack = Rack.objects.get(rack_number=row['rack'])
            except Rack.DoesNotExist:
                uncreated_objects['rack'].append(row['rack'])
                dont_add = True
            try:
                owner = User.objects.get(username=row['owner'])
            except User.DoesNotExist:
                if row['owner']:
                    uncreated_objects['user'].append(row['owner'])
                    dont_add = True
                else:
                    owner=None
            if not dont_add:
                instance = Instance(model=model, hostname=row['hostname'],\
                rack=rack, rack_u=row['rack_position'], owner=owner, comment=row['comment'])
                for i in range(int(row['rack_position']), int(row['rack_position'])+instance.model.height):
                    curr_instance = getattr(rack, 'u{}'.format(i))
                    if curr_instance is not None:
                        blocked = True
                        blocked_instances[instance.hostname] =row['rack']+"_u"+row['rack_position']

                for i in range(int(row['rack_position']), int(row['rack_position'])+instance.model.height):
                    setattr(rack, 'u{}'.format(i), instance)
                racks_to_save.append(rack)

                instances_to_create.append(instance)
            continue

        uniq_model_name = instance.model.vendor + instance.model.model_number
        try:
            owner_name = instance.owner.username
        except AttributeError:
            owner_name = None
        if uniq_model_name != (row['vendor'] + row['model_number']):
            try:
                model = Model.objects.get(vendor=row['vendor'], model_number=row['model_number'])
            except Model.DoesNotExist:
                uncreated_objects['model'].append((row['vendor'] + row['model_number']))
                model = None
            if should_override:
                instance.model = model
                should_update = True
            else:
                key = instance.hostname + "_model"
                orig = instance.model.vendor + " " + instance.model.model_number
                new = model.vendor + " " + model.model_number
                fields_overriden[key] = [orig, new]
            override = True
        if instance.rack.rack_number != row['rack']:
            try:
                rack = Rack.objects.get(rack_number=row['rack'])
            except Rack.DoesNotExist:
                uncreated_objects['rack'].append(row['rack'])
                rack = None

            if should_override:
                blocked = False
                for i in range(int(row['rack_position']), int(row['rack_position'])+instance.model.height):
                    curr_instance = getattr(rack, 'u{}'.format(i))
                    if curr_instance is not None:
                        blocked = True
                        blocked_instances[instance.hostname] =row['rack']+"_u"+row['rack_position']
                if not blocked:
                    instance.rack = rack
                    for i in range(old_u, old_u+instance.model.height):
                        setattr(rack, 'u{}'.format(i), None)
                    for i in range(int(row['rack_position']), int(row['rack_position'])+instance.model.height):
                        setattr(rack, 'u{}'.format(i), instance)
                    racks_to_save.append(rack)
                should_update = True
            else:
                key = instance.hostname + "_rack"
                orig = instance.rack.rack_number
                new = rack.rack_number
                fields_overriden[key] = [orig, new]
            override = True
        if str(instance.rack_u) != row['rack_position']:
            if should_override:
                rack_set = False
                try:
                    for r in racks_to_save:
                        if r.rack_number == row['rack']:
                            rack = r
                            rack_set = True
                            break
                    if not rack_set:
                        rack = Rack.objects.get(rack_number=row['rack'])
                except Rack.DoesNotExist:
                    rack = None
                blocked = False
                for i in range(int(row['rack_position']), int(row['rack_position'])+instance.model.height):
                    curr_instance = getattr(rack, 'u{}'.format(row['rack_position']))
                    if curr_instance is not None:
                        blocked = True
                        blocked_instances[instance.hostname] =row['rack']+"_u"+row['rack_position']
                if not blocked:
                    old_u = instance.rack_u
                    instance.rack_u = row['rack_position']
                    print('old u ' + str(old_u))
                    print('new u ' + str(instance.rack_u))
                    for i in range(old_u, old_u+instance.model.height):
                        setattr(rack, 'u{}'.format(i), None)
                    for i in range(int(row['rack_position']), int(row['rack_position'])+instance.model.height):
                        setattr(rack, 'u{}'.format(i), instance)
                    racks_to_save.append(rack)
                should_update = True
            else:
                key = instance.hostname + "_rack_position"
                fields_overriden[key] = [instance.rack_u, row['rack_position']]
            override = True

        if owner_name != row['owner'] and (owner_name or row['owner']):
            try:
                owner = User.objects.get(username=row['owner'])
            except User.DoesNotExist:
                if row['owner']:
                    uncreated_objects['user'].append(row['owner'])
                owner = None

            if should_override:
                instance.owner = owner
                should_update = True
            else:
                key = instance.hostname + "_owner"
                orig = owner_name
                try:
                    new = owner.username
                except AttributeError:
                    new = None
                fields_overriden[key] = [orig, new]
            override = True
        if instance.comment != row['comment']:
            if should_override:
                instance.comment = row['comment']
                should_update = True
            else:
                key = instance.hostname
                fields_overriden[key] = [instance.comment, row['comment']]
            override = True
        if should_update:
            instances_to_update.append(instance)
        if override:
            overriden+=1
        else:
            ignored+=1
            instances_to_ignore.append(instance)

    if len(uncreated_objects['model']) > 0 or len(uncreated_objects['rack']) > 0 or len(uncreated_objects['user']) > 0:
        err_message = "The following objects were referenced, but have not been created. "
        for i in uncreated_objects.keys():
            err_message+= i + ": "
            for j in uncreated_objects[i]:
                err_message+= j + ", "
            err_message+=". "
        return Response({
            'Warning' : err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    err_message = "The following instances are blocked for placement: "
    if len(blocked_instances.keys()) > 0:
        for inst in blocked_instances.keys():
            err_message+=inst + " at " + blocked_instances[inst] + ". "
        return Response({
            'Warning' : err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    if overriden > 0 and not should_override:
        err_message = "Do you want to overwrite the following "\
        "fields: "
        count = 0
        for field in fields_overriden.keys():
            err_message += "For " + field + " overwrite " + str(fields_overriden[field][0]) \
            + " with " + fields_overriden[field][1] + ". "

        return Response({
            'Warning' : err_message,
        }, status=status.HTTP_400_BAD_REQUEST)
    created_instances = ''
    updated_instances = ''
    ignored_instances = ''
    for instance in instances_to_create:
        instance.save()
        created_instances+=instance.hostname + ", "
    for instance in instances_to_update:
        instance.save()
        updated_instances+=instance.hostname + ", "
    for instance in instances_to_ignore:
        ignored_instances+=instance.hostname + ", "
    for rack in racks_to_save:
        rack.save()
    return Response({
    'Number of instances created': (len(instances_to_create)),
    'Number of instances ignored': ignored,
    'Number of instances updated': overriden,
    'Created instances':created_instances,
    'Updated instances':updated_instances,
    'Ignored instances':ignored_instances
    })
