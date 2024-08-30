from django.urls import path
from .views import IDCreateView, IDListView, MyIDListView

urlpatterns = [
    path('ids/', IDListView.as_view(), name='id-list'),
    path('ids/my/', MyIDListView.as_view(), name='my-id-list'),
    path('ids/add/', IDCreateView.as_view(), name='add-id'),
]