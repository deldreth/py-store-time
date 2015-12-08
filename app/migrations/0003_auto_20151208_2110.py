# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0002_auto_20151204_1937'),
    ]

    operations = [
        migrations.CreateModel(
            name='Shart',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(default=datetime.datetime.today)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-date'],
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='history',
            name='date',
            field=models.DateTimeField(default=datetime.datetime.today),
        ),
    ]
