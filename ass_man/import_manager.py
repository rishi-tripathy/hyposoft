import csv, io
from ass_man.models import Model, Asset, Rack, Datacenter, Power_Port, Network_Port, Asset_Number, BladeServer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
import re


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
    illegal_change = {}
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
            if not row['height'] and row['mount_type']=='blade':
                height = 1
            else:
                height = row['height']
            new_model = Model(vendor=row['vendor'], model_number=row['model_number'], height=height, \
                              cpu=row['cpu'], storage=row['storage'], comment=row['comment'], mount_type=row['mount_type'])
            if disp_col:
                new_model.display_color = disp_col
            if row['network_ports']:
                new_model.network_ports_num = row['network_ports']
            if row['power_ports']:
                new_model.power_ports = int(row['power_ports'])
            if row['memory']:
                new_model.memory = row['memory']
            nps = []
            csv_num_netports = int(row['network_ports']) if row['network_ports'] else 0
            for i in range(1, csv_num_netports + 1):
                if i <= 4 and row['network_port_name_{}'.format(i)]:
                    nps.append(row['network_port_name_{}'.format(i)])
                else:
                    nps.append(str(i))
            if len(nps) > 0:
                new_model.network_ports = nps
            models_to_create.append(new_model)
            continue
        csv_num_netports = int(row['network_ports']) if row['network_ports'] else 0
        created = False
        for i in range(csv_num_netports):
            if i<=3 and row['network_port_name_{}'.format(i + 1)] and (not model.network_ports or (len(model.network_ports) <= i or row['network_port_name_{}'.format(i + 1)] is not \
                    model.network_ports[i])):
                if should_override:
                    if not model.network_ports:
                        model.network_ports = []
                        created = True
                    if created:
                        model.network_ports.append(row['network_port_name_{}'.format(i + 1)])
                    else:
                        model.network_ports[i] = row['network_port_name_{}'.format(i + 1)]
                    should_update = True

        if str(model.height) != row['height']:
            if model.mount_type == 'blade':
                pass
            elif should_override:
                model.height = row['height']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_height"
                fields_overriden[key] = [model.height, row['height']]
            override = True
            if model.mount_type == 'blade':
                override=False
        if model.display_color != disp_col and (model.display_color != '777777' and not disp_col):
            if should_override:
                model.display_color = disp_col
                should_update = True
            else:
                key = model.vendor + model.model_number + "_display_color"
                fields_overriden[key] = [model.display_color, disp_col]
            override = True
        if str(model.network_ports_num) != row['network_ports'] and (model.network_ports_num or row['network_ports']):
            if should_override:
                model.network_ports_num = row['network_ports']
                should_update = True
            else:
                key = model.vendor + model.model_number + "_network_ports"
                fields_overriden[key] = [model.network_ports_num, row['network_ports']]
            override = True
        if str(model.power_ports) != row['power_ports'] and (model.power_ports or row['power_ports']):
            if should_override:
                pp_num = int(row['power_ports']) if row['power_ports'] else None
                model.power_ports = pp_num
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
        if model.mount_type != row['mount_type']:
            illegal_change[model.vendor+' '+model.model_number] = row['mount_type']
        if should_update:
            models_to_update.append(model)
        if override:
            overriden += 1
        else:
            ignored += 1
            models_to_ignore.append(model)
    if len(fields_overriden) > 0:
        err_message = ''
        for i in fields_overriden:
            err_message += ' Cannot update mount_type to {} for existing model: {}.'.format(fields_overriden[i], i)
        return Response({
            'Warning': err_message,
        }, status=status.HTTP_400_BAD_REQUEST)
    if overriden > 0 and not should_override:
        err_message = "Do you want to overwrite the following " \
                      "fields: "
        count = 0
        for field in fields_overriden.keys():
            err_message += "For " + field + " overwrite " + str(fields_overriden[field][0]) \
                           + " with " + fields_overriden[field][1] + ". "

        return Response({
            'Warning': err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    created_models = ''
    for model in models_to_create:
        model.save()
        created_models += model.vendor + ' ' + model.model_number + ' ,'
    updated_models = ''
    for model in models_to_update:
        model.save()
        updated_models += model.vendor + ' ' + model.model_number + ' ,'
    ignored_models = ''
    for model in models_to_ignore:
        ignored_models += model.vendor + ' ' + model.model_number + ' ,'

    return Response({
        'Number of models created': (len(models_to_create)),
        'Number of models ignored': ignored,
        'Number of models updated': overriden,
        'Models created': created_models,
        'Models updated': updated_models,
        'Models ignored': ignored_models
    })
# EV 4 updates:
# offline_site (abbr) DONE
# chassis_number (blank for non-blade) DONE
# chassis_slot DONE
# custom_display_color
# custom_cpu
# custom_memory
# custom_storage

def import_asset_file(request):
    file = request.FILES['file']
    reader = csv.DictReader(io.StringIO(file.read().decode('utf-8-sig')))
    assets_to_create = []
    assets_to_update = []
    assets_to_ignore = []
    racks_to_save = []
    power_ports_to_create = []
    nps_to_create = []
    should_override = request.query_params.get('override') or False
    overriden = 0
    ignored = 0
    uncreated_objects = {}
    uncreated_objects['model'] = []
    uncreated_objects['rack'] = []
    uncreated_objects['user'] = []
    uncreated_objects['datacenter/offline site'] = []
    uncreated_objects['chassis'] = []
    fields_overriden = {}
    blocked_assets = {}
    blocked_pps = {}
    # current_ass_num = Asset_Number.objects.get(pk=1).next_avail
    for row in reader:
        override = False
        should_update = False
        if row['asset_number']:
            try:
                asset = Asset.objects.get(asset_number=row['asset_number'])
            except Asset.DoesNotExist:
                asset = None
            try:
                blade = BladeServer.objects.get(asset_number=row['asset_number'])
            except BladeServer.DoesNotExist:
                blade = None
        else:
            asset = None
            blade = None
        #creating a new asset
        if asset is None and blade is None:
            dont_add = False
            # grab the model being referenced by asset
            try:
                model = Model.objects.get(vendor=row['vendor'], model_number=row['model_number'])
            except Model.DoesNotExist:
                uncreated_objects['model'].append((row['vendor'] + row['model_number']))
                dont_add = True
            dc_abbr = row['datacenter'] if row['datacenter'] else row['offline_site']
            try:
                datacenter = Datacenter.objects.get(abbreviation=dc_abbr)
            except Datacenter.DoesNotExist:
                if model and model.mount_type != 'blade':
                    uncreated_objects['datacenter/offline site'].append(dc_abbr)
                    dont_add = True
                datacenter = None
            if model.mount_type == 'blade':
                if row['offline_site']:
                    location = None
                else:
                    try:
                        location = Asset.objects.get(asset_number=int(row['chassis_number']))
                    except:
                        uncreated_objects['chassis'].append(row['chassis_number'])
                        location = None
                        dont_add = True
                if location:
                    try:
                        location.bladeserver_set.get(slot_number=int(row['chassis_slot']))
                        blocked_assets[row['asset_number']] = 'chassis {}, slot {}'.format(row['chassis_number'], row['chassis_slot'])
                        dont_add = True
                    except:
                        pass
            rack=None
            if datacenter and row['datacenter'] and model.mount_type != 'blade':
                try:
                    rack_set = False
                    #check if rack has already used during this import
                    for r in racks_to_save:
                        if (r.datacenter.abbreviation+'-'+r.rack_number) == (row['datacenter'] +"-"+ row['rack']):
                            rack = r
                            rack_set = True
                            break
                    if not rack_set:
                        rack = datacenter.rack_set.get(rack_number=row['rack'])
                except Rack.DoesNotExist:
                    uncreated_objects['rack'].append(row['datacenter']+'-'+row['rack'])
                    dont_add = True

            rack = rack if datacenter else None
            if row['chassis_number'] or row['offline_site']:
                pp1 = None
                pp2 = None
            else:
                pp1=re.search('([A-Z])([0-9]{1,2})$', row['power_port_connection_1'])
                pp2=re.search('([A-Z])([0-9]{1,2})$', row['power_port_connection_2'])
                # pp2_pdu = None
                try:
                    if pp1:
                        if pp1.group(1).upper() == 'L':
                            pp1_pdu = rack.pdu_l if rack else None
                        else:
                            pp1_pdu = rack.pdu_r if rack else None
                        # pp1_pdu = eval('rack.pdu_{}'.format(pp1.group(1).lower()))
                        if pp1_pdu:
                            pp_connected = pp1_pdu.power_port_set.get(port_number=pp1.group(2))
                            blocked_pps['New Asset'] = row['datacenter']+'-'+row['rack']+'-'+\
                            row['power_port_connection_1']
                            dont_add=True
                except Power_Port.DoesNotExist:
                    pass

                try:
                    if pp2:
                        if pp2.group(1).upper() == 'L':
                            pp2_pdu = rack.pdu_l if rack else None
                        else:
                            pp2_pdu = rack.pdu_r if rack else None
                        # pp2_pdu = eval('rack.pdu_{}'.format(pp1.group(1).lower()))
                        if pp2_pdu:
                            pp_connected = pp2_pdu.power_port_set.get(port_number=pp2.group(2))
                            blocked_pps['New Asset'] = row['datacenter']+'-'+row['rack']+'-'+\
                            row['power_port_connection_2']
                            dont_add=True
                except Power_Port.DoesNotExist:
                    pass
                if not pp1:
                    pp1_pdu = None
                if not pp2:
                    pp2_pdu = None

            try:
                owner = User.objects.get(username=row['owner'])
            except User.DoesNotExist:
                if row['owner']:
                    uncreated_objects['user'].append(row['owner'])
                    dont_add = True
                else:
                    owner = None
            if not dont_add:
                my_asset_number=row['asset_number']
                if not my_asset_number:
                    my_asset_number=None
                if model and model.mount_type == 'blade':
                    asset = BladeServer(model=model, hostname=row['hostname'], \
                                datacenter=datacenter, location=location, slot_number=row['chassis_slot'], \
                                owner=owner, comment=row['comment'], asset_number=my_asset_number)
                else:
                    r_u = row['rack_position'] if row['rack_position'] else None
                    asset = Asset(model=model, hostname=row['hostname'], \
                              datacenter=datacenter, rack=rack, rack_u=r_u, \
                              owner=owner, comment=row['comment'], asset_number=my_asset_number)
                num_nps = model.network_ports_num if (model and model.network_ports_num) else 0
                for i in range(num_nps):
                    np = Network_Port(name=model.network_ports[i], connection=None, asset=asset)
                    nps_to_create.append(np)
                if pp1:
                    power_port = Power_Port(pdu=pp1_pdu, port_number=pp1.group(2), asset=asset)
                    power_ports_to_create.append(power_port)
                if pp2:
                    power_port = Power_Port(pdu=pp2_pdu, port_number=pp2.group(2), asset=asset)
                    power_ports_to_create.append(power_port)
                if rack and row['rack_position']:
                    for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                        curr_asset = getattr(rack, 'u{}'.format(i))
                        if curr_asset is not None:
                            blocked = True
                            blocked_assets[asset.asset_number] = row['rack'] + "_u" + row['rack_position']

                    for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                        setattr(rack, 'u{}'.format(i), asset)
                    racks_to_save.append(rack)

                assets_to_create.append(asset)
            continue
        asset = asset if asset else blade
        uniq_model_name = asset.model.vendor + asset.model.model_number
        try:
            owner_name = asset.owner.username
        except AttributeError:
            owner_name = None
        if uniq_model_name != (row['vendor'] + row['model_number']):
            try:
                model = Model.objects.get(vendor=row['vendor'], model_number=row['model_number'])
            except Model.DoesNotExist:
                uncreated_objects['model'].append((row['vendor'] + row['model_number']))
                model = None
            if should_override:
                asset.model = model
                should_update = True
            else:
                key = str(asset.asset_number) + "_model"
                orig = asset.model.vendor + " " + asset.model.model_number
                new = model.vendor + " " + model.model_number
                fields_overriden[key] = [orig, new]
            override = True
        rack_handled=False
        if asset.datacenter and (asset.datacenter.abbreviation != row['datacenter'] and not row['offline_site']):
            try:
                datacenter = Datacenter.objects.get(abbreviation=row['datacenter'])
            except Datacenter.DoesNotExist:
                if model and model.mount_type != 'blade':
                    uncreated_objects['datacenter/offline site'].append(row['datacenter'])
                datacenter = None
            if datacenter:
                rack_handled = True
                try:
                    rack = datacenter.rack_set.get(rack_number=row['rack'])
                except Rack.DoesNotExist:
                    uncreated_objects['rack'].append(row['datacenter']+'-'+row['rack'])
                    rack = None
            else:
                rack = None
            if should_override:
                asset.datacenter = datacenter
                asset.rack = rack
                blocked = False
                for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                    curr_asset = getattr(rack, 'u{}'.format(i))
                    if curr_asset is not None:
                        blocked = True
                        blocked_assets[asset.asset_number] = row['rack'] + "_u" + row['rack_position']
                if not blocked:
                    asset.rack = rack
                    old_u = asset.rack_u
                    for i in range(old_u, old_u + asset.model.height):
                        setattr(rack, 'u{}'.format(i), None)
                    for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                        setattr(rack, 'u{}'.format(i), asset)
                    racks_to_save.append(rack)
                should_update = True
            else:
                fields_overriden[str(asset.asset_number)+'_datacenter'] = [asset.datacenter.abbreviation, row['datacenter']]
        if asset.datacenter and asset.model.mount_type != 'blade' and asset.rack and not rack_handled and (asset.datacenter.abbreviation+'-'+asset.rack.rack_number) != row['datacenter']+'-'+row['rack']:
            try:
                rack = datacenter.rack_set.get(rack_number=row['rack'])
            except Rack.DoesNotExist:
                uncreated_objects['rack'].append(row['datacenter']+'-'+row['rack'])
                rack = None

            if should_override:
                blocked = False
                for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                    curr_asset = getattr(rack, 'u{}'.format(i))
                    if curr_asset is not None:
                        blocked = True
                        blocked_assets[asset.asset_number] = row['rack'] + "_u" + row['rack_position']
                if not blocked:
                    asset.rack = rack
                    old_u = asset.rack_u
                    for i in range(old_u, old_u + asset.model.height):
                        setattr(rack, 'u{}'.format(i), None)
                    for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                        setattr(rack, 'u{}'.format(i), asset)
                    racks_to_save.append(rack)
                should_update = True
            else:
                key = str(asset.asset_number) + "_rack"
                orig = asset.rack.rack_number
                new = rack.rack_number
                fields_overriden[key] = [orig, new]
            override = True
        if asset.model.mount_type != 'blade' and str(asset.rack_u) != row['rack_position'] and not row['offline_site']:
            if should_override:
                rack_set = False
                try:
                    for r in racks_to_save:
                        if r.rack_number == row['rack']:
                            rack = r
                            rack_set = True
                            break
                    if not rack_set:
                        dat_cen = asset.datacenter
                        rack = dat_cen.rack_set.get(rack_number=row['rack'])
                except Rack.DoesNotExist:
                    rack = None
                blocked = False
                for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                    curr_asset = getattr(rack, 'u{}'.format(row['rack_position']))
                    if curr_asset is not None:
                        blocked = True
                        blocked_assets[asset.asset_number] = row['rack'] + "_u" + row['rack_position']
                if not blocked:
                    old_u = asset.rack_u
                    asset.rack_u = row['rack_position']
                    for i in range(old_u, old_u + asset.model.height):
                        setattr(rack, 'u{}'.format(i), None)
                    for i in range(int(row['rack_position']), int(row['rack_position']) + asset.model.height):
                        setattr(rack, 'u{}'.format(i), asset)
                    racks_to_save.append(rack)
                should_update = True
            else:
                key = str(asset.asset_number) + "_rack_position"
                fields_overriden[key] = [asset.rack_u, row['rack_position']]
            override = True

        if asset.datacenter and asset.datacenter.abbreviation != row['offline_site'] and not row['datacenter']:
            try:
                offline_site = Datacenter.objects.get(abbreviation=row['offline_site'], is_offline=True)
            except Datacenter.DoesNotExist:
                uncreated_objects['datacenter/offline site'].append(row['offline_site'])
                offline_site = None
            if should_override:
                asset.datacenter = offline_site
                should_update = True
            else:
                key = str(asset.asset_number) + "_offline_site"
                fields_overriden[key] = [asset.datacenter, row['offline_site']]
            override = True

        if asset.model.mount_type == 'blade' and (not row['offline_site']) and row['chassis_number'] and str(asset.location.asset_number) != row['chassis_number']:
            try:
                location = Asset.objects.get(asset_number=int(row['location']))
            except:
                uncreated_objects['chassis'].append(row['chassis_number'])
            if should_override:
                asset.location = location
                should_update = True
            else:
                key = str(asset.asset_number) + "_location"
                fields_overriden[key] = [asset.location.asset_number, row['chassis_number']]
            override = True
        if asset.model.mount_type == 'blade' and (not row['offline_site']) and asset.location and row['chassis_slot'] and (str(asset.slot_number) != row['chassis_slot']):
            try:
                if int(row['chassis_slot']) > 0 and int(row['chassis_slot']) <= 14:
                    asset.location.bladeserver_set.get(slot_number=int(row['chassis_number']))
                    blocked_assets[asset.asset_number] = 'chassis {}, slot {}'.format(asset.location.asset_number, row['chassis_slot'])
            except BladeServer.DoesNotExist:
                pass
            if should_override:
                asset.slot_number = row['chassis_slot']
                should_update = True
            else:
                key = str(asset.asset_number) + "_chassis_slot"
                fields_overriden[key] = [asset.slot_number, row['chassis_slot']]
            override = True

        if owner_name != row['owner'] and (owner_name or row['owner']):
            try:
                owner = User.objects.get(username=row['owner'])
            except User.DoesNotExist:
                if row['owner']:
                    uncreated_objects['user'].append(row['owner'])
                owner = None

            if should_override:
                asset.owner = owner
                should_update = True
            else:
                key = str(asset.asset_number) + "_owner"
                orig = owner_name
                try:
                    new = owner.username
                except AttributeError:
                    new = None
                fields_overriden[key] = [orig, new]
            override = True
        if asset.comment != row['comment']:
            if should_override:
                asset.comment = row['comment']
                should_update = True
            else:
                key = str(asset.asset_number)
                fields_overriden[key] = [asset.comment, row['comment']]
            override = True

        disp_col = row['custom_display_color']
        if disp_col.startswith('#'):
                    disp_col = disp_col[1:]
        if row['custom_display_color'] and asset.model.display_color != disp_col and asset.ovr_color != disp_col:
            asset.ovr_color = disp_col
            should_update = True
        if row['custom_cpu'] and asset.model.cpu != row['custom_cpu'] and asset.ovr_cpu != row['custom_cpu']:
            asset.ovr_cpu = row['custom_cpu']
            should_update = True
        if row['custom_memory'] and asset.model.memory != row['custom_memory'] and asset.ovr_memory != row['custom_memory']:
            asset.ovr_memory = row['custom_memory']
            should_update = True
        if row['custom_storage'] and asset.model.storage != row['custom_storage'] and asset.ovr_storage != row['custom_storage']:
            asset.ovr_storage = row['custom_storage']
            should_update = True

        if asset.model.mount_type != 'blade':
            pp1_reg=re.search('([A-Z])([0-9]{1,2})$', row['power_port_connection_1'])
            pp2_reg=re.search('([A-Z])([0-9]{1,2})$', row['power_port_connection_2'])
            dash1=False
            dash2=False
            if row['power_port_connection_1'] == '-':
                pp1_reg = '-'
                dash1 = True
            if row['power_port_connection_2'] == '-':
                pp2_reg = '-'
                dash2=True

            pp1 = asset.power_port_set.first()
            if pp1_reg and (dash1 or (not pp1 or int(pp1_reg.group(2)) != pp1.port_number or (pp1_reg.group(1).upper() != pp1.pdu.name.upper()[-1]))):
                #someting is different about port location
                if should_override:
                    if pp1_reg == '-':
                        pp1.port_number = None
                        pp1.pdu = None
                    else:
                        if pp1_reg.group(1).upper() == 'L':
                            pdu_update = asset.rack.pdu_l
                        else:
                            pdu_update = asset.rack.pdu_r
                        try:
                            pdu_update.power_port_set.get(port_number=int(pp1_reg.group(2)))
                            blocked_pps[asset.asset_number] = row['datacenter']+'-'+row['rack']+'-'+\
                            row['power_port_connection_1']
                        except Power_Port.DoesNotExist:
                            pass
                        if not pp1:
                            pp1 = Power_Port(name='', pdu=pdu_update, port_number=int(pp1_reg.group(2)), asset=asset)
                        pp1.port_number = int(pp1_reg.group(2))
                        pp1.pdu = pdu_update
                    should_update=True
                    power_ports_to_create.append(pp1)
                else:
                    key = pp1.pdu.name.upper()[-1]+str(pp1.port_number) if (pp1 and pp1.pdu) else ''
                    fields_overriden[str(asset.asset_number)+'_power_port'] = \
                    [key,row['power_port_connection_1']]
                override=True


            try:
                pp2 = asset.power_port_set.all().order_by('pk')[1]
            except IndexError:
                pp2=None
            if pp2_reg and (dash2 or (not pp2 or int(pp2_reg.group(2)) != pp2.port_number or (pp2_reg.group(1).upper() != pp2.pdu.name.upper()[-1]))):
                #someting is different about port location
                if should_override:
                    if pp2_reg == '-':
                        pp2.port_number = None
                        pp2.pdu = None
                    else:
                        if pp2_reg.group(1).upper() == 'L':
                            pdu_update = asset.rack.pdu_l
                        else:
                            pdu_update = asset.rack.pdu_r
                        try:
                            pdu_update.power_port_set.get(port_number=int(pp2_reg.group(2)))
                            blocked_pps[asset.asset_number] = row['datacenter']+'-'+row['rack']+'-'+\
                            row['power_port_connection_2']
                        except Power_Port.DoesNotExist:
                            pass
                        if not pp2:
                            pp2 = Power_Port(name='', pdu=pdu_update, port_number=int(pp2_reg.group(2)), asset=asset)
                        pp2.port_number = int(pp2_reg.group(2))
                        pp2.pdu = pdu_update
                    should_update=True
                    power_ports_to_create.append(pp2)
                else:
                    key = pp2.pdu.name.upper()[-1]+str(pp2.port_number) if (pp2 and pp2.pdu) else ''
                    fields_overriden[str(asset.asset_number)+'_power_port'] = \
                    [key,row['power_port_connection_2']]
                override=True

        if should_update:
            assets_to_update.append(asset)
        elif override:
            overriden += 1
        else:
            ignored += 1
            assets_to_ignore.append(asset)


    if len(uncreated_objects['model']) > 0 or len(uncreated_objects['rack']) > 0 or len(uncreated_objects['user']) > 0 or len(uncreated_objects['datacenter/offline site']):
        err_message = "The following objects were referenced, but have not been created. "
        for i in uncreated_objects.keys():
            err_message += i + ": "
            for j in uncreated_objects[i]:
                err_message += j + ", "
            err_message += ". "
        return Response({
            'Warning': err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    err_message = "The following assets are blocked for placement: "
    if len(blocked_assets.keys()) > 0:
        for inst in blocked_assets.keys():
            err_message += str(inst) + " at " + blocked_assets[inst] + ". "
        return Response({
            'Warning': err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    if overriden > 0 and not should_override:
        err_message = "Do you want to overwrite the following " \
                      "fields: "
        count = 0
        for field in fields_overriden.keys():
            err_message += "For " + field + " overwrite " + str(fields_overriden[field][0]) \
                           + " with " + fields_overriden[field][1] + ". "

        return Response({
            'Warning': err_message,
        }, status=status.HTTP_400_BAD_REQUEST)
    created_assets = ''
    updated_assets = ''
    ignored_assets = ''
    current_ass_num = 0
    assets_without_ass_nums = []
    for asset in assets_to_create:
        if not asset.asset_number:
            assets_without_ass_nums.append(asset)
        else:
            asset.save()
            created_assets += str(asset.asset_number) + ", "
    for asset in assets_to_update:
        asset.save()
        updated_assets += str(asset.asset_number) + ", "
    for asset in assets_to_ignore:
        ignored_assets += str(asset.asset_number) + ", "
    for asset in assets_without_ass_nums:
        asset.asset_number = assign_ass_num(current_ass_num)
        asset.save()
        created_assets += str(asset.asset_number) + ", "
        current_ass_num = asset.asset_number + 1
    for power_port in power_ports_to_create:
        power_port.save()
    for rack in racks_to_save:
        rack.save()
    for np in nps_to_create:
        np.save()
    num = Asset_Number.objects.all().first()
    if num:
        num.next_avail = current_ass_num
    return Response({
        'Number of assets created': (len(assets_to_create)),
        'Number of assets ignored': ignored,
        'Number of assets updated': (len(assets_to_update)),
        'Created assets': created_assets,
        'Updated assets': updated_assets,
        'Ignored assets': ignored_assets
    })

def assign_ass_num(curr):
    if curr == 0:
        try:
            num = Asset_Number.objects.get(pk=1)
        except Asset_Number.DoesNotExist:
            num = Asset_Number.objects.create(next_avail=100000)
        curr = num.next_avail
    try:
        while True:
            Asset.objects.get(asset_number=curr)
            curr += 1
    except Asset.DoesNotExist:
        return curr

def import_network_port_file(request):
    file = request.FILES['file']
    reader = csv.DictReader(io.StringIO(file.read().decode('utf-8-sig')))
    should_override = request.query_params.get('override') or False
    uncreated_objects = {}
    uncreated_objects['asset'] = []
    uncreated_objects['network_port'] = []
    fields_overriden = {}
    updated_nps = []
    ignored_nps = []
    overriden = 0
    for row in reader:
        override=False
        updated=False
        ignored=True
        try:
            src_asset=Asset.objects.get(hostname=row['src_hostname'])
        except Asset.DoesNotExist:
            uncreated_objects['asset'].append(row['src_hostname'])
            src_asset=None
        try:
            src_port=src_asset.network_port_set.get(name=row['src_port']) if src_asset else None
        except Network_Port.DoesNotExist:
            uncreated_objects['network_port'].append(row['src_port'])
            src_port=None
        try:
            dest_asset=Asset.objects.get(hostname=row['dest_hostname']) if row['dest_hostname'] else None
        except Asset.DoesNotExist:
            uncreated_objects['asset'].append(row['dest_hostname'])
            dest_asset=None
        try:
            dest_port=dest_asset.network_port_set.get(name=row['dest_port']) if dest_asset else None
        except Network_Port.DoesNotExist:
            uncreated_objects['network_port'].append(row['dest_port'])
            dest_port=None

        # connection to different asset, different port, or from unconnected to connected
        if src_port and src_port.connection != dest_port and (src_port.connection or dest_port):
            print('stat')
            print(src_port.connection)
            print(dest_port)
            if should_override:
                if src_port.connection:
                    src_port.connection.connection = None
                src_port.connection = dest_port
                updated=True
            else:
                key = src_port.connection.name if src_port.connection else ''
                fields_overriden[row['src_hostname']+'__'+row['src_port']] = \
                [row['src_hostname']+'-'+key, \
                row['dest_hostname']+'-'+row['dest_port']]
                override=True

        if dest_port and dest_port.connection != src_port:
            if should_override:
                if dest_port.connection:
                    dest_port.connection.connection = None
                dest_port.connection = src_port
                updated=True
            else:
                key = dest_port.connection.name if dest_port.connection else ''
                fields_overriden[row['dest_hostname']+'__'+row['dest_port']] = \
                [row['dest_hostname']+'-'+key, \
                row['src_hostname']+'-'+row['src_port']]
                override=True

        if src_port and src_port.mac != row['src_mac']:
            if should_override:
                src_port.mac=row['src_mac']
                updated=True
            else:
                fields_overriden[row['src_hostname']+'__'+row['src_port']] = \
                [src_port.mac, row['src_mac']]
                override=True

        if updated:
            if src_port:
                updated_nps.append(src_port)
            if dest_port:
                updated_nps.append(dest_port)
        elif override:
            overriden+=1
        elif ignored:
            ignored_nps.append(src_port)

    if len(uncreated_objects['asset']) > 0 or len(uncreated_objects['network_port']) > 0:
        err_message = "The following objects were referenced, but have not been created. "
        for i in uncreated_objects.keys():
            err_message += i + ": "
            for j in uncreated_objects[i]:
                err_message += j + ", "
            err_message += ". "
        return Response({
            'Warning': err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    if overriden > 0 and not should_override:
        err_message = "Do you want to overwrite the following " \
                      "fields: "
        for field in fields_overriden.keys():
            err_message += "For " + field + " overwrite " + str(fields_overriden[field][0]) \
                           + " with " + fields_overriden[field][1] + ". "
        return Response({
            'Warning': err_message,
        }, status=status.HTTP_400_BAD_REQUEST)

    # created_nps_str = ''
    updated_nps_str = ''
    ignored_nps_str = ''
    for np in updated_nps:
        np.save()
        updated_nps_str += src_port.name + ', '
    # for np in created_nps:
    #     np.save()
    #     created_nps_str += src_port.name + ', '
    for np in ignored_nps:
        ignored_nps_str += src_port.name + ', '


    return Response({
        'Number of assets ignored': len(ignored_nps),
        'Number of assets updated': len(updated_nps),
        'Updated connections': updated_nps_str,
        'Ignored connections': ignored_nps_str
    })
