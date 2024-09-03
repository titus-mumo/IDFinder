# backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('accounts/', include('allauth.urls')),
    path('api/', include('id_finder.urls')),
]
