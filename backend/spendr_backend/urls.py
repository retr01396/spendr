from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse


def healthz(request):
    return HttpResponse("OK")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('subscriptions.urls')),
    path('healthz', healthz),
]
