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

from datetime import datetime
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
        cursor.execute('SELECT EXTRACT(hour FROM date AT TIME ZONE \'EST\') AS hour, \
                        COUNT(user_id), user_id \
                        FROM app_shart \
                        GROUP BY hour, user_id')
        user_hours = self.dictfetchall(cursor)

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
        user_days = self.dictfetchall(cursor)

        days = []
        labels = ['Day']
        dow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
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
