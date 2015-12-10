from django.shortcuts import render
from django.db.models import Sum, Avg, Count
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import list_route

from .models import Queue, History, Shart
from .serializers import (
    QueueSerializer, HistorySerializer, StatsSerializer, ShartSerializer, ShartStatsSerialiser)


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

    @list_route(methods=['GET'])
    def stats(self, request):
        users = User.objects.all()

        by_hours = {}

        by_hour = Shart.objects.all().extra(select={
            'hour': "EXTRACT(hour FROM date)"}).values('user', 'hour')

        for hour in by_hour:
            user = users.get(pk=hour['user'])
            hour = str(int(hour['hour']))

            if user not in by_hours:
                by_hours[user] = {}

            if hour in by_hours[user]:
                by_hours[user][hour] += 1
            else:
                by_hours[user][hour] = 1

        by_day = Shart.objects.all().extra(select={
            'day': "EXTRACT(DOW FROM date)"}).values('user', 'day')

        by_days = {}
        days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        for day in by_day:
            user = users.get(pk=day['user'])
            day = days_of_week[int(day['day'])]

            if user not in by_days:
                by_days[user] = {}

            if day in by_days[user]:
                by_days[user][day] += 1
            else:
                by_days[user][day] = 1

        stats_serializer = ShartStatsSerialiser(data={
            'by_hour': by_hours,
            'by_day': by_days
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
