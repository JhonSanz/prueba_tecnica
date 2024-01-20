from django.core.management.base import BaseCommand
from django.apps import apps
from utilities.create_endpoint import Creator
from utilities.generate_urls_file import UrlsGenerator

class Command(BaseCommand):
    help = 'Creates a new endpoint'

    def add_arguments(self, parser):
        parser.add_argument('-a', '--app', type=str,
                            help='App name', required=True)
        parser.add_argument('-m', '--model', type=str,
                            help='Model name', required=False)
        parser.add_argument('-p', '--path', type=str,
                            help='Path to create the endpoint', required=True)

    def handle(self, *args, **kwargs):
        if not kwargs['model']:
            for model in apps.get_app_config(kwargs['app']).get_models():
                Creator(**{
                    "model": model,
                    "path": kwargs['path'],
                    "app": kwargs['app']
                }).run()
            UrlsGenerator(app=kwargs['app']).run()
            return
        Creator(**{
            "model": apps.get_model(kwargs['app'], kwargs['model'].lower()),
            "path": kwargs['path'],
            "app": kwargs['app']
        }).run()
