from django.apps import apps


class UrlsGenerator:
    def __init__(self, app: str):
        self.app = app

    def run(self):
        imports = '\n'.join([
            f"from {self.app}.views.{model.__name__.lower()} import {model.__name__}ViewSet"
            for model in apps.get_app_config(self.app).get_models()
        ])
        register = '\n'.join([
            f"router.register('{model.__name__.lower()}', {model.__name__}ViewSet, basename='{model.__name__.lower()}')"
            for model in apps.get_app_config(self.app).get_models()
        ])
        with open(f"{self.app}/urls.py", "w") as f:
            f.write(
                "from django.urls import path\n"
                "from rest_framework.routers import DefaultRouter\n"
                f"{imports}"
                "\n""\n"
                "router = DefaultRouter()\n"
                f"{register}"
                "\n""\n"
                "urlpatterns = []\n"
                "urlpatterns += router.urls\n"
            )
