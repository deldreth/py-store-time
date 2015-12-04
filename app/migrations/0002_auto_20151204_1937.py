# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='history',
            options={'ordering': ['-date']},
        ),
        migrations.AlterModelOptions(
            name='queue',
            options={'ordering': ['last_date']},
        ),
        migrations.AddField(
            model_name='history',
            name='amount',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='queue',
            name='last_date',
            field=models.DateTimeField(default=datetime.datetime.today),
        ),
    ]
