from rest_framework.permissions import BasePermission

class IsAdminOrSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin / HR can access all
        if request.user.role in ["ADMIN", "HR"]:
            return True

        # Employee can access only own profile
        return obj.user == request.user
