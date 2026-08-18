from django.conf import settings
from django.db import models


class Subscription(models.Model):
    CATEGORY_CHOICES = [
        ('Software', 'Software'),
        ('Streaming', 'Streaming'),
        ('Infrastructure', 'Infrastructure'),
        ('Cloud', 'Cloud Services'),
        ('Utilities', 'Utilities'),
        ('Fitness', 'Fitness & Health'),
        ('Other', 'Other'),
    ]

    CYCLE_CHOICES = [
        ('Monthly', 'Monthly'),
        ('Yearly', 'Yearly'),
        ('Quarterly', 'Quarterly'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Upcoming', 'Upcoming'),
        ('Cancelled', 'Cancelled'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions',
    )
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Software')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    billing_cycle = models.CharField(max_length=20, choices=CYCLE_CHOICES, default='Monthly')
    next_billing_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['next_billing_date', 'name']

    def __str__(self):
        return f"{self.name} (${self.amount}/{self.billing_cycle})"


class UserPreferences(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='preferences',
    )
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    currency = models.CharField(max_length=10, default='USD')
    renewal_reminder_days = models.IntegerField(default=3)
    dark_mode = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User Preferences ({self.user.email or self.user.username}, {self.currency}, Budget: {self.monthly_budget})"
