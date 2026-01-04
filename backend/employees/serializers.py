from rest_framework import serializers
from .models import EmployeeProfile
from accounts.models import User


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info for employee list"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'employee_id']


class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    skills_list = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployeeProfile
        fields = "__all__"
        read_only_fields = ["user", "created_at", "updated_at"]
    
    def get_skills_list(self, obj):
        if obj.skills:
            return [s.strip() for s in obj.skills.split(',') if s.strip()]
        return []
    
    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}".strip() or obj.manager.username
        return None


class EmployeeListSerializer(serializers.ModelSerializer):
    """Serializer for employee list view"""
    profile = EmployeeProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'employee_id', 'profile', 'full_name']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class EmployeeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single employee view"""
    profile = EmployeeProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'employee_id', 'profile', 'full_name', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

