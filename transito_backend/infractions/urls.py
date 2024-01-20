from django.urls import path
from rest_framework.routers import DefaultRouter
from infractions.views.person import PersonViewSet
from infractions.views.vehicle import VehicleViewSet
from infractions.views.officer import OfficerViewSet
from infractions.views.infraction import InfractionViewSet

router = DefaultRouter()
router.register('person', PersonViewSet, basename='person')
router.register('vehicle', VehicleViewSet, basename='vehicle')
router.register('officer', OfficerViewSet, basename='officer')
router.register('infraction', InfractionViewSet, basename='infraction')

urlpatterns = []
urlpatterns += router.urls
