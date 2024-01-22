from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from infractions.models import Officer, Infraction
from infractions.serializers.officer import OfficerCreateSerializer
from infractions.serializers.officer import OfficerSerializer
from utilities.filter_with_params import FilterManager
from utilities.paginator import CustomPagination


class OfficerViewSet(ModelViewSet):
	serializer_class = OfficerSerializer
	queryset = Officer.objects
	permission_classes = [IsAuthenticated, IsAdminUser]
	pagination_class = CustomPagination


	def get_serializer_class(self):
		if self.action in ["create", "update"]:
			self.serializer_class = OfficerCreateSerializer
		return self.serializer_class

	def get_queryset(self):
		if self.action in ["list"]:
			filters = []
			# Check FilterManager docstring
			result = FilterManager(filters, self.request.query_params).generate()
			self.queryset = self.queryset.filter(*result)
		return self.queryset

	@transaction.atomic
	def destroy(self, request, pk):
		officer = self.get_object()
		Infraction.objects.filter(officer=officer).delete()
		return super().destroy(request)
