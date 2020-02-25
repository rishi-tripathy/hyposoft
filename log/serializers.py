from easyaudit.models import CRUDEvent, RequestEvent, LoginEvent
from rest_framework import serializers
from usr_man.serializers import UserOfLogSerializer


class CRUDEventSerializer(serializers.ModelSerializer):
    user = UserOfLogSerializer()
    objectlog = serializers.SerializerMethodField()

    def get_obj_type(self, event):
        content_type_map = {
            "ass_man | model": "model",
            "ass_man | rack": "rack",
            "ass_man | asset": "asset",
            "ass_man | datacenter": "datacenter",
            "auth | user": "user",
        }
        return content_type_map.get(str(event.content_type))

    def get_action_type(self, event):
        action_type_map = {
            1: "Create",
            2: "Update",
            3: "Delete",
            4: "M2M_Change",
            5: "M2M_Change_reverse",
        }
        return action_type_map.get(event.event_type)

    def get_objectlog(self, event):
        ob_type = self.get_obj_type(event)
        ac_type = self.get_action_type(event)
        return {
            "object_type": ob_type,
            "object_id": event.object_id,
            "object_repr": event.object_repr,
            "action_type": ac_type
        }

    class Meta:
        model = CRUDEvent
        fields = ['objectlog', 'user', 'datetime']
