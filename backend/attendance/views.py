from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer

class CheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        attendance, created = Attendance.objects.get_or_create(
            user=request.user, date=today
        )

        if attendance.check_in:
            return Response({"detail": "Already checked in"}, status=400)

        attendance.check_in = timezone.now().time()
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)


class CheckOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        try:
            attendance = Attendance.objects.get(user=request.user, date=today)
        except Attendance.DoesNotExist:
            return Response({"detail": "Check-in first"}, status=400)

        if attendance.check_out:
            return Response({"detail": "Already checked out"}, status=400)

        attendance.check_out = timezone.now().time()
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)
