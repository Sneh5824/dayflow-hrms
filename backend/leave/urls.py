from django.urls import path
from .views import LeaveListCreateView, LeaveApproveRejectView

urlpatterns = [
    path("", LeaveListCreateView.as_view()),
    path("<int:pk>/approve/", LeaveApproveRejectView.as_view()),
]
