from django.db import models
from django.contrib.auth.models import User

import datetime
import hashlib


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

    @property
    def avatar(self):
        if self.user.email:
            return hashlib.md5(self.user.email).hexdigest()

        return None


class History (UserTimestamp):
    amount = models.IntegerField()


class Shart (UserTimestamp):
    @property
    def total(self):
        total = self.objects.filter(user=self.user).count()
        return total
