
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.utils.timezone import now
from django.utils.dateparse import parse_date

from .models import Attendance
from .serializers import AttendanceSerializer


# =========================
# CHECK-IN
# =========================
class CheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        today = now().date()

        # Prevent multiple check-ins in one day
        if Attendance.objects.filter(user=user, date=today).exists():
            return Response(
                {"detail": "Already checked in today."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance = Attendance.objects.create(
            user=user,
            date=today,
            check_in=now(),
        )

        return Response(
            AttendanceSerializer(attendance).data,
            status=status.HTTP_201_CREATED,
        )


# =========================
# CHECK-OUT
# =========================
class CheckOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        today = now().date()

        attendance = Attendance.objects.filter(
            user=user,
            date=today,
        ).first()

        if not attendance:
            return Response(
                {"detail": "You have not checked in today."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if attendance.check_out:
            return Response(
                {"detail": "Already checked out today."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance.check_out = now()
        attendance.save()

        return Response(
            AttendanceSerializer(attendance).data,
            status=status.HTTP_200_OK,
        )


# =========================
# ATTENDANCE HISTORY
# =========================
class AttendanceHistoryView(ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Attendance.objects.all()

        # EMPLOYEE → only own data
        if user.role == "EMPLOYEE":
            queryset = queryset.filter(user=user)

        # ADMIN / HR → can filter by employee
        employee_id = self.request.query_params.get("employee_id")
        if employee_id and user.role in ["ADMIN", "HR"]:
            queryset = queryset.filter(user__id=employee_id)

        # Date filters
        start_date = self.request.query_params.get("start")
        end_date = self.request.query_params.get("end")

        if start_date:
            queryset = queryset.filter(date__gte=parse_date(start_date))

        if end_date:
            queryset = queryset.filter(date__lte=parse_date(end_date))

        return queryset.order_by("-date")
