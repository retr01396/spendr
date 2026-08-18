from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from subscriptions.models import Subscription, UserPreferences

User = get_user_model()


class AuthIsolationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_a = User.objects.create_user(
            username='alice',
            email='alice@example.com',
            password='password123',
            first_name='Alice',
            last_name='A',
        )
        self.user_b = User.objects.create_user(
            username='bob',
            email='bob@example.com',
            password='password456',
            first_name='Bob',
            last_name='B',
        )

        self.user_a_pref = UserPreferences.objects.create(user=self.user_a, monthly_budget=300)
        self.user_b_pref = UserPreferences.objects.create(user=self.user_b, monthly_budget=900)

        self.user_a_sub = Subscription.objects.create(
            owner=self.user_a,
            name='Netflix',
            category='Streaming',
            amount=15.99,
            currency='USD',
            billing_cycle='Monthly',
            next_billing_date='2026-08-20',
            status='Active',
            notes='Alice sub',
        )
        self.user_b_sub = Subscription.objects.create(
            owner=self.user_b,
            name='Spotify',
            category='Streaming',
            amount=12.99,
            currency='USD',
            billing_cycle='Monthly',
            next_billing_date='2026-08-21',
            status='Active',
            notes='Bob sub',
        )

    def test_register_works(self):
        response = self.client.post('/api/auth/register/', {
            'name': 'Charlie Smith',
            'email': 'charlie@example.com',
            'password': 'StrongPass123!',
            'confirm_password': 'StrongPass123!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='charlie@example.com').exists())

    def test_register_rejects_duplicate_email(self):
        response = self.client.post('/api/auth/register/', {
            'name': 'Alice Clone',
            'email': 'alice@example.com',
            'password': 'StrongPass123!',
            'confirm_password': 'StrongPass123!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('An account with this email already exists.', str(response.data['email']))

    def test_register_rejects_weak_password(self):
        response = self.client.post('/api/auth/register/', {
            'name': 'Weak Password User',
            'email': 'weak@example.com',
            'password': 'password123',
            'confirm_password': 'password123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_works(self):
        response = self.client.post('/api/auth/login/', {
            'identifier': 'alice@example.com',
            'password': 'password123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)

    def test_logout_works(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me_works(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'alice@example.com')

    def test_unauthenticated_subscription_access_is_rejected(self):
        response = self.client.get('/api/subscriptions/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_a_cannot_see_user_b_subscriptions(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get('/api/subscriptions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [item['name'] for item in response.data]
        self.assertIn('Netflix', names)
        self.assertNotIn('Spotify', names)

    def test_user_a_cannot_edit_user_b_subscriptions(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.patch(f'/api/subscriptions/{self.user_b_sub.id}/', {'notes': 'hacked'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_a_cannot_delete_user_b_subscriptions(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.delete(f'/api/subscriptions/{self.user_b_sub.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_creating_subscription_assigns_request_user(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.post('/api/subscriptions/', {
            'name': 'Notion',
            'category': 'Software',
            'amount': '9.99',
            'currency': 'USD',
            'billing_cycle': 'Monthly',
            'next_billing_date': '2026-08-25',
            'status': 'Active',
            'notes': 'Team plan',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['owner'], self.user_a.id)
        self.assertEqual(Subscription.objects.filter(owner=self.user_a, name='Notion').count(), 1)

    def test_metrics_only_for_authenticated_user(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get('/api/subscriptions/metrics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['monthly_spend'], 15.99)

    def test_preferences_are_user_specific(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get('/api/preferences/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['monthly_budget'], '300.00')

    def test_seeded_demo_data_remains_available(self):
        self.assertTrue(Subscription.objects.filter(name='Netflix').exists())
        self.assertTrue(User.objects.filter(email='alice@example.com').exists())
