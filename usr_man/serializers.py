from django.contrib.auth.models import User
from rest_framework import serializers

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User


# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'url', 'username', 'email', 'groups']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    first_name = serializers.CharField(
        required=True,
        max_length=32,
    )
    last_name = serializers.CharField(
        required=False,
        allow_blank=True
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(min_length=6, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
                                        validated_data['password'])
        if self.validated_data['first_name']:
            user.first_name = self.validated_data['first_name']

        if self.validated_data['last_name']:
            user.last_name = self.validated_data['last_name']

        user.save()
        return user

    def create_netid(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
                                        validated_data['password'])
        if self.validated_data['first_name']:
            user.first_name = self.validated_data['first_name']

        if self.validated_data['last_name']:
            user.last_name = self.validated_data['last_name']

        user.set_unusable_password()

        user.save()
        return user

    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'first_name', 'last_name', 'password')


class UserOfAssetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'url', 'id', 'username')


class UserOfLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class UserFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'first_name', 'last_name', 'is_superuser')
