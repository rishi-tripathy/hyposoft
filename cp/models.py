from ass_man.models import Model, Asset, Network_Port, Rack, Datacenter, Power_Port, Asset_Number, PDU
from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class ChangePlan(models.Model):
    name = models.CharField(max_length=64, blank=False, null=False)
    owner = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    datacenter = models.ForeignKey(Datacenter, blank=True, null=True, on_delete=models.CASCADE)
    # ADD DATACENTER

    def __str__(self):
        return self.name or ''


class AssetCP(models.Model):
    model = models.ForeignKey(Model, on_delete=models.PROTECT)
    hostname = models.CharField(max_length=64, blank=True, null=True)
    datacenter = models.ForeignKey(Datacenter, on_delete=models.PROTECT, blank=True, null=True)
    rack = models.ForeignKey(Rack, on_delete=models.PROTECT)
    rack_u = models.PositiveIntegerField(blank=False)
    owner = models.ForeignKey(User, blank=True, null=True, on_delete=models.PROTECT)
    comment = models.TextField(blank=True)
    # asset_number = models.PositiveIntegerField(blank=True, default=100000)
    id_ref = models.PositiveIntegerField(blank=True, null=True)
    cp = models.ForeignKey(ChangePlan, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.hostname or ''


class PPCP(models.Model):
    name = models.CharField(max_length=10, blank=True, null=True)
    pdu = models.ForeignKey(PDU, on_delete=models.SET_NULL, null=True)
    port_number = models.PositiveIntegerField(null=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, null=True)
    id_ref = models.PositiveIntegerField(blank=True, null=True)
    asset_cp_id = models.ForeignKey(AssetCP, blank=True, null=True, on_delete=models.SET_NULL)
    # cp = models.ForeignKey(ChangePlan, blank=True, null=True, on_delete=models.CASCADE)


class NPCP(models.Model):
    name = models.CharField(max_length=15, blank=True, default='mgmt')
    mac = models.CharField(max_length=17, blank=True, null=True)
    connection = models.ForeignKey(Network_Port, on_delete=models.SET_NULL, null=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, null=True)
    id_ref = models.PositiveIntegerField(blank=True, null=True)
    conn_cp_id = models.ForeignKey('self', blank=True, null=True, on_delete=models.SET_NULL)
    asset_cp_id = models.ForeignKey(AssetCP, blank=True, null=True, on_delete=models.SET_NULL)
    # cp = models.ForeignKey(ChangePlan, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name or ''







