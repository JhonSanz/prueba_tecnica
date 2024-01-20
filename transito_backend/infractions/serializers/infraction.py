from rest_framework import serializers
from infractions.models import Infraction


class InfractionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Infraction
		fields = ['id', 'officer', 'created_at', 'vehicle', 'comments']


class InfractionCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Infraction
		fields = ['id', 'officer', 'created_at', 'vehicle', 'comments']
