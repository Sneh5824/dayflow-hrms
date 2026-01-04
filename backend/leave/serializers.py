from rest_framework import serializers
from .models import Leave


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = "__all__"
        read_only_fields = ["user", "status", "created_at"]
