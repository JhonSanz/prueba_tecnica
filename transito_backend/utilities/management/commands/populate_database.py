from django.core.management.base import BaseCommand
from utilities.initial_data.data_creator import reader
from utilities.constant import DataCreator


class Command(BaseCommand):
    help = (
        'Populates the database with the initial data '
        'from utilities/initial_data/data_creator.py script'
    )

    def handle(self, *args, **kwargs):
        reader.run(mode=DataCreator.POPULATE)
        reader.run(mode=DataCreator.FIXTURE)
