from utilities.read_initial_data import DataReader

reader = DataReader(
    data_file="utilities/initial_data/data_infracciones.xlsx",
    app="infractions",
    data_definition=[
        {
            "sheet_name": "brand",
            "model": "Brand",
            "related_fields": []
        },
        {
            "sheet_name": "person",
            "model": "Person",
            "related_fields": []
        },
        {
            "sheet_name": "officer",
            "model": "Officer",
            "related_fields": []
        },
        {
            "sheet_name": "vehicle",
            "model": "Vehicle",
            "related_fields": [
                {"model": "Brand", "field": "brand"},
                {"model": "Person", "field": "infractor"}
            ]
        },
        {
            "sheet_name": "infraction",
            "model": "Infraction",
            "related_fields": [
                {"model": "Officer", "field": "officer"},
                {"model": "Vehicle", "field": "vehicle"}
            ]
        },
    ]
)
