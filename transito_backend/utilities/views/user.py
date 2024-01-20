from django.shortcuts import render
from rest_framework import viewsets
from utilities.models import CustomUser
from utilities.serializers.user import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
