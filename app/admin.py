from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import Queue, History, Shart


class QueueAdmin (admin.ModelAdmin):
    list_display = ('user', 'last_date')


class HistoryResource(resources.ModelResource):

    class Meta:
        model = History
        fields = ('id', 'user', 'date', 'amount')


class HistoryAdmin(ImportExportModelAdmin):
    model = History
    resource_class = HistoryResource
    list_filter = ('user',)

    list_display = ('id', 'user', 'date', 'amount')


class ShartAdmin (admin.ModelAdmin):
    list_filter = ('user',)
    list_display = ('user', 'date')

admin.site.register(Queue, QueueAdmin)
admin.site.register(History, HistoryAdmin)
admin.site.register(Shart, ShartAdmin)
