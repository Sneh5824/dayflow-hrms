from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer, EmployeeListSerializer, EmployeeDetailSerializer
from accounts.permissions import IsAdmin, IsAdminOrSelf
from accounts.models import User


class EmployeeListView(generics.ListAPIView):
    """List all employees (Admin/HR only)"""
    queryset = User.objects.all().select_related('profile')
    serializer_class = EmployeeListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Optional filtering
        role = self.request.query_params.get('role')
        department = self.request.query_params.get('department')
        
        if role:
            queryset = queryset.filter(role=role)
        if department:
            queryset = queryset.filter(profile__department__icontains=department)
        
        return queryset.order_by('first_name', 'last_name')


class EmployeeDetailView(generics.RetrieveAPIView):
    """Get single employee details (Admin/HR or self)"""
    queryset = User.objects.all().select_related('profile')
    serializer_class = EmployeeDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        # Allow admin/HR or employee viewing their own profile
        if user.role not in ['ADMIN', 'HR'] and obj.id != user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only view your own profile")
        return obj


class EmployeeProfileDetailView(generics.RetrieveUpdateAPIView):
    """Get/Update employee profile"""
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSelf]


class EmployeeProfileByUserView(APIView):
    """Get/Update employee profile by user ID"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id):
        user = request.user
        # Allow admin/HR or employee viewing their own profile
        if user.role not in ['ADMIN', 'HR'] and user_id != user.id:
            return Response(
                {"detail": "You can only view your own profile"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = EmployeeProfile.objects.get(user_id=user_id)
            serializer = EmployeeProfileSerializer(profile)
            return Response(serializer.data)
        except EmployeeProfile.DoesNotExist:
            return Response(
                {"detail": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request, user_id):
        user = request.user
        if user.role not in ['ADMIN', 'HR'] and user_id != user.id:
            return Response(
                {"detail": "You can only update your own profile"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = EmployeeProfile.objects.get(user_id=user_id)
        except EmployeeProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = EmployeeProfile(user_id=user_id)
        
        serializer = EmployeeProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, user_id):
        """Create profile for user"""
        user = request.user
        if user.role not in ['ADMIN', 'HR']:
            return Response(
                {"detail": "Only Admin/HR can create profiles"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if profile already exists
        if EmployeeProfile.objects.filter(user_id=user_id).exists():
            return Response(
                {"detail": "Profile already exists for this user"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile = EmployeeProfile(user_id=user_id)
        serializer = EmployeeProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

