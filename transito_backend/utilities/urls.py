from django.urls import path
from utilities.views.user import UserViewSet
from rest_framework.routers import DefaultRouter
from utilities.views.authentication import CustomTokenObtainPairView, Logout

router = DefaultRouter()
router.register('user', UserViewSet, basename='user')

urlpatterns = [
    path('token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout', Logout.as_view(), name='logout'),
]
urlpatterns += router.urls
