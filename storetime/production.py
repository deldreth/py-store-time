from settings import *

import os
import dj_database_url

SITE_ID = 4

DATABASES['default'] = dj_database_url.config()

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

DEBUG = True

ALLOWED_HOSTS = ['storetime.herokuapp.com']

ADMINS = (('Devin', 'devin@jbanetwork.com'),)
