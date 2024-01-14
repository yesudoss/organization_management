from rest_framework import serializers
from .models import *
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    first_name = serializers.CharField(max_length=50, required=True)
    last_name = serializers.CharField(max_length=50, required=False, allow_null=True)
    email = serializers.EmailField(required=True)
    mobile = serializers.CharField(max_length=25, required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'password', 'mobile']

    def validate_email(self, value):
        """
        Check if the provided email already exists in the database.
        """
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists. Please use a different email.")
        return value
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'] if validated_data.get('last_name') else "",
            email=validated_data['email'],
            password=validated_data['password'],
        )
        if validated_data.get('mobile'):
            user.profile.mobile = validated_data['mobile']
            user.save()

        try:
            pass


            # token = default_token_generator.make_token(user)
            # uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            # from django.core.mail import send_mail
            # from django.urls import reverse
            # from django.conf import settings
            #
            # verification_url = reverse('verify_email', kwargs={'uidb64': uidb64, 'token': token})
            # full_url = f"{settings.BASE_URL}{verification_url}"
            #
            # send_mail(
            #     'Verify Your Email',
            #     f'Click the following link to verify your email: {full_url}',
            #     'from@example.com',
            #     [user.email],
            #     fail_silently=False,
            # )

        except Exception as e:
            print("------------------")
            print(e)
            print("------------------")
            pass
        return user

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializer(self.user).data
        data.update({'user': serializer})
        return data
