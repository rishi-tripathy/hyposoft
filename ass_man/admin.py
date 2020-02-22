from django.contrib import admin
from .models import Model, Asset, Rack, Network_Port, Power_Port, PDU, Datacenter, Asset_Number # add this


# Register your models here.


class AssAdmin(admin.ModelAdmin):  # add this
    list_display = ['id']  # add this


# Register your models here.
admin.site.register(Model, AssAdmin)  # add this
admin.site.register(Asset, AssAdmin)
admin.site.register(Rack, AssAdmin)
admin.site.register(Network_Port, AssAdmin)
admin.site.register(Power_Port, AssAdmin)
admin.site.register(PDU, AssAdmin)
admin.site.register(Datacenter, AssAdmin)
admin.site.register(Asset_Number, AssAdmin)
