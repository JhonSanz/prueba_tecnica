from django.db.models import Q


class FilterManager:
    """ Use this class in your get_queryset function to generate filters
    to filter a queryset given queryparams from request

    "param" key have to match with the queryparam key
    "condition" key have to match with the condition you want to apply
    to the queryset

    Example:
        filters = [
            {"param": "quantity_from", "condition": "quantity__gte"},
            {"param": "quantity_to", "condition": "quantity__lte"},
        ]
        result = FilterManager(filters, self.request.query_params).generate()
        self.queryset = self.queryset.filter(*result)
    """

    def __init__(self, filters: list[dict], queryparams: dict):
        self.filters = filters
        self.queryparams = queryparams
        self.result = []

    def generate(self) -> list:
        visited = []
        for key, value in self.queryparams.items():
            if not value:
                continue
            filter_ = list(filter(lambda x: x["param"] == key, self.filters))
            if filter_ and key not in visited:
                self.result.append(*[
                    Q(**{found["condition"]: True if value in ["True", "true"] else value})
                    for found in filter_
                ])
                visited.append(key)

        return self.result
