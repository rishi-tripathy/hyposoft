from django.contrib import admin
from .models import Model, Asset, Rack  # add this


# Register your models here.


class AssAdmin(admin.ModelAdmin):  # add this
    list_display = ['id']  # add this


# Register your models here.
admin.site.register(Model, AssAdmin)  # add this
admin.site.register(Asset, AssAdmin)
admin.site.register(Rack, AssAdmin)
