import csv
from django.http import HttpResponse

MODEL_EXPORT_FIELDS = ['vendor', 'model_number', 'height', 'display_color',\
 'ethernet_ports', 'power_ports', 'cpu', 'memory', 'storage', 'comment']
INSTANCE_EXPORT_FIELDS = ['hostname', 'rack', 'rack_position', 'vendor', \
'model_number', 'owner', 'comment']

def export_models(queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="models.csv"'

    writer = csv.writer(response)
    writer.writerow(MODEL_EXPORT_FIELDS)
    for model in queryset:
        writer.writerow([model.vendor, model.model_number, model.height,
                         model.display_color, model.ethernet_ports, model.power_ports,
                         model.cpu, model.memory, model.storage, model.comment])
    return response

def export_instances(queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="models.csv"'

    writer = csv.writer(response)
    writer.writerow(INSTANCE_EXPORT_FIELDS)
    for instance in queryset:
        try:
            owner_name = instance.owner.username
        except AttributeError:
            owner_name = None
        writer.writerow([instance.hostname, instance.rack.rack_number, instance.rack_u, instance.model.vendor,
                         instance.model.model_number, owner_name, instance.comment])
    return response
