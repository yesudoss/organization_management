from rest_framework import serializers
from .models import *
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
import random
from django.core.mail import send_mail
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.base import ContentFile
import base64
from django.conf import settings


class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.ReadOnlyField(source='organization.name')
    class Meta:
        model = CustomUser
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class OrganizationPrivateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    organization_name = serializers.ReadOnlyField(source='organization.name')
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})
    first_name = serializers.CharField(max_length=50, required=True)
    last_name = serializers.CharField(max_length=50, required=False, allow_null=True)
    email = serializers.EmailField(required=True)
    mobile = serializers.CharField(max_length=25, required=False, allow_null=True)
    profile_url = serializers.CharField(max_length=None, required=False)

    class Meta:
        model = CustomUser
        fields = '__all__'

    def update(self, instance, validated_data):
        if validated_data.get('email') and CustomUser.objects.filter(email=validated_data.get('email')).exclude(id=instance.id).exists():
            return serializers.ValidationError("Email already exists. Please use a different email.")
        direct_fields = ['first_name', 'last_name', 'email', 'mobile', 'organization']
        if validated_data.get('profile_url'):
            format, imgstr = str(validated_data.get('profile_url')).split(';base64,')
            instance.profile = ContentFile(base64.b64decode(imgstr), name='profile.jpg')
        for df in direct_fields:
            if validated_data.get(df):
                setattr(instance, df, validated_data[df])
        instance.save()
        return instance

    def create(self, validated_data):
        if validated_data.get('email') and CustomUser.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError("Email already exists. Please use a different email.")
        user = CustomUser.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'] if validated_data.get('last_name') else "",
            email=validated_data['email'],
            password=validated_data['password'],
            organization=validated_data['organization'],
        )
        if validated_data.get('mobile'):
            user.mobile = validated_data['mobile']
        user.save()
        try:
            otp = random.randint(111111, 999999)
            setattr(user, 'verification_code',otp)
            user.save()
            send_mail(
                'Verify Your Email',
                'Dear %s,  Please use %d number as your account verification code:' % (user.first_name, otp),
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            pass
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    organization_name = serializers.ReadOnlyField(source='organization.name')
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializer(self.user).data
        if serializer.get('profile'):
            serializer['profile'] = 'http://localhost:8000'+serializer['profile']
        data.update({'user': serializer})
        return data
