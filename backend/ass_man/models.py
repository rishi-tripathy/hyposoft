from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Model(models.Model):
    vendor = models.CharField(max_length=50)
    model_number = models.CharField(max_length=5, null=True)
    height = models.PositiveIntegerField(null=True)
    display_color = models.CharField(max_length=50, default='yellow', blank=True)
    ethernet_ports = models.PositiveIntegerField(blank=True, null=True)
    power_ports = models.PositiveIntegerField(blank=True, null=True)
    cpu = models.CharField(blank=True, max_length=50)
    memory = models.PositiveIntegerField(blank=True, null=True)
    storage = models.CharField(blank=True, max_length=50)
    comment = models.TextField(null=True)

    def __str__(self):
        return self.vendor

class Instance(models.Model):
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    hostname = models.CharField(max_length=20)
    rack = models.CharField(max_length=4)
    rack_u = models.PositiveIntegerField(blank=False)
    owner = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    comment = models.TextField(null=True)

    def __str__(self):
        return self.hostname



class Asset(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()

    def __str__(self):
        return self.title
