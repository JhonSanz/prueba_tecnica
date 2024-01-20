from utilities.read_initial_data import DataReader

reader = DataReader(
    data_file="utilities/initial_data/data_inversiones.xlsx",
    app="position",
    data_definition=[
        {
            "sheet_name": "money",
            "model": "Money",
            "related_fields": [
                {"model": "CustomUser", "field": "user", "app": "utilities"}
            ],
        },
        {
            "sheet_name": "broker",
            "model": "Broker",
            "related_fields": [
                {"model": "CustomUser", "field": "user", "app": "utilities"}
            ],
        },
        {
            "sheet_name": "account",
            "model": "Account",
            "related_fields": [
                {"model": "Broker", "field": "broker"}
            ]
        },
        {
            "sheet_name": "assets",
            "model": "Asset",
            "related_fields": [
                {"model": "Account", "field": "account"}
            ]
        },
        {
            "sheet_name": "positions",
            "model": "Position",
            "related_fields": [
                {"model": "Position", "field": "reference"},
                {"model": "Asset", "field": "asset"}
            ]
        },
        {
            "sheet_name": "accountmoney",
            "model": "AccountMoney",
            "related_fields": [
                {"model": "Account", "field": "account"},
                {"model": "Money", "field": "money"}
            ]
        }
    ]
)
