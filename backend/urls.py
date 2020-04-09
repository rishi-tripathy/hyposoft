"""backend URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from django.views.generic import TemplateView
from usr_man import views as user_views
from ass_man.views import ReportView, ModelViewSet, AssetViewSet, RackViewSet, DatacenterViewSet, DecommissionedViewSet, PermissionViewSet, AllAssetViewSet, BladeViewSet
from log import views as log_views
from cp.views import ChangePlanViewSet, AssetCPViewSet, NPCPViewSet, PPCPViewSet

router = routers.DefaultRouter()  # add this
router.register(r'users', user_views.UserViewSet)
router.register(r'models', ModelViewSet.ModelViewSet)
router.register(r'assets', AssetViewSet.AssetViewSet)
router.register(r'racks', RackViewSet.RackViewSet)
router.register(r'datacenters', DatacenterViewSet.DatacenterViewSet)
router.register(r'log', log_views.LogViewSet)
router.register(r'cp', ChangePlanViewSet)
router.register(r'cpAsset', AssetCPViewSet)
router.register(r'cpnp', NPCPViewSet)
router.register(r'cppp', PPCPViewSet)
router.register(r'decommissioned', DecommissionedViewSet.DecommissionedViewSet)
router.register(r'all_assets', AllAssetViewSet.AllAssetViewSet)
router.register(r'blades', BladeViewSet.BladeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/', include(router.urls)),  # add this
    path('report/', ReportView.report),
    path('update-permissions/', PermissionViewSet.update_permissions),
    path('all-permissions/', PermissionViewSet.all_permissions),
    path('user-permissions/', PermissionViewSet.user_permissions),
    # path('log/', log_views.LogViewSet.log),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
