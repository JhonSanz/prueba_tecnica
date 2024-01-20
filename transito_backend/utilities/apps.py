from django.apps import AppConfig
from datetime import timedelta


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'utilities.paginator.CustomPagination',
    'PAGE_SIZE': 100
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=240),
}

class UtilitiesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'utilities'

    def ready(self):
        from django.conf import settings
        setattr(settings, 'SIMPLE_JWT', SIMPLE_JWT)
        setattr(settings, 'REST_FRAMEWORK', REST_FRAMEWORK)
