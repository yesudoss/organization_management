from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.views import TokenVerifyView
from .views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'organization', OrganizationViewSet)
router.register(r'register', UserRegistrationViewSet, basename='user-registration')
router.register(r'organization-private', OrganizationPrivateViewSet)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('verify-access-code/', VerifyAccessCodeView.as_view(), name='verify-access-code'),
    path('update-password/', UpdatePasswordView.as_view(), name='update-password'),
    path('', include(router.urls))

]
