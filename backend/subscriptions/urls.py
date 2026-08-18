from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    SubscriptionViewSet,
    auth_csrf,
    login_view,
    logout_view,
    me_view,
    register_view,
    subscription_metrics,
    user_preferences_view,
)

router = DefaultRouter()
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('auth/csrf/', auth_csrf, name='auth-csrf'),
    path('auth/register/', register_view, name='auth-register'),
    path('auth/login/', login_view, name='auth-login'),
    path('auth/logout/', logout_view, name='auth-logout'),
    path('auth/me/', me_view, name='auth-me'),
    path('subscriptions/metrics/', subscription_metrics, name='subscription-metrics'),
    path('preferences/', user_preferences_view, name='user-preferences'),
    path('', include(router.urls)),
]
