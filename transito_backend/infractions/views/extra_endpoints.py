from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from infractions.models import Infraction
from infractions.serializers.infraction import InfractionSerializer
from utilities.filter_with_params import FilterManager
from utilities.paginator import CustomPagination


class SummaryViewSet(ModelViewSet):
    serializer_class = InfractionSerializer
    queryset = Infraction.objects
    permission_classes = []
    pagination_class = CustomPagination

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            self.serializer_class = InfractionSerializer
        return self.serializer_class

    def get_queryset(self):
        if self.action in ["list"]:
            filters = []
            # Check FilterManager docstring
            result = FilterManager(filters, self.request.query_params).generate()
            self.queryset = self.queryset.filter(*result)
        return self.queryset

    def list(self, request):
        email = request.query_params.get("email")
        if email is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        self.queryset = self.queryset.filter(vehicle__infractor__email=email)
        return super().list(request)

    def create(self, request):
        response = {"message": "Create function is not offered in this path."}
        return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, pk=None):
        response = {"message": "Update function is not offered in this path."}
        return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, pk=None):
        response = {"message": "Update function is not offered in this path."}
        return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, pk=None):
        response = {"message": "Delete function is not offered in this path."}
        return Response(response, status=status.HTTP_405_METHOD_NOT_ALLOWED)
