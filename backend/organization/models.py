from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


ORG_TYPE_CHOICES = [('company', 'Company'), ('non-profit', 'Non-Profit'), ('educational', 'Educational Institution'),
                    ('other', 'Other')]


class Organization(models.Model):
    name = models.CharField(max_length=255)
    org_type = models.CharField(_("Organization Type"), max_length=255, choices=ORG_TYPE_CHOICES, default='other')
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to='logos', blank=True)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("Email"), unique=True)
    profile = models.ImageField(upload_to='profile', blank=True, null=True)
    organization = models.ForeignKey(Organization, verbose_name=_("Organization"), null=True, blank=True,
                                     on_delete=models.CASCADE)
    mobile = models.CharField(_("Mobile Number"), max_length=20)
    verification_code = models.CharField(_("Verification Code"), max_length=6, default="", null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email