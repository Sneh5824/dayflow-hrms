from django.db import models
from django.conf import settings


class Leave(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    LEAVE_TYPE_CHOICES = [
        ("CASUAL", "Casual Leave"),
        ("SICK", "Sick Leave"),
        ("PAID", "Paid Leave"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="leaves",
    )
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} | {self.leave_type} | {self.status}"
