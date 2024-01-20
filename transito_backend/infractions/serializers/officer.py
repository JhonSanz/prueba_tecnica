from rest_framework import serializers
from infractions.models import Officer


class OfficerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Officer
		fields = ['id', 'name', 'identification']


class OfficerCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Officer
		fields = ['name', 'identification']
