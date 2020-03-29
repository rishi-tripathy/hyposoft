from cp.models import ChangePlan, AssetCP, PPCP, NPCP
from django.contrib import admin

# Register your models here.
class CPAdmin(admin.ModelAdmin):  # add this
    list_display = ['id']  # add this


# Register your models here.
admin.site.register(ChangePlan, CPAdmin)  # add this
admin.site.register(AssetCP, CPAdmin)  # add this
admin.site.register(PPCP, CPAdmin)  # add this
admin.site.register(NPCP, CPAdmin)  # add this
