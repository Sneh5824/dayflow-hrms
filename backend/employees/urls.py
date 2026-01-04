from django.urls import path
from .views import (
    EmployeeListView,
    EmployeeDetailView,
    EmployeeProfileDetailView,
    EmployeeProfileByUserView
)

urlpatterns = [
    path('', EmployeeListView.as_view()),
    path('<int:pk>/', EmployeeDetailView.as_view()),
    path('profile/<int:pk>/', EmployeeProfileDetailView.as_view()),
    path('user/<int:user_id>/profile/', EmployeeProfileByUserView.as_view()),
]
