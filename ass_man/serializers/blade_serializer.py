from ass_man.models import BladeServer, Asset_Number, Asset
from rest_framework import serializers
from ass_man.serializers.asset_serializers import ChassisSerializer
from ass_man.serializers.model_serializers import ModelAssetSerializer
from usr_man.serializers import UserOfAssetSerializer
from ass_man.serializers.datacenter_serializers import DatacenterSerializer
import re

class BladeServerSerializer(serializers.ModelSerializer):
    model = ModelAssetSerializer()
    owner = UserOfAssetSerializer()
    datacenter = DatacenterSerializer()
    location = ChassisSerializer()
    class Meta:
        model = BladeServer
        fields = ['id', 'model', 'hostname', 'datacenter', 'location', 'slot_number', 'owner', 'comment',
                  'ovr_color', 'ovr_storage', 'ovr_cpu', 'over_memory', 'asset_number']

class BladeCreateSerializer(serializers.ModelSerializer):
    def check_asset_number(self, validated_data):
        try:
            validated_data['asset_number']
            bladeserver= True
            asset = True
            try:
                BladeServer.objects.get(asset_number=validated_data['asset_number'])
            except BladeServer.DoesNotExist:
                bladeserver = False
            try:
                Asset.objects.get(asset_number=validated_data['asset_number'])
            except Asset.DoesNotExist:
                asset = False
            if not bladeserver and not asset:
                bladeserver= True
                asset = True
                num = Asset_Number.objects.all().first()
                if not num:
                    num = Asset_Number.objects.create(next_avail=100000)
                # try:
                #     num = Asset_Number.objects.all().first() #Asset_Number.objects.get(pk=1)
                # except Asset_Number.DoesNotExist:
                #     num = Asset_Number.objects.create(next_avail=100000)
                if validated_data['asset_number'] == num.next_avail:
                    curr = num.next_avail
                    while True:
                        bladeserver= True
                        asset = True
                        try:
                            BladeServer.objects.get(asset_number=curr)
                        except BladeServer.DoesNotExist:
                            bladerserver = False
                        try:
                            Asset.objects.get(asset_number=curr)
                        except Asset.DoesNotExist:
                            asset = False
                        curr += 1
                        print(bladeserver)
                        print(asset)
                        print(curr)
                        if not asset and not bladeserver:
                            num.next_avail = curr
                            num.save()
                            break
                return validated_data
            raise serializers.ValidationError(
                "Asset Number: {} is already taken.".format(validated_data['asset_number'])
            )
        except KeyError:
            num = Asset_Number.objects.all().first()
            if not num:
                num = Asset_Number.objects.create(next_avail=100000)
            # try:
            #     num = Asset_Number.objects.all().first() #get(pk=1)
            # except Asset_Number.DoesNotExist:
            #     num = Asset_Number.objects.create(next_avail=100000)

            curr = num.next_avail
            bladeserver= True
            asset = True
            while True:
                try:
                    BladeServer.objects.get(asset_number=curr)
                except BladeServer.DoesNotExist:
                    bladerserver = False
                try:
                    Asset.objects.get(asset_number=curr)
                except Asset.DoesNotExist:
                    asset = False
                curr += 1
                if asset or bladeserver:
                    num.next_avail = curr
                    num.save()
                    break
            validated_data['asset_number'] = curr
            return validated_data
    def validate_hostname(self, value):
        print("CALLED VALIDATE HOSTNAME")
        if not value:
            return value
        if not re.match('^(?![0-9]+$)(?!-)[a-zA-Z0-9-]{,63}(?<!-)$', value):
            raise serializers.ValidationError(
                '{} is not an valid hostname. Please ensure this value is a valid hostname as per RFC 1034.'.format(
                    value.__str__())
            )
        if value:
            try:
                Asset.objects.all().get(hostname=value)
                raise serializers.ValidationError(
                    '{} is not a unique hostname. Please ensure this value is unique across all assets.'.format(
                        value.__str__())
                )
                BladeServer.objects.all().get(hostname=value)
                raise serializers.ValidationError(
                    '{} is not a unique hostname. Please ensure this value is unique across all assets.'.format(
                        value.__str__())
                )
            except (Asset.DoesNotExist, BladeServer.DoesNotExist):
                pass
        return value

    def check_chassis_slot(self, validated_data):
        chassis = validated_data['location']
        for blade in chassis.bladeserver_set.all():
            if blade.slot_number == validated_data['slot_number']:
                raise serializers.ValidationError(
                "Chassis slot number {} in chassis {} is already occupied by blade {}".format(
                validated_data['slot_number'], chassis.hostname, blade.hostname
                )
                )
    def create(self, validated_data):
        self.check_chassis_slot(validated_data)
        validated_data = self.check_asset_number(validated_data)
        return super().create(validated_data)
    class Meta:
        model = BladeServer
        fields = ['id', 'model', 'hostname', 'datacenter', 'location', 'slot_number', 'owner',
                  'ovr_color', 'ovr_storage', 'ovr_cpu', 'over_memory', 'comment', 'asset_number']
