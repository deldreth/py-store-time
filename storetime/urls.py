"""storetime URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from app import views

from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'queue', views.QueueViewSet, base_name='queue')
router.register(r'history', views.HistoryViewSet, base_name='history')
router.register(r'shart', views.ShartViewSet, base_name='shart')
router.register(r'stats', views.StatsViewSet, base_name='statistics')
router.register(r'settings', views.SettingsViewSet, base_name='settings')

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^$', views.index),
    url(r'^api/', include(router.urls, namespace='api')),
    url(r'^docs/', include('rest_framework_swagger.urls')),
]
