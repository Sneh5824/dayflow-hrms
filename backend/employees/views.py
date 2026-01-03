from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer
from accounts.permissions import IsAdminOrSelf

class EmployeeProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSelf]
