from rest_framework.generics import ListCreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Leave
from .serializers import LeaveSerializer


class LeaveListCreateView(ListCreateAPIView):
    """
    EMPLOYEE:
      - GET → list own leaves
      - POST → apply for leave

    ADMIN / HR:
      - GET → list all leaves
    """
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role in ["ADMIN", "HR"]:
            return Leave.objects.all().order_by("-id")

        return Leave.objects.filter(user=user).order_by("-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status="PENDING")


class LeaveApproveRejectView(UpdateAPIView):
    """
    ADMIN / HR:
      - Approve or Reject leave
    """
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user

        if user.role not in ["ADMIN", "HR"]:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )

        leave = self.get_object()
        new_status = request.data.get("status")

        if new_status not in ["APPROVED", "REJECTED"]:
            return Response(
                {"detail": "Invalid status value."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        leave.status = new_status
        leave.save()

        return Response(LeaveSerializer(leave).data)
