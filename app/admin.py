from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import Queue, History


class HistoryResource(resources.ModelResource):

    class Meta:
        model = History
        fields = ('id', 'user', 'date', 'amount')


class HistoryAdmin(ImportExportModelAdmin):
    model = History
    resource_class = HistoryResource
    list_filter = ('user',)

    list_display = ('id', 'user', 'date', 'amount')

admin.site.register(Queue)
admin.site.register(History, HistoryAdmin)
