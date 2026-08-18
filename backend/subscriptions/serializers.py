from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q
from rest_framework import serializers

from .models import Subscription, UserPreferences

User = get_user_model()


class SubscriptionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')

    class Meta:
        model = Subscription
        fields = [
            'id',
            'owner',
            'name',
            'category',
            'amount',
            'currency',
            'billing_cycle',
            'next_billing_date',
            'status',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['owner']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Subscription amount must be greater than zero.")
        return value


class UserPreferencesSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = UserPreferences
        fields = [
            'id',
            'user',
            'monthly_budget',
            'currency',
            'renewal_reminder_days',
            'dark_mode',
            'updated_at',
        ]
        read_only_fields = ['user']


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=True, trim_whitespace=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        existing = User.objects.filter(Q(username=data['email']) | Q(email__iexact=data['email'])).first()
        if existing:
            raise serializers.ValidationError({'email': 'An account with this email already exists.'})

        try:
            validate_password(data['password'])
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)}) from exc

        return data

    def create(self, validated_data):
        name = validated_data.pop('name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')

        username_base = (email.split('@')[0] or 'user').strip() or 'user'
        username = username_base
        index = 1
        while User.objects.filter(username=username).exists():
            username = f'{username_base}{index}'
            index += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name.strip().split(' ')[0] if name.strip() else '',
            last_name=' '.join(name.strip().split(' ')[1:]) if name.strip() else '',
        )
        return user


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
