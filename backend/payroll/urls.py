from django.urls import path
from .views import SalaryStructureListView, SalaryStructureDetailView, EmployeeSalaryView

urlpatterns = [
    path('', SalaryStructureListView.as_view()),
    path('<int:pk>/', SalaryStructureDetailView.as_view()),
    path('employee/<int:employee_id>/', EmployeeSalaryView.as_view()),
]
