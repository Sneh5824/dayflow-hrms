from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SalaryStructure
from .serializers import SalaryStructureSerializer
from accounts.permissions import IsAdmin


class SalaryStructureListView(generics.ListCreateAPIView):
    """List all salary structures (Admin only) or create new"""
    queryset = SalaryStructure.objects.all()
    serializer_class = SalaryStructureSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def perform_create(self, serializer):
        serializer.save()


class SalaryStructureDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete a salary structure (Admin only)"""
    queryset = SalaryStructure.objects.all()
    serializer_class = SalaryStructureSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class EmployeeSalaryView(APIView):
    """Get salary for a specific employee by employee ID"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request, employee_id):
        try:
            salary = SalaryStructure.objects.get(employee_id=employee_id)
            serializer = SalaryStructureSerializer(salary)
            return Response(serializer.data)
        except SalaryStructure.DoesNotExist:
            return Response(
                {"detail": "Salary structure not found for this employee"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request, employee_id):
        """Create salary structure for employee"""
        data = request.data.copy()
        data['employee'] = employee_id
        serializer = SalaryStructureSerializer(data=data)
        if serializer.is_valid():
            serializer.save(employee_id=employee_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, employee_id):
        """Update salary structure for employee"""
        try:
            salary = SalaryStructure.objects.get(employee_id=employee_id)
            serializer = SalaryStructureSerializer(salary, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SalaryStructure.DoesNotExist:
            return Response(
                {"detail": "Salary structure not found for this employee"},
                status=status.HTTP_404_NOT_FOUND
            )

