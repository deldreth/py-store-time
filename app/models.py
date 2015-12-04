from django.db import models
from django.contrib.auth.models import User

import datetime


class Queue (models.Model):
    user = models.OneToOneField(User, unique=True)
    last_date = models.DateTimeField(default=datetime.datetime.today)

    class Meta:
        ordering = ['last_date']

    @property
    def real_date(self):
        return self.last_date.strftime('%m/%d/%Y %I:%M %p')


class History (models.Model):
    user = models.ForeignKey(User)
    date = models.DateTimeField()

    class Meta:
        ordering = ['-date']

    @property
    def real_date(self):
        return self.date.strftime('%m/%d/%Y')

    @property
    def real_time(self):
        return self.date.strftime('%I:%M %p')
