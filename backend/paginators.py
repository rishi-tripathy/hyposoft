from rest_framework.pagination import PageNumberPagination


class Unpaginatable(PageNumberPagination):
    def paginate_queryset(self, queryset, request, view=None):
        if request.query_params.get('show_all', False) == 'true':
            return None

        return super().paginate_queryset(queryset, request, view=view)


class BigUnpaginatable(PageNumberPagination):
    page_size = 25

    def paginate_queryset(self, queryset, request, view=None):
        if request.query_params.get('show_all', False) == 'true':
            return None

        return super().paginate_queryset(queryset, request, view=view)
