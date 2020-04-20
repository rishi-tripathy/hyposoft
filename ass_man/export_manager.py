import csv
from django.http import HttpResponse
from ass_man.models import AllAssets
from django.core.exceptions import ObjectDoesNotExist

MODEL_EXPORT_FIELDS = ['mount_type', 'vendor', 'model_number', 'height', 'display_color', \
                       'network_ports', 'power_ports', 'cpu', 'memory', 'storage', \
                       'comment', 'network_port_name_1', 'network_port_name_2', \
                       'network_port_name_3', 'network_port_name_4']
ASSET_EXPORT_FIELDS = ['asset_number', 'hostname', 'datacenter', 'offline_site', 'rack', \
                       'rack_position', 'chassis_number', 'chassis_slot', 'vendor', 'model_number', 'owner', \
                       'comment', 'power_port_connection_1', 'power_port_connection_2', \
                       'custom_display_color', 'custom_cpu', 'custom_memory', 'custom_storage']
NETWORK_PORT_EXPORT_FIELDS = ['src_hostname', 'src_port', 'src_mac', 'dest_hostname', \
                       'dest_port']


def export_models(queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="models.csv"'

    writer = csv.writer(response)
    writer.writerow(MODEL_EXPORT_FIELDS)
    for model in queryset:
        network_ports = model.network_ports if model.network_ports else []
        try:
            np_name_1 = network_ports[0]
        except IndexError:
            np_name_1 = ''
        try:
            np_name_2 = network_ports[1]
        except IndexError:
            np_name_2 = ''
        try:
            np_name_3 = network_ports[2]
        except IndexError:
            np_name_3 = ''
        try:
            np_name_4 = network_ports[3]
        except IndexError:
            np_name_4 = ''
        # np_name_1 = ''
        # np_name_2 = ''
        # np_name_3 = ''
        # np_name_4 = ''
        # for i in range(len(network_ports)):
        #     exec("np_name_{} = network_ports[i]".format(i+1))
        writer.writerow([model.mount_type, model.vendor, model.model_number, model.height,
                         model.display_color, model.network_ports_num, model.power_ports,
                         model.cpu, model.memory, model.storage, model.comment, \
                         np_name_1, np_name_2, np_name_3, np_name_4])
    return response


def export_assets(queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="assets.csv"'

    writer = csv.writer(response)
    writer.writerow(ASSET_EXPORT_FIELDS)
    for asset in queryset:
        try:
            asset = asset.asset
        except AllAssets.DoesNotExist:
            asset = asset.bladeserver
        try:
            owner_name = asset.owner.username
        except AttributeError:
            owner_name = None

        power_port_connection_1=''
        power_port_connection_2=''
        if asset.model.mount_type != 'blade' and not asset.datacenter.is_offline:
            # print(asset.model.mount_type)
            # print(asset.datacenter.is_offline)
            # print(asset.pk)
            pp1=asset.power_port_set.first()
            if asset.power_port_set.count() >= 2:
                pp2=asset.power_port_set.all()[1]
            power_port_connection_1=''
            power_port_connection_2=''
            if pp1 and pp1.pdu:
                if pp1 and pp1.pdu == asset.rack.pdu_l:
                    power_port_connection_1 = 'L'+str(pp1.port_number)
                elif pp1 and pp1.pdu == asset.rack.pdu_r:
                    power_port_connection_1 = 'R'+str(pp1.port_number)
            if pp2 and pp2.pdu:
                if pp2 and pp2.pdu == asset.rack.pdu_l:
                    power_port_connection_2 = 'L'+str(pp2.port_number)
                elif pp2 and pp2.pdu == asset.rack.pdu_r:
                    power_port_connection_2 = 'R'+str(pp2.port_number)

        dc = ''
        if asset.datacenter and not asset.datacenter.is_offline:
            dc = asset.datacenter.abbreviation
        os = ''
        if asset.datacenter and asset.datacenter.is_offline:
            os = asset.datacenter.abbreviation
        rack_num = ''
        rack_u = ''
        chass_num = ''
        chass_slot = ''
        if asset.model.mount_type == 'blade':
            chass_num = asset.location.asset_number
            chass_slot = asset.slot_number
        elif not asset.datacenter.is_offline:
            rack_num = asset.rack.rack_number
            rack_u = asset.rack_u
        writer.writerow([asset.asset_number, asset.hostname, dc, os, \
                         rack_num, rack_u, chass_num, chass_slot, asset.model.vendor, asset.model.model_number, \
                         owner_name, asset.comment, power_port_connection_1, power_port_connection_2, \
                         asset.ovr_color, asset.ovr_cpu, asset.ovr_memory, asset.ovr_storage])
    return response

def export_network_ports(queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="network_ports.csv"'

    writer = csv.writer(response)
    writer.writerow(NETWORK_PORT_EXPORT_FIELDS)

    for asset in queryset:
        try:
            asset = asset.asset
        except AllAssets.DoesNotExist:
            continue
        nps = asset.network_port_set.all()
        for np in nps:
            dest_hostname = np.connection.asset.hostname if np.connection else ''
            dest_port = np.connection.name if np.connection else ''
            writer.writerow([asset.hostname, np.name, np.mac, dest_hostname, dest_port])
    return response
