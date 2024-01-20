from rest_framework import serializers
from infractions.models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Vehicle
		fields = ['id', 'brand', 'license_plate', 'color', 'infractor']


class VehicleCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Vehicle
		fields = ['id', 'brand', 'license_plate', 'color', 'infractor']
