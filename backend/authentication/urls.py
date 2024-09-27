from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('refresh-token/', views.RefreshTokenView.as_view(), name='refresh_token'),
    path('verify-code/', views.VerifyCodeView.as_view(), name='verify_code'),
    path('change-current-password/', views.ChangePasswordView.as_view(), name='change password'),
    path('change-username/', views.ChangeUsernameView.as_view(), name='change username'),
    path('check-if-user-is-admin/', views.CheckIfUserIsAdmin.as_view(), name='user_category')
    # Add more API endpoints as needed
]
