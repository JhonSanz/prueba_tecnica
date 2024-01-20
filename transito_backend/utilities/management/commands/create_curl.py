import re
import os
from django.core.management.base import BaseCommand
from utilities.generate_curl import GenerateCurl
from transito_backend.urls import urlpatterns


class Command(BaseCommand):
    help = 'Creates curl for a viewset'

    def add_arguments(self, parser):
        parser.add_argument('-a', '--app', type=str,
                            help='App name', required=True)

    def handle(self, *args, **kwargs):
        url_path = list(filter(lambda url: url.app_name ==
                        kwargs['app'], urlpatterns))
        if not url_path:
            raise Exception("App not found")
        router_conf = getattr(url_path[0].urlconf_name, "router")
        for url in router_conf._urls[0:-2:4]:
            cleaned_url = re.sub('\W+', '', str(url.pattern))
            dir_path = f"docs/{cleaned_url}"
            viewset = list(filter(lambda x: x[0] == cleaned_url,  router_conf.registry))
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
            GenerateCurl(
                viewset[0][1],
                f"{str(url_path[0].pattern)}/{cleaned_url}",
                dir_path
            ).create_curl()
