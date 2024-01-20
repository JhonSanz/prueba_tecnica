from rest_framework.viewsets import ModelViewSet
from django.db.models import Model


class GenerateCurl:
    def __init__(self, viewset: ModelViewSet, path: str, directory: str):
        self.viewset = viewset()
        self.path = path
        self.directory = directory
        self.curl_template = (
            "--header 'Content-Type: application/json' \\\n"
            "--header 'Authorization: Bearer {{token}}' \\\n"
        )

    def get_serializer_fields(self) -> list:
        return self.viewset.get_serializer_class().Meta.fields

    def get_serializer_model(self) -> Model:
        return self.viewset.get_serializer_class().Meta.model

    def get_curl_location(self, http_method, url_path) -> str:
        return f"curl --location --request {http_method} {'{{url}}'}/'{url_path}' \\\n"

    def get_method_name(self, action) -> str:
        if action in ["create"]:
            return "POST"
        if action in ["list", "retrieve"]:
            return "GET"
        if action in ["update"]:
            return "PUT"
        if action in ["destroy"]:
            return "DELETE"

    def match_serializer_fields(self, action):
        self.viewset.action = action
        serializer_fields = self.get_serializer_fields()

        # check if serializer fields are in model fields to
        # set model types to use faker library
        # model = self.get_serializer_model(action)
        # for model_field in model._meta.get_fields():
        #     if model_field.get_attname() in serializer_fields:
        #         print(model_field.get_attname())
        #         print(model_field.get_internal_type())

        location = self.get_curl_location(
            self.get_method_name(action),
            f"{self.path}/{'pk/' if action in ['retrieve', 'update', 'destroy'] else ''}"
        )
        body = ""
        if action in ["create", "update", "partial_update"]:
            body_fieds = "\n".join(
                [f'{" "*4}"{field}": ""{"," if index < len(serializer_fields) - 1 else ""}'
                 for (index, field) in enumerate(serializer_fields)]
            )
            body = (
                "--data '{\n"
                f"{body_fieds}\n"
                "}'"
            )
        return location + self.curl_template + body

    def create_curl(self):
        for action in [
            "create", "list", "retrieve", "update", "destroy"
        ]:
            result = self.match_serializer_fields(action)
            with open(f"{self.directory}/{action}.sh", "w") as file:
                file.write(result)
