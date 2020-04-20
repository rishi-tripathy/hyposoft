from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db.models.fields import DateTimeField
from django.core.validators import RegexValidator
# Create your models here.

class Asset_Number(models.Model):
    next_avail = models.PositiveIntegerField()


class Model(models.Model):
    vendor = models.CharField(max_length=50)
    model_number = models.CharField(max_length=50)
    height = models.PositiveIntegerField()
    display_color = models.CharField(max_length=6, default='777777')
    network_ports_num = models.PositiveIntegerField(blank=True, null=True)
    network_ports = ArrayField(models.CharField(max_length=10, default='e1'), null=True)
    power_ports = models.PositiveIntegerField(blank=True, null=True)
    cpu = models.CharField(blank=True, max_length=50)
    memory = models.PositiveIntegerField(blank=True, null=True)
    storage = models.CharField(blank=True, max_length=50)
    comment = models.TextField(blank=True)
    mount_type = models.CharField(max_length=20)

    def __str__(self):
        return (self.vendor + ' ' + self.model_number) or ''

class Decommissioned(models.Model):
    username = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now=True)
    asset_state = JSONField(default=dict)
    network_graph = JSONField(default=dict)

class AllAssets(models.Model):
    pass

class Asset(AllAssets):
    model = models.ForeignKey(Model, on_delete=models.PROTECT)
    hostname = models.CharField(max_length=64, blank=True, null=True)
    datacenter = models.ForeignKey('Datacenter', on_delete=models.PROTECT)
    rack = models.ForeignKey('Rack', on_delete=models.PROTECT, blank=True, null=True)
    rack_u = models.PositiveIntegerField(blank=True, null=True)
    owner = models.ForeignKey(User, blank=True, null=True, on_delete=models.PROTECT)
    comment = models.TextField(blank=True)
    # Upgrades
    ovr_color = models.CharField(blank=True, null=True, max_length=6)
    ovr_cpu = models.CharField(blank=True, null=True, max_length=50)
    ovr_memory = models.PositiveIntegerField(blank=True, null=True)
    ovr_storage = models.CharField(blank=True, null=True, max_length=50)

    asset_number = models.PositiveIntegerField(blank=True, default=100000, \
    validators=[RegexValidator(r'^[0-9]{6}$', 'Number must be 6 digits', 'Invalid Number')])

    def __str__(self):
        return self.hostname or ''

class BladeServer(AllAssets):
    model = models.ForeignKey(Model, on_delete=models.PROTECT)
    hostname = models.CharField(max_length=64, blank=True, null=True)
    datacenter = models.ForeignKey('Datacenter', on_delete=models.PROTECT, blank=True, null=True)
    location = models.ForeignKey('Asset', on_delete=models.PROTECT, blank=True, null=True)
    slot_number = models.PositiveIntegerField(blank=True, null=True)
    owner = models.ForeignKey(User, blank=True, null=True, on_delete=models.PROTECT)
    comment = models.TextField(blank=True)
    # Upgrades
    ovr_color = models.CharField(blank=True, null=True, max_length=6)
    ovr_cpu = models.CharField(blank=True, null=True, max_length=50)
    ovr_memory = models.PositiveIntegerField(blank=True, null=True)
    ovr_storage = models.CharField(blank=True, null=True, max_length=50)

    asset_number = models.PositiveIntegerField(blank=True, default=100000, \
    validators=[RegexValidator(r'^[0-9]{6}$', 'Number must be 6 digits', 'Invalid Number')])

    def __str__(self):
        return self.hostname or ''


class Network_Port(models.Model):
    name = models.CharField(max_length=15, blank=True, default='mgmt')
    mac = models.CharField(max_length=17, blank=True, null=True)
    connection = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    asset = models.ForeignKey('Asset', on_delete=models.CASCADE, null=True)


class Power_Port(models.Model):
    name = models.CharField(max_length=10, blank=True, null=True)
    pdu = models.ForeignKey('PDU', on_delete=models.SET_NULL, null=True)
    port_number = models.PositiveIntegerField(null=True)
    asset = models.ForeignKey('Asset', on_delete=models.CASCADE, null=True)


class PDU(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    rack = models.ForeignKey('Rack', on_delete=models.CASCADE, null=True)


class Datacenter(models.Model):
    abbreviation = models.CharField(max_length=6)
    name = models.CharField(max_length=50)
    is_offline = models.BooleanField(default=False)

    def __str__(self):
        return self.abbreviation or ''


class Rack(models.Model):
    rack_number = models.CharField(max_length=5)
    pdu_l = models.ForeignKey('PDU', on_delete=models.CASCADE, related_name='pdu_l', null=True)
    pdu_r = models.ForeignKey('PDU', on_delete=models.CASCADE, related_name='pdu_r', null=True)
    datacenter = models.ForeignKey('Datacenter', on_delete=models.PROTECT)
    u1 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset1')
    u2 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset2')
    u3 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset3')
    u4 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset4')
    u5 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset5')
    u6 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset6')
    u7 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset7')
    u8 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset8')
    u9 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset9')
    u10 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset10')
    u11 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset11')
    u12 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset12')
    u13 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset13')
    u14 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset14')
    u15 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset15')
    u16 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset16')
    u17 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset17')
    u18 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset18')
    u19 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset19')
    u20 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset20')
    u21 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset21')
    u22 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset22')
    u23 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset23')
    u24 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset24')
    u25 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset25')
    u26 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset26')
    u27 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset27')
    u28 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset28')
    u29 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset29')
    u30 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset30')
    u31 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset31')
    u32 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset32')
    u33 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset33')
    u34 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset34')
    u35 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset35')
    u36 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset36')
    u37 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset37')
    u38 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset38')
    u39 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset39')
    u40 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset40')
    u41 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset41')
    u42 = models.ForeignKey(Asset, on_delete=models.SET_NULL, blank=True, null=True, related_name='Asset42')

    def __str__(self):
        return self.rack_number or ''

class Permission(models.Model):
    name = models.CharField(max_length=50)
    datacenter = models.ForeignKey(Datacenter, on_delete=models.CASCADE, blank=True, null=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
