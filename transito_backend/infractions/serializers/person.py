from rest_framework import serializers
from infractions.models import Person


class PersonSerializer(serializers.ModelSerializer):
	class Meta:
		model = Person
		fields = ['vehicle', 'id', 'name', 'email']


class PersonCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Person
		fields = ['vehicle', 'id', 'name', 'email']
