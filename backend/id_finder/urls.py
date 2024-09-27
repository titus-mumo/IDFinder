from django.urls import path
from .views import IDCreateView, IDListView, MyIDListView, AdminDashBoard

urlpatterns = [
    path('ids/', IDListView.as_view(), name='id-list'),
    path('ids/my/', MyIDListView.as_view(), name='my-id-list'),
    path('ids/add/', IDCreateView.as_view(), name='add-id'),
    path('dashboard/', AdminDashBoard.as_view(), name='dashboard')
]