from django.urls import path
from .views import IDCreateView, IDListView, MyIDListView,VerifyIDView, ApproveIDClaim

urlpatterns = [
    path('ids/', IDListView.as_view(), name='id-list'),
    path('ids/my/', MyIDListView.as_view(), name='my-id-list'),
    path('ids/add/', IDCreateView.as_view(), name='add-id'),
    path('verify/<str:id_no>/', VerifyIDView.as_view(), name='verify-id'),
    path('approve/<int:claim_id>/', ApproveIDClaim.as_view(), name='approve-id'),
]