from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from rest_framework import viewsets, status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from .serializers import *
from .serializers import CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class OrganizationPrivateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserRegistrationSerializer
    queryset = CustomUser.objects.all()


class UserRegistrationViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    queryset = CustomUser.objects.all()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class VerifyAccessCodeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        if request.data.get('access_code') and request.data.get('email'):
            user = CustomUser.objects.filter(verification_code=request.data['access_code'], email=request.data['email']).first()
            if user:
                setattr(user, 'is_verified', True)
                user.save()
                return Response(status=status.HTTP_200_OK)
            return Response({'error_message': "Access code doesn't match"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error_message': "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)


class UpdatePasswordView(APIView):
    def post(self, request, *args, **kwargs):
        if request.data.get('password') and request.data.get('email'):
            user = CustomUser.objects.filter(email=request.data['email']).first()
            if user:
                user.set_password(request.data['password'])
                user.save()
                return Response(status=status.HTTP_200_OK)
            return Response({'error_message': "Email doesn't match"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error_message': "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
