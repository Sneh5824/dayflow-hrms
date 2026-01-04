from django.db import models
from accounts.models import User


class EmployeeProfile(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    
    MARITAL_STATUS_CHOICES = (
        ('SINGLE', 'Single'),
        ('MARRIED', 'Married'),
        ('DIVORCED', 'Divorced'),
        ('WIDOWED', 'Widowed'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Basic Info
    department = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    
    # Private Info
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    marital_status = models.CharField(max_length=10, choices=MARITAL_STATUS_CHOICES, blank=True)
    personal_email = models.EmailField(blank=True)
    mailing_address = models.TextField(blank=True)
    permanent_address = models.TextField(blank=True)
    
    # Bank Details
    bank_name = models.CharField(max_length=100, blank=True)
    account_number = models.CharField(max_length=20, blank=True)
    ifsc_code = models.CharField(max_length=15, blank=True)
    pan_number = models.CharField(max_length=15, blank=True)
    uan_number = models.CharField(max_length=20, blank=True)
    
    # Resume/About
    about = models.TextField(blank=True)
    skills = models.TextField(blank=True)  # Comma-separated skills
    certifications = models.TextField(blank=True)
    interests = models.TextField(blank=True)
    
    # Manager
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="subordinates")
    location = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

