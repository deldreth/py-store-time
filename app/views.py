from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication

from .models import Queue, History
from .serializers import QueueSerializer, HistorySerializer


class QueueViewSet (viewsets.ModelViewSet):
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    authentication_classes = [SessionAuthentication]

    def create(self, request):
        object, created = Queue.objects.get_or_create(user=request.user)

        if created:
            return Response(QueueSerializer(object).data, status.HTTP_201_CREATED)

        return Response({}, status.HTTP_200_OK)


class HistoryViewSet (viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    authentication_classes = [SessionAuthentication]


def index(request):
    return render(request, 'app/index.html')
