from django.urls import path
from .views import EmployeeProfileDetailView

urlpatterns = [
    path('<int:pk>/', EmployeeProfileDetailView.as_view()),
]
