from django_filters import rest_framework as filters
from django.contrib.auth.models import User


class UserFilter(filters.FilterSet):
    username = filters.CharFilter(field_name='username', lookup_expr='icontains')
    first_name = filters.CharFilter(field_name='first_name', lookup_expr='icontains')
    last_name = filters.CharFilter(field_name='last_name', lookup_expr='icontains')
    email = filters.CharFilter(field_name='email', lookup_expr='icontains')

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']
