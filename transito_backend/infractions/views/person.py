from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from infractions.models import Person, Vehicle, Infraction
from infractions.serializers.person import PersonCreateSerializer
from infractions.serializers.person import PersonSerializer
from utilities.filter_with_params import FilterManager
from utilities.paginator import CustomPagination



class PersonViewSet(ModelViewSet):
	serializer_class = PersonSerializer
	queryset = Person.objects
	permission_classes = [IsAuthenticated, IsAdminUser]
	pagination_class = CustomPagination


	def get_serializer_class(self):
		if self.action in ["create", "update"]:
			self.serializer_class = PersonCreateSerializer
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
		person = self.get_object()
		Infraction.objects.filter(vehicle__infractor=person).delete()
		Vehicle.objects.filter(infractor=person).delete()
		return super().destroy(request)
