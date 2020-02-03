from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Model(models.Model):
    vendor = models.CharField(max_length=50)
    model_number = models.CharField(max_length=50)
    height = models.PositiveIntegerField()
    display_color = models.CharField(max_length=6, default='777777')
    ethernet_ports = models.PositiveIntegerField(blank=True, null=True)
    power_ports = models.PositiveIntegerField(blank=True, null=True)
    cpu = models.CharField(blank=True, max_length=50)
    memory = models.PositiveIntegerField(blank=True, null=True)
    storage = models.CharField(blank=True, max_length=50)
    comment = models.TextField(blank=True)

    def __str__(self):
        return (self.vendor + ' ' + self.model_number) or ''


class Instance(models.Model):
    model = models.ForeignKey(Model, on_delete=models.PROTECT)
    hostname = models.CharField(max_length=64)
    rack = models.ForeignKey('Rack', on_delete=models.PROTECT)
    rack_u = models.PositiveIntegerField(blank=False)
    owner = models.ForeignKey(User, blank=True, null=True, on_delete=models.PROTECT)
    comment = models.TextField(blank=True)

    def __str__(self):
        return self.hostname or ''


class Rack(models.Model):
    rack_number = models.CharField(max_length=5)
    u1 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance1')
    u2 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance2')
    u3 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance3')
    u4 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance4')
    u5 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance5')
    u6 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance6')
    u7 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance7')
    u8 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance8')
    u9 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance9')
    u10 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance10')
    u11 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance11')
    u12 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance12')
    u13 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance13')
    u14 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance14')
    u15 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance15')
    u16 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance16')
    u17 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance17')
    u18 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance18')
    u19 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance19')
    u20 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance20')
    u21 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance21')
    u22 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance22')
    u23 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance23')
    u24 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance24')
    u25 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance25')
    u26 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance26')
    u27 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance27')
    u28 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance28')
    u29 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance29')
    u30 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance30')
    u31 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance31')
    u32 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance32')
    u33 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance33')
    u34 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance34')
    u35 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance35')
    u36 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance36')
    u37 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance37')
    u38 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance38')
    u39 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance39')
    u40 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance40')
    u41 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance41')
    u42 = models.ForeignKey(Instance, on_delete=models.SET_NULL, blank=True, null=True, related_name='instance42')

    def __str__(self):
        return self.rack_number or ''
