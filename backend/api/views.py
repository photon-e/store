from django.http import JsonResponse


def health_check(_: object) -> JsonResponse:
    return JsonResponse({'status': 'ok', 'service': 'django-backend'})
