from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Queue, History


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


class QueueSerializer (serializers.ModelSerializer):
    user = UserSerializer()
    last_date = serializers.DateTimeField(format=None)

    class Meta:
        model = Queue
        fields = ('id', 'user', 'last_date')


class HistorySerializer (serializers.ModelSerializer):

    class Meta:
        model = History
        fields = ('id', 'user', 'date', 'amount')
