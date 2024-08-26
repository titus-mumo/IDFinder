from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('id_finder.urls')),  # Include id_finder app URLs
    path('auth/', include('authentication.urls')),  # Include authentication app URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT obtain pair view
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT refresh view
]
