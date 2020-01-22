from django.contrib import admin
from django.contrib.auth.models import User  # add this

# Register your models here.


class UsrAdmin(admin.ModelAdmin):  # add this
    list_display = ['id', 'username']  # add this


# Register your models here.
