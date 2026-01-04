from rest_framework import serializers
from .models import SalaryStructure


class SalaryStructureSerializer(serializers.ModelSerializer):
    # Computed fields
    yearly_wage = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    basic_salary = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    hra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    performance_bonus = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    leave_travel_allowance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_earnings = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    pf_employee = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    pf_employer = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_deductions = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    net_salary = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    employee_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SalaryStructure
        fields = [
            'id', 'employee', 'employee_name',
            'monthly_wage', 'yearly_wage', 'working_days_per_week', 'working_hours_per_day',
            'basic_percentage', 'basic_salary',
            'hra_percentage', 'hra',
            'standard_allowance',
            'performance_bonus_percentage', 'performance_bonus',
            'leave_travel_allowance_percentage', 'leave_travel_allowance',
            'food_allowance',
            'total_earnings',
            'pf_employee_percentage', 'pf_employee',
            'pf_employer_percentage', 'pf_employer',
            'professional_tax',
            'total_deductions',
            'net_salary',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['employee', 'created_at', 'updated_at']
    
    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}".strip() or obj.employee.username
