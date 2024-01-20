from django.core.management.base import BaseCommand
from utilities.generate_urls_file import UrlsGenerator


class Command(BaseCommand):
    help = 'Creates a new endpoint'

    def add_arguments(self, parser):
        parser.add_argument('-a', '--app', type=str,
                            help='App name', required=True)

    def handle(self, *args, **kwargs):
        UrlsGenerator(app=kwargs['app']).run()
