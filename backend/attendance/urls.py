from django.urls import path
from .views import CheckInView, CheckOutView, AttendanceHistoryView


urlpatterns = [
    path("check-in/", CheckInView.as_view()),
    path("check-out/", CheckOutView.as_view()),
    path("history/", AttendanceHistoryView.as_view()),
]
