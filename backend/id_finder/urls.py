from django.urls import path
from .views import IDCreateView, IDListView, MyIDListView, IDClaimView, ApproveIDClaim, AdminDashBoard, IDDetail, UserClaimsView, AdminIDClaimView, ClaimIDDetail

urlpatterns = [
    path('ids/', IDListView.as_view(), name='id-list'),
    path('ids/my/', MyIDListView.as_view(), name='my-id-list'),
    path('ids/add/', IDCreateView.as_view(), name='add-id'),
    path('verify/', IDClaimView.as_view(), name='verify-id'),
    path('approve/<int:claim_id>/', ApproveIDClaim.as_view(), name='approve-id'),
    path('dashboard/', AdminDashBoard.as_view(), name='dashboard'),
    path('id_detail/', IDDetail.as_view(), name="id detail"),
    path('user-claims/', UserClaimsView.as_view(), name="user claims"),
    path('admin/view-claims/', AdminIDClaimView.as_view(), name="admin-view-claims"),
     path('claim/id_detail/', ClaimIDDetail.as_view(), name="id detail"),


]