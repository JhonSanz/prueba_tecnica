from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from infractions.models import Infraction
from infractions.serializers.infraction import InfractionOfficerCreateSerializer
from utilities.paginator import CustomPagination


class LoadInfractionViewSet(APIView):
    def post(self, request):
        serializer = InfractionOfficerCreateSerializer(
            data=request.data,
            context={
                "request": request,
            }
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({}, status=status.HTTP_200_OK)

