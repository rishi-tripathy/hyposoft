from django.contrib import admin
from .models import Model, Instance, Rack  # add this

# Register your models here.


class AssAdmin(admin.ModelAdmin):  # add this
     list_display = ['id']  # add this


# Register your models here.
admin.site.register(Model, AssAdmin)  # add this
admin.site.register(Instance, AssAdmin)
admin.site.register(Rack, AssAdmin)
