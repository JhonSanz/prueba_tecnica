import pandas as pd
# from django.db.models import Model
from django.apps import apps
from django.db import transaction
from .constant import DataCreator
import json
import uuid
import numpy as np


class DataReader:
    def __init__(self, data_file: str, data_definition: list[dict], app: str):
        self.data_file = data_file
        self.data_definition = data_definition
        self.app = app
        self.data = None
        self.sheet_names = []
        self.sheet_files = {}
        self.result = []

    def get_sheets_names(self):
        return [sheet["sheet_name"] for sheet in self.data_definition]

    def generate_data_from_sheet(self):
        all_sheets = {}
        for sheet in self.sheets_names:
            df = pd.read_excel(self.data, sheet)
            df["id"] = df["id"].apply(lambda x: uuid.uuid5(
                uuid.NAMESPACE_DNS, f'{sheet}{x}'))
            all_sheets[sheet] = df
        return all_sheets

    @transaction.atomic
    def iterate_over_data(self, mode: int):
        for item in self.data_definition:
            if item["related_fields"]:
                for related in item["related_fields"]:
                    if related.get("app"):
                        continue
                    related_table = list(filter(
                        lambda x: x["model"] == related["model"],
                        self.data_definition
                    ))
                    self.check_related_ids(
                        table1=related_table[0], table2=item,
                        related=related
                    )
            if mode == DataCreator.FIXTURE:
                self.create_fixture(item)
            else:
                self.populate_database(item)

    def check_related_ids(self, table1: dict, table2: dict, related: dict) -> None:
        df_table1 = self.sheet_files[table1["sheet_name"]]
        df_table2 = self.sheet_files[table2["sheet_name"]]
        df_table2[related["field"]] = df_table2[related["field"]].fillna(0)
        df_table2[related["field"]] = df_table2[related["field"]].astype(int)
        df_table2[related["field"]] = df_table2[related["field"]].apply(
            lambda x: uuid.uuid5(
                uuid.NAMESPACE_DNS, f'{table1["sheet_name"]}{x}') if x != 0 else None
        )
        self.sheet_files[table2["sheet_name"]] = df_table2

        ids_table1 = set(df_table1["id"].dropna().unique().tolist())
        ids_related_table = set(
            df_table2[related["field"]].dropna().unique().tolist())

        if not ids_related_table.issubset(ids_table1):
            raise Exception(
                f"{table1['model']} {table2['model']}: ids {ids_related_table.difference(ids_table1)} not found")

    def create_fixture(self, item: dict):
        sheet = self.sheet_files[item["sheet_name"]].astype(str)
        for record in sheet.to_dict("records"):
            id = record.pop("id")
            self.result.append(
                {"model": f'{self.app}.{item["model"].lower()}',
                 "pk": id, "fields": record}
            )

    def populate_database(self, item: dict):
        sheet = self.sheet_files[item["sheet_name"]].iloc[:, :].astype(str).replace('nan', None)
        model = apps.get_model(self.app, item["model"].lower())
        for record in sheet.to_dict("records"):
            if item["related_fields"]:
                for related in item["related_fields"]:
                    if related.get("app"):
                        related_model = apps.get_model(
                            related["app"], related["model"].lower()
                        )
                    else:
                        related_table = list(filter(
                            lambda x: x["model"] == related["model"],
                            self.data_definition
                        ))
                        related_model = apps.get_model(
                            self.app, related_table[0]["model"].lower()
                        )
                    

                    if record[related["field"]] not in ["", "None", None]:
                        record[related["field"]] = related_model.objects.get(
                            id=record[related["field"]]
                        )
                    else:
                        record[related["field"]] = None
            model(**record).save()

    def run(self, mode: int):
        if not mode in [DataCreator.FIXTURE, DataCreator.POPULATE]:
            raise Exception(f"Mode {mode} not supported")
        self.data = pd.ExcelFile(self.data_file)
        self.sheets_names = self.get_sheets_names()
        self.sheet_files = self.generate_data_from_sheet()
        self.iterate_over_data(mode)

        if mode == DataCreator.FIXTURE:
            with open("utilities/initial_data/fixture.json", "w") as file:
                file.write(json.dumps(self.result, sort_keys=True, indent=4))
                file.close()
