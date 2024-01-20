from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from infractions.models import Vehicle
from infractions.serializers.vehicle import VehicleCreateSerializer
from infractions.serializers.vehicle import VehicleSerializer
from utilities.filter_with_params import FilterManager
from utilities.paginator import CustomPagination


class VehicleViewSet(ModelViewSet):
	serializer_class = VehicleSerializer
	queryset = Vehicle.objects
	permission_classes = [IsAuthenticated]
	pagination_class = CustomPagination


	def get_serializer_class(self):
		if self.action in ["create", "update"]:
			self.serializer_class = VehicleCreateSerializer
		return self.serializer_class

	def get_queryset(self):
		if self.action in ["list"]:
			filters = []
			# Check FilterManager docstring
			result = FilterManager(filters, self.request.query_params).generate()
			self.queryset = self.queryset.filter(*result)
		return self.queryset