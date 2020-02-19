import csv
from django.http import HttpResponse

MODEL_EXPORT_FIELDS = ['vendor', 'model_number', 'height', 'display_color', \
                       'network_ports', 'power_ports', 'cpu', 'memory', 'storage',\
                        'comment','network_port_name_1', 'network_port_name_2,',\
                        'network_port_name_3', 'network_port_name_4']
ASSET_EXPORT_FIELDS = ['hostname', 'rack', 'rack_position', 'vendor', \
                       'model_number', 'owner', 'comment']


def export_models(queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="models.csv"'

    writer = csv.writer(response)
    writer.writerow(MODEL_EXPORT_FIELDS)
    for model in queryset:
        network_ports = model.network_ports
        np_name_1 = ''
        np_name_2 = ''
        np_name_3 = ''
        np_name_4 = ''
        for i in range(len(network_ports)):
            exec("np{} = 'test'".format(i))
        writer.writerow([model.vendor, model.model_number, model.height,
                         model.display_color, model.network_ports, model.power_ports,
                         model.cpu, model.memory, model.storage, model.comment, \
                         np_name_1, np_name_2, np_name_3, np_name_4])
    return response


def export_assets(queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="models.csv"'

    writer = csv.writer(response)
    writer.writerow(ASSET_EXPORT_FIELDS)
    for asset in queryset:
        try:
            owner_name = asset.owner.username
        except AttributeError:
            owner_name = None
        writer.writerow([asset.hostname, asset.rack.rack_number, asset.rack_u, asset.model.vendor,
                         asset.model.model_number, owner_name, asset.comment])
    return response
