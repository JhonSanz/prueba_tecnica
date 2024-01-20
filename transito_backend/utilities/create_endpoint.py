from django.db.models import Model


class Creator:
    def __init__(self, model: Model, path: str, app: str) -> None:
        self.model = model
        self.path = path
        self.app = app

    def check_file_exists(self, path: str) -> bool:
        """ Checks if a file exists """
        try:
            with open(f"{path}", "r") as f:
                return True
        except FileNotFoundError:
            return False

    def create_serializer(self):
        """ Creates a file with the name of the model in the views folder """
        model_name = self.model.__name__.capitalize()
        final_path = f"{self.path}/serializers/{model_name.lower()}.py"
        if (self.check_file_exists(final_path)):
            print(f"File already exists in {self.path}/serializers/")
            return
        with open(final_path, "w") as f:
            f.write(
                "from rest_framework import serializers\n"
                f"from {self.app}.models import {model_name}\n"
                "\n""\n"
                f"class {model_name}Serializer(serializers.ModelSerializer):\n"
                f"\tclass Meta:\n"
                f"\t\tmodel = {model_name}\n"
                f"\t\tfields = {[field.name for field in self.model._meta.get_fields()]}\n"
                "\n""\n"
                f"class {model_name}CreateSerializer(serializers.ModelSerializer):\n"
                f"\tclass Meta:\n"
                f"\t\tmodel = {model_name}\n"
                f"\t\tfields = {[field.name for field in self.model._meta.get_fields()]}\n"
            )

    def create_view(self):
        """ Creates a file with the name of the model in the views folder """
        model_name = self.model.__name__.capitalize()
        final_path = f"{self.path}/views/{model_name.lower()}.py"
        if (self.check_file_exists(final_path)):
            print(f"File already exists in {self.path}/views/")
            return
        with open(final_path, "w") as f:
            f.write(
                "from rest_framework.viewsets import ModelViewSet\n"
                "from rest_framework.permissions import IsAuthenticated\n"
                f"from {self.app}.models import {model_name}\n"
                f"from {self.app}.serializers.{model_name.lower()} import {model_name}CreateSerializer\n"
                f"from {self.app}.serializers.{model_name.lower()} import {model_name}Serializer\n"
                "from utilities.filter_with_params import FilterManager\n"
                "from utilities.paginator import CustomPagination\n"
                "\n""\n"
                f"class {model_name}ViewSet(ModelViewSet):\n"
                f"\tserializer_class = {model_name}Serializer\n"
                f"\tqueryset = {model_name}.objects\n"
                f"\tpermission_classes = [] # [IsAuthenticated]\n"
                f"\tpagination_class = CustomPagination\n"
                "\n""\n"
                "\tdef get_serializer_class(self):\n"
                '\t\tif self.action in ["create", "update"]:\n'
                f"\t\t\tself.serializer_class = {model_name}CreateSerializer\n"
                "\t\treturn self.serializer_class\n"
                "\n"
                "\tdef get_queryset(self):\n"
                '\t\tif self.action in ["list"]:\n'
                "\t\t\tfilters = []\n"
                "\t\t\t# Check FilterManager docstring\n"
                "\t\t\tresult = FilterManager(filters, self.request.query_params).generate()\n"
                "\t\t\tself.queryset = self.queryset.filter(*result)\n"
                "\t\treturn self.queryset"
            )

    def run(self):
        self.create_serializer()
        self.create_view()
