from rest_framework import serializers
from infractions.models import Infraction
from infractions.models import Vehicle
from infractions.serializers.officer import OfficerSerializer
from infractions.serializers.vehicle import VehicleSerializer


class InfractionSerializer(serializers.ModelSerializer):
    officer = OfficerSerializer()
    vehicle = VehicleSerializer()
    class Meta:
        model = Infraction
        fields = ['id', 'officer', 'created_at', 'vehicle', 'comments']


class InfractionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infraction
        fields = ['id', 'officer', 'created_at', 'vehicle', 'comments']


class InfractionOfficerCreateSerializer(serializers.Serializer):
    placa_patente = serializers.CharField(max_length=10)
    timestamp = serializers.DateTimeField()
    comentarios = serializers.CharField(allow_blank=True, allow_null=True)

    def validate_placa_patente(self, value):
        vehicle = Vehicle.objects.filter(license_plate=value).first()
        if not vehicle:
            raise serializers.ValidationError("No se encontró un vehículo con esta placa patente.")
        return value

    def create(self, validated_data):
        if not hasattr(self.context["request"].user, "officer_user"):
            raise serializers.ValidationError("Este usuario no es un agente de transito.")

        infraction = Infraction(**{
            "officer": self.context["request"].user.officer_user,
            "created_at": validated_data["timestamp"],
            "vehicle": Vehicle.objects.get(license_plate=validated_data["placa_patente"]),
            "comments": validated_data["comentarios"],
        })
        infraction.save()
        return infraction
