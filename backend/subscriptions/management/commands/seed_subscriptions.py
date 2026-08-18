from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from subscriptions.models import Subscription, UserPreferences

User = get_user_model()


class Command(BaseCommand):
    help = 'Idempotently seeds realistic demo subscriptions for SPENDR'

    def handle(self, *args, **options):
        today = date.today()

        demo_email = 'demo@spendr.app'
        demo_user, created = User.objects.get_or_create(
            email=demo_email,
            defaults={
                'username': 'spendr-demo',
                'first_name': 'Demo',
                'last_name': 'User',
            },
        )
        if created:
            demo_user.set_password('demo12345')
            demo_user.save()

        pref, _ = UserPreferences.objects.get_or_create(user=demo_user)
        pref.monthly_budget = Decimal('750.00')
        pref.currency = 'USD'
        pref.renewal_reminder_days = 3
        pref.dark_mode = True
        pref.save()

        demo_data = [
            {
                'name': 'Netflix',
                'category': 'Streaming',
                'amount': Decimal('15.99'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=3),
                'status': 'Active',
                'notes': 'Standard HD streaming plan.'
            },
            {
                'name': 'AWS Cloud',
                'category': 'Cloud',
                'amount': Decimal('48.50'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=5),
                'status': 'Active',
                'notes': 'Production EC2 & S3 storage.'
            },
            {
                'name': 'Figma Pro',
                'category': 'Software',
                'amount': Decimal('15.00'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=10),
                'status': 'Active',
                'notes': 'Editor seat subscription.'
            },
            {
                'name': 'OpenAI API',
                'category': 'Software',
                'amount': Decimal('32.00'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=14),
                'status': 'Active',
                'notes': 'ChatGPT Plus & developer API usage.'
            },
            {
                'name': 'Spotify',
                'category': 'Streaming',
                'amount': Decimal('11.99'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=18),
                'status': 'Active',
                'notes': 'Music Premium subscription.'
            },
            {
                'name': 'GitHub Enterprise',
                'category': 'Software',
                'amount': Decimal('21.00'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=22),
                'status': 'Active',
                'notes': 'Team plan & Copilot seat.'
            },
            {
                'name': 'Google Workspace',
                'category': 'Software',
                'amount': Decimal('18.00'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=26),
                'status': 'Upcoming',
                'notes': 'Business Starter workspace seat.'
            },
            {
                'name': 'Adobe Creative Cloud',
                'category': 'Software',
                'amount': Decimal('59.99'),
                'currency': 'USD',
                'billing_cycle': 'Monthly',
                'next_billing_date': today + timedelta(days=30),
                'status': 'Active',
                'notes': 'All Apps creative suite.'
            },
        ]

        demo_names = [item['name'] for item in demo_data]
        Subscription.objects.filter(owner=demo_user).exclude(name__in=demo_names).delete()
        Subscription.objects.exclude(name__in=demo_names).delete()

        created_count = 0
        updated_count = 0

        for item in demo_data:
            obj, created = Subscription.objects.update_or_create(
                owner=demo_user,
                name=item['name'],
                defaults=item,
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Idempotent seed completed: {created_count} created, {updated_count} updated. Total demo items: {Subscription.objects.filter(owner=demo_user).count()}'
        ))
