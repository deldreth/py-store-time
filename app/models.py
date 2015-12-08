from django.db import models
from django.contrib.auth.models import User

import datetime


class UserTimestamp (models.Model):
    user = models.ForeignKey(User)
    date = models.DateTimeField(default=datetime.datetime.today)

    class Meta:
        abstract = True
        ordering = ['-date']


class Queue (models.Model):
    user = models.OneToOneField(User, unique=True)
    last_date = models.DateTimeField(default=datetime.datetime.today)

    class Meta:
        ordering = ['last_date']


class History (UserTimestamp):
    amount = models.IntegerField()


class Shart (UserTimestamp):
    @property
    def total(self):
        total = self.objects.filter(user=self.user).count()
        return total
