# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from .models import *
from .serializers import *


# class UserViewSet(viewsets.ModelViewSet):
#     authentication_classes = [TokenAuthentication]
#     # permission_classes = [IsAuthenticated]
#
#     queryset = CustomUser.objects.all()
#     serializer_class = UserSerializer


# from rest_framework.decorators import authentication_classes, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.authentication import JWTAuthentication
#
#
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
# class UserViewSet(APIView):
#     queryset = CustomUser.objects.all()
#     serializer_class = UserSerializer

from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer



from .serializers import UserRegistrationSerializer

class UserRegistrationViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    queryset = CustomUser.objects.all()


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
