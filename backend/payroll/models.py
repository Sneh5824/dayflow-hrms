from django.db import models
from accounts.models import User


class SalaryStructure(models.Model):
    """Salary structure for an employee"""
    employee = models.OneToOneField(User, on_delete=models.CASCADE, related_name="salary")
    
    # Basic wage info
    monthly_wage = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    working_days_per_week = models.IntegerField(default=5)
    working_hours_per_day = models.DecimalField(max_digits=4, decimal_places=2, default=8)
    
    # Salary components - percentages of basic
    basic_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)  # Basic = 50% of wage
    hra_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=40.00)    # HRA = 40% of Basic
    standard_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)   # Fixed amount
    performance_bonus_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=8.33)
    leave_travel_allowance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=8.33)
    food_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)       # Fixed amount
    
    # Deductions
    pf_employee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=12.00)
    pf_employer_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=12.00)
    professional_tax = models.DecimalField(max_digits=10, decimal_places=2, default=200)    # Fixed amount
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def yearly_wage(self):
        return self.monthly_wage * 12
    
    @property
    def basic_salary(self):
        return (self.monthly_wage * self.basic_percentage) / 100
    
    @property
    def hra(self):
        return (self.basic_salary * self.hra_percentage) / 100
    
    @property
    def performance_bonus(self):
        return (self.basic_salary * self.performance_bonus_percentage) / 100
    
    @property
    def leave_travel_allowance(self):
        return (self.basic_salary * self.leave_travel_allowance_percentage) / 100
    
    @property
    def total_earnings(self):
        return (self.basic_salary + self.hra + self.standard_allowance + 
                self.performance_bonus + self.leave_travel_allowance + self.food_allowance)
    
    @property
    def pf_employee(self):
        return (self.basic_salary * self.pf_employee_percentage) / 100
    
    @property
    def pf_employer(self):
        return (self.basic_salary * self.pf_employer_percentage) / 100
    
    @property
    def total_deductions(self):
        return self.pf_employee + self.professional_tax
    
    @property
    def net_salary(self):
        return self.total_earnings - self.total_deductions
    
    def __str__(self):
        return f"Salary: {self.employee.username} - ₹{self.monthly_wage}/month"

