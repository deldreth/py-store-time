from django.shortcuts import render
from django.db.models import Sum, Avg
from django.db import connection
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication)
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import list_route
from rest_framework.authtoken.models import Token

from .models import Queue, History, Shart
from .serializers import (
    QueueSerializer,
    HistorySerializer,
    StatsSerializer,
    ShartSerializer,
    ShartStatsSerialiser,
    SettingsSerializer)
from .services import dictfetchall

from datetime import datetime
from random import randint

import requests


class QueueViewSet (viewsets.ModelViewSet):

    """ Queue Resource """

    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        object, created = Queue.objects.get_or_create(user=request.user)

        if created:
            return Response(QueueSerializer(object).data,
                            status.HTTP_201_CREATED)

        return Response({}, status.HTTP_200_OK)


class HistoryViewSet (viewsets.ModelViewSet):

    """ History Resource """

    queryset = History.objects.all()
    serializer_class = HistorySerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]


class ShartViewSet (viewsets.ModelViewSet):
    queryset = Shart.objects.all()
    serializer_class = ShartSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        created = Shart.objects.create(user=request.user)

        if created:
            options = [
                'Dang. {0} just let one rip.',
                'There may be something wrong with {0}\'s insides.',
                'Someone open a window. {0} is fumigating.',
                '{0} may have just shat themselves.',
                '{0} has apparently never heard of Beano.',
                'Noxious gas alert in the vicinity of {0}.'
            ]

            text = options[randint(0, len(options) - 1)].format(created.user.username)
            r = requests.post('https://hooks.slack.com/services/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',
                              json={'text': text})
            return Response(ShartSerializer(created).data,
                            status.HTTP_201_CREATED)

        return Response({}, status.HTTP_200_OK)

    @list_route(methods=['GET'])
    def stats(self, request):
        users = User.objects.all()

        cursor = connection.cursor()
        cursor.execute('SELECT EXTRACT(hour FROM date AT TIME ZONE \'EST\') AS hour, \
                        COUNT(user_id), user_id \
                        FROM app_shart \
                        GROUP BY hour, user_id')
        user_hours = dictfetchall(cursor)

        hours = []
        labels = ['Hour']
        for user in user_hours:
            username = users.get(pk=user['user_id']).username
            if username not in labels:
                labels.append(username)

        for hour in range(1, 24):
            for_user_hours = [0] * len(labels)
            hour_label = datetime.strptime(str(hour) + ':00', "%H:%M")
            for_user_hours[0] = hour_label.strftime("%-I%p")

            for user in user_hours:
                username = users.get(pk=user['user_id']).username
                if hour == user['hour']:
                    for_user_hours[labels.index(username)] = int(user['count'])

            hours.append(for_user_hours)
        hours.insert(0, labels)

        cursor.execute('SELECT EXTRACT(DOW FROM date AT TIME ZONE \'EST\') AS day, \
                       COUNT(user_id), user_id \
                       FROM app_shart \
                       GROUP BY day, user_id')
        user_days = dictfetchall(cursor)

        days = []
        labels = ['Day']
        dow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
               'Friday', 'Saturday']
        for user in user_hours:
            username = users.get(pk=user['user_id']).username
            if username not in labels:
                labels.append(username)

        for day in range(0, 7):
            for_user_days = [0] * len(labels)
            for_user_days[0] = dow[day]

            for user in user_days:
                username = users.get(pk=user['user_id']).username
                if day == user['day']:
                    for_user_days[labels.index(username)] = int(user['count'])

            days.append(for_user_days)
        days.insert(0, labels)

        stats_serializer = ShartStatsSerialiser(data={
            'by_hour': hours,
            'by_day': days
            })

        if stats_serializer.is_valid():
            return Response(stats_serializer.data, status.HTTP_200_OK)

        return Response(stats_serializer.errors,
                        status.HTTP_500_INTERNAL_SERVER_ERROR)


class StatsViewSet (viewsets.ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @list_route(methods=['GET'])
    def aggregates(self, request):
        history = History.objects.values('user')
        history_sums = history.annotate(Sum('amount')).order_by('-amount__sum')

        for sums in history_sums:
            user = User.objects.get(pk=sums['user'])
            sums['user'] = user.username
            sums['user_id'] = user.id

        history_avgs = history.annotate(Avg('amount')).order_by('-amount__avg')

        for avgs in history_avgs:
            user = User.objects.get(pk=avgs['user'])
            avgs['user'] = user.username
            avgs['user_id'] = user.id

        cursor = connection.cursor()
        cursor.execute('SELECT to_char(date AT TIME ZONE \'EST\', \'YYYY/MM\') AS month_year, \
                       SUM(amount) as total \
                       FROM app_history \
                       GROUP BY month_year \
                       ORDER BY month_year ASC')
        by_month_year = dictfetchall(cursor)

        cursor.execute('SELECT to_char(date AT TIME ZONE \'EST\', \'YYYY/MM\') AS month_year, \
                       SUM(amount) as total, user_id \
                       FROM app_history \
                       GROUP BY month_year, user_id \
                       ORDER BY month_year ASC')
        by_month_year_user = dictfetchall(cursor)

        users = User.objects.all()
        labels = ['Year/Month']
        for user in users:
            labels.append(user.username)

        by_month_year_table = []
        by_month_year_table.append(labels)
        for user_spending in by_month_year_user:
            username = users.get(pk=user_spending['user_id']).username
            exists = False

            for search in by_month_year_table:
                if search[0] == user_spending['month_year']:
                    exists = True
                    search[labels.index(username)] = user_spending['total']

            if not exists:
                for_user_spending = [0] * len(labels)
                for_user_spending[0] = user_spending['month_year']
                by_month_year_table.append(for_user_spending)

        stats_serializer = StatsSerializer(data={
            'history_sums': history_sums,
            'history_avgs': history_avgs,
            'by_month_sums': by_month_year,
            'by_month_user_sums': by_month_year_table
            })

        if stats_serializer.is_valid():
            return Response(stats_serializer.data, status.HTTP_200_OK)

        return Response(stats_serializer.errors,
                        status.HTTP_500_INTERNAL_SERVER_ERROR)


class SettingsViewSet (viewsets.ViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Get an authed user's settings
        ---
        serializer: SettingsSerializer
        """
        token = Token.objects.get(user=request.user)
        settings_serializer = SettingsSerializer(data={
            'token': token.key
            })
        if settings_serializer.is_valid():
            return Response(settings_serializer.data, status.HTTP_200_OK)


def index(request):
    return render(request, 'app/index.html')
