from rest_framework import serializers
from infractions.models import Vehicle
from infractions.serializers.brand import BrandSerializer
from infractions.serializers.person import PersonSerializer


class VehicleSerializer(serializers.ModelSerializer):
	brand = BrandSerializer()
	infractor = PersonSerializer()
	class Meta:
		model = Vehicle
		fields = ['id', 'brand', 'license_plate', 'color', 'infractor']


class VehicleCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Vehicle
		fields = ['id', 'brand', 'license_plate', 'color', 'infractor']
