from django.shortcuts import render
from django.db.models import Sum, Avg, Count
from django.db import connection
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import list_route

from .models import Queue, History, Shart
from .serializers import (
    QueueSerializer, HistorySerializer, StatsSerializer, ShartSerializer, ShartStatsSerialiser)

import datetime
import time


class QueueViewSet (viewsets.ModelViewSet):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    authentication_classes = [SessionAuthentication]

    def create(self, request):
        object, created = Queue.objects.get_or_create(user=request.user)

        if created:
            return Response(QueueSerializer(object).data,
                            status.HTTP_201_CREATED)

        return Response({}, status.HTTP_200_OK)


class HistoryViewSet (viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    authentication_classes = [SessionAuthentication]


class ShartViewSet (viewsets.ModelViewSet):
    queryset = Shart.objects.all()
    serializer_class = ShartSerializer
    authentication_classes = [SessionAuthentication]

    def create(self, request):
        created = Shart.objects.create(user=User.objects.get(
            pk=request.POST['user']))

        if created:
            return Response(ShartSerializer(created).data,
                            status.HTTP_201_CREATED)

        return Response({}, status.HTTP_200_OK)

    def dictfetchall(self, cursor):
        "Return all rows from a cursor as a dict"
        columns = [col[0] for col in cursor.description]
        return [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]

    @list_route(methods=['GET'])
    def stats(self, request):
        users = User.objects.all()

        cursor = connection.cursor()

        cursor.execute('SELECT to_char(date, \'YYYY-MM-DD HH24:00:00 TZ\' ) AS dates, \
                        COUNT(user_id), user_id \
                        FROM app_shart \
                        GROUP BY dates, user_id')
        by_hour = self.dictfetchall(cursor)

        by_hours = {}
        for hour in by_hour:
            dates = hour['dates']
            user = users.get(pk=hour['user_id']).username
            if dates not in by_hours:
                by_hours[dates] = {
                    'data': []
                }

            by_hours[dates]['data'].append({
                'user': user,
                'date': hour['dates'],
                'count': hour['count']
                })

        cursor.execute('SELECT EXTRACT(DOW FROM date) AS day, \
                        COUNT(user_id), user_id \
                        FROM app_shart \
                        GROUP BY user_id, day')
        by_day = self.dictfetchall(cursor)

        for i, day in enumerate(by_day):
            by_day[i]['user'] = users.get(pk=day['user_id']).username
            by_day[i]['day'] = int(day['day'])

        stats_serializer = ShartStatsSerialiser(data={
            'by_hour': by_hours,
            'by_day': by_day
            })

        if stats_serializer.is_valid():
            return Response(stats_serializer.data, status.HTTP_200_OK)

        return Response(stats_serializer.errors,
                        status.HTTP_500_INTERNAL_SERVER_ERROR)


class StatsViewSet (viewsets.ViewSet):
    authentication_classes = [SessionAuthentication]

    @list_route(methods=['GET'])
    def aggregates(self, request):
        history_sums = History.objects.values(
            'user').annotate(Sum('amount')).order_by('-amount__sum')

        for sums in history_sums:
            user = User.objects.get(pk=sums['user'])
            sums['user'] = user.username

        history_avgs = History.objects.values(
            'user').annotate(Avg('amount')).order_by('-amount__avg')

        for avgs in history_avgs:
            user = User.objects.get(pk=avgs['user'])
            avgs['user'] = user.username

        stats_serializer = StatsSerializer(data={
            'history_sums': history_sums,
            'history_avgs': history_avgs
            })

        if stats_serializer.is_valid():
            return Response(stats_serializer.data, status.HTTP_200_OK)

        return Response(stats_serializer.errors,
                        status.HTTP_500_INTERNAL_SERVER_ERROR)


def index(request):
    return render(request, 'app/index.html')
