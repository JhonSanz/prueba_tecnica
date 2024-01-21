from django.urls import path
from rest_framework.routers import DefaultRouter
from infractions.views.person import PersonViewSet
from infractions.views.vehicle import VehicleViewSet
from infractions.views.officer import OfficerViewSet
from infractions.views.infraction import InfractionViewSet
from infractions.views.summary import SummaryViewSet
from infractions.views.load_infraction import LoadInfractionViewSet


router = DefaultRouter()
router.register('person', PersonViewSet, basename='person')
router.register('vehicle', VehicleViewSet, basename='vehicle')
router.register('officer', OfficerViewSet, basename='officer')
router.register('infraction', InfractionViewSet, basename='infraction')
router.register('generar_informe', SummaryViewSet, basename='generar_informe')

urlpatterns = [
    path('cargar_infraccion/', LoadInfractionViewSet.as_view()),
]
urlpatterns += router.urls
