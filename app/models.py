from django.db import models
from django.contrib.auth.models import User

import datetime


class Queue (models.Model):
    user = models.OneToOneField(User, unique=True)
    last_date = models.DateTimeField(default=datetime.datetime.today)

    class Meta:
        ordering = ['last_date']


class History (models.Model):
    user = models.ForeignKey(User)
    date = models.DateTimeField()
    amount = models.IntegerField()

    class Meta:
        ordering = ['-date']
