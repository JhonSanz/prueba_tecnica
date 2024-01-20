from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from infractions.models import Infraction
from infractions.serializers.infraction import InfractionCreateSerializer
from infractions.serializers.infraction import InfractionSerializer
from utilities.filter_with_params import FilterManager
from utilities.paginator import CustomPagination


class InfractionViewSet(ModelViewSet):
	serializer_class = InfractionSerializer
	queryset = Infraction.objects
	permission_classes = [] # [IsAuthenticated]
	pagination_class = CustomPagination


	def get_serializer_class(self):
		if self.action in ["create", "update"]:
			self.serializer_class = InfractionCreateSerializer
		return self.serializer_class

	def get_queryset(self):
		if self.action in ["list"]:
			filters = []
			# Check FilterManager docstring
			result = FilterManager(filters, self.request.query_params).generate()
			self.queryset = self.queryset.filter(*result)
		return self.queryset
