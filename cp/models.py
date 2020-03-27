from ass_man.models import Model, Asset, Network_Port, Rack, Datacenter, Power_Port, Asset_Number, PDU
from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class ChangePlan(models.Model):
    name = models.CharField(max_length=64, blank=False, null=False)
    owner = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)


class AssetCP(Asset):
    id_ref = models.PositiveIntegerField(blank=True)
    cp = models.ForeignKey(ChangePlan, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.hostname or ''


class PPCP(Power_Port):
    id_ref = models.PositiveIntegerField(blank=True)
    asset_cp_id = models.ForeignKey(Asset, blank=True, null=True, on_delete=models.SET_NULL)
    cp = models.ForeignKey(ChangePlan, blank=True, null=True, on_delete=models.CASCADE)


class NPCP(Network_Port):
    id_ref = models.PositiveIntegerField(blank=True)
    conn_cp_id = models.PositiveIntegerField(blank=True)
    asset_cp_id = models.ForeignKey(Asset, blank=True, null=True, on_delete=models.SET_NULL)
    cp = models.ForeignKey(ChangePlan, blank=True, null=True, on_delete=models.CASCADE)







