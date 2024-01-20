from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from infractions.models import Infraction
from infractions.serializers.infraction import InfractionOfficerCreateSerializer
from utilities.paginator import CustomPagination


class LoadInfractionViewSet(ModelViewSet):
    serializer_class = InfractionOfficerCreateSerializer
    queryset = Infraction.objects
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_serializer_class(self):
        if self.action in ["create"]:
            self.serializer_class = InfractionOfficerCreateSerializer
        return self.serializer_class

    def list(self, request):
        response = {"message": "List function is not offered in this path."}
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
