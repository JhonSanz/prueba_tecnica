from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from infractions.models import Brand
from infractions.serializers.brand import BrandSerializer
from utilities.filter_with_params import FilterManager
from utilities.paginator import CustomPagination
from rest_framework.response import Response
from rest_framework import status


class BrandViewSet(ModelViewSet):
    serializer_class = BrandSerializer
    queryset = Brand.objects
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = CustomPagination

    def get_queryset(self):
        if self.action in ["list"]:
            filters = []
            # Check FilterManager docstring
            result = FilterManager(filters, self.request.query_params).generate()
            self.queryset = self.queryset.filter(*result)
        return self.queryset

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
