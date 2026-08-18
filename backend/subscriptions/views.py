from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db.models import Q
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Subscription, UserPreferences
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    SubscriptionSerializer,
    UserPreferencesSerializer,
)

User = get_user_model()


class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Subscription.objects.filter(owner=self.request.user)
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        sub_status = self.request.query_params.get('status', None)
        ordering = self.request.query_params.get('ordering', None)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(category__icontains=search) | Q(notes__icontains=search)
            )

        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)

        if sub_status and sub_status.lower() != 'all':
            queryset = queryset.filter(status__iexact=sub_status)

        if ordering:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('next_billing_date', 'name')

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscription_metrics(request):
    all_subs = Subscription.objects.filter(owner=request.user)
    active_subs = all_subs.filter(status='Active')

    total_monthly_spend = Decimal('0.00')
    for sub in all_subs:
        if sub.status in ['Active', 'Upcoming']:
            if sub.billing_cycle == 'Monthly':
                total_monthly_spend += sub.amount
            elif sub.billing_cycle == 'Yearly':
                total_monthly_spend += (sub.amount / Decimal('12.0'))
            elif sub.billing_cycle == 'Quarterly':
                total_monthly_spend += (sub.amount / Decimal('3.0'))

    total_monthly_spend = round(total_monthly_spend, 2)
    annual_projection = round(total_monthly_spend * Decimal('12.0'), 2)
    active_count = active_subs.count()

    today = date.today()
    next_7_days = today + timedelta(days=7)
    upcoming_count = all_subs.filter(
        next_billing_date__gte=today,
        next_billing_date__lte=next_7_days,
    ).count()

    cat_totals = {}
    for sub in all_subs:
        if sub.status in ['Active', 'Upcoming']:
            m_cost = sub.amount
            if sub.billing_cycle == 'Yearly':
                m_cost = sub.amount / Decimal('12.0')
            elif sub.billing_cycle == 'Quarterly':
                m_cost = sub.amount / Decimal('3.0')
            cat_totals[sub.category] = cat_totals.get(sub.category, Decimal('0.00')) + m_cost

    category_distribution = []
    for cat, val in cat_totals.items():
        val = round(val, 2)
        pct = round((val / total_monthly_spend * Decimal('100.0')), 1) if total_monthly_spend > 0 else Decimal('0.0')
        category_distribution.append({
            'category': cat,
            'amount': float(val),
            'percentage': float(pct),
        })

    category_distribution.sort(key=lambda x: x['amount'], reverse=True)

    months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
    base_val = float(total_monthly_spend)
    trend_data = []
    multipliers = [0.85, 0.90, 0.94, 0.98, 1.0, 1.05]
    for mult in multipliers:
        trend_data.append({
            'month': months[len(trend_data)],
            'amount': round(base_val * mult, 2) if base_val > 0 else 0,
        })

    due_soon_qs = all_subs.filter(next_billing_date__gte=today).order_by('next_billing_date')[:5]
    due_soon_list = SubscriptionSerializer(due_soon_qs, many=True).data

    top_impact_qs = sorted(
        list(all_subs),
        key=lambda s: (s.amount if s.billing_cycle == 'Monthly' else (s.amount / 12 if s.billing_cycle == 'Yearly' else s.amount / 3)),
        reverse=True,
    )[:3]
    top_impact_list = SubscriptionSerializer(top_impact_qs, many=True).data

    pref, _ = UserPreferences.objects.get_or_create(user=request.user)

    return Response({
        'monthly_spend': float(total_monthly_spend),
        'annual_projection': float(annual_projection),
        'active_count': active_count,
        'upcoming_count': upcoming_count,
        'monthly_budget': float(pref.monthly_budget),
        'remaining_budget': float(round(pref.monthly_budget - total_monthly_spend, 2)),
        'category_distribution': category_distribution,
        'spending_trend': trend_data,
        'due_soon_subscriptions': due_soon_list,
        'top_impact_subscriptions': top_impact_list,
    })


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_preferences_view(request):
    pref, _ = UserPreferences.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = UserPreferencesSerializer(pref)
        return Response(serializer.data)

    serializer = UserPreferencesSerializer(pref, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
@csrf_protect
def auth_csrf(request):
    return Response({'csrfToken': get_token(request)})


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_protect
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            login(request, user)
            user_payload = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'name': f'{user.first_name} {user.last_name}'.strip() or user.username,
            }
            return Response({'user': user_payload}, status=status.HTTP_201_CREATED)
        except Exception:
            return Response({'detail': 'Unable to create your account right now. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_protect
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    identifier = serializer.validated_data['identifier']
    password = serializer.validated_data['password']

    user_obj = User.objects.filter(email__iexact=identifier).first() or User.objects.filter(username=identifier).first()
    if user_obj is None:
        return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(request, username=user_obj.username, password=password)
    if user is None:
        return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'name': f'{user.first_name} {user.last_name}'.strip() or user.username,
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_protect
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'name': f'{user.first_name} {user.last_name}'.strip() or user.username,
    })
