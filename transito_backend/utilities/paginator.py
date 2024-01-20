
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import action


class ChildPaginator():
    use_child_paginator = True

    @property
    def use_child_paginator(self):
        if self.request.query_params.get(
                "disable_child_paginator") in ['true', True]:
            return False
        return True

    def childs(self, request, pk):
        queryset = self._child_queryset
        if self.use_child_paginator:
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.child_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
        serializer = self.child_serializer(queryset, many=True)
        return Response(serializer.data)


DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 10

class CustomPagination(PageNumberPagination):
    page = DEFAULT_PAGE
    page_size = DEFAULT_PAGE_SIZE
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'page': int(self.request.GET.get('page', DEFAULT_PAGE)),
            'page_size': int(self.request.GET.get('page_size', self.page_size)),
            'count': self.page.paginator.count,
            'data': data
        })
