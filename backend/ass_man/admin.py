from django.contrib import admin
from .models import Asset  # add this

# Register your models here.


class AssAdmin(admin.ModelAdmin):  # add this
    list_display = ('title', 'description')  # add this


# Register your models here.
admin.site.register(Asset, AssAdmin)  # add this
