from typing import List

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import Signal
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

# Create your models here.


def upload_profile_image(instance, filename):
    return f"profile/{instance.user}/{filename}"


user_deleted = Signal()


class DeleteError(Exception):
    pass


class UserManager(BaseUserManager):
    def __create_user(
        self,
        email,
        username,
        password,
        is_staff,
        is_superuser,
        is_verified,
    ):
        if not email:
            raise ValueError("Users must have an email")
        if not password:
            raise ValueError("Users must have an password")
        if not username:
            raise ValueError("User must have a username")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            is_staff=is_staff,
            is_superuser=is_superuser,
            is_verified=is_verified,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, username, password, is_staff):
        """
        Creates and saves a User with the given email, and password.
        """
        return self.__create_user(email, username, password, is_staff, False, False)

    def create_superuser(self, email, username, password):
        return self.__create_user(email, username, password, True, True, True)

    def delete_user(self, user_obj):
        user_obj.is_active = False
        user_obj.save()

        user_deleted.send(sender=self.__class__, user=user_obj)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        _("Email Address"),
        unique=True,
        db_index=True,
    )
    username = models.CharField(
        _("Username"),
        max_length=120,
        unique=True,
        blank=True,
        null=True,
        default=None,
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    is_verified = models.BooleanField(_("verified"), default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: List[str] = ["username"]
    history = HistoricalRecords()
    objects = UserManager()

    def __str__(self):
        return str(self.email)

    def has_verified_email(self):
        return self.is_verified

    def delete(self, force_drop=False, *args, **kwargs):
        if force_drop:
            super().delete(*args, **kwargs)
        else:
            raise DeleteError(
                "UserProfile.objects.delete_user() should be used.",
            )

    def get_short_name(self):
        return self.email

    def get_full_name(self):
        """Return string representation."""
        return str(self)


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, related_name="user_profile", on_delete=models.CASCADE
    )
    phone_number = PhoneNumberField(
        _("Phone Number"), unique=True, blank=True, null=True, default=None
    )
    firstname = models.CharField(_("First Name"), max_length=120)
    lastname = models.CharField(_("Last Name"), max_length=120)
    image = ProcessedImageField(
        upload_to=upload_profile_image,
        processors=[ResizeToFill(180, 180)],
        format="JPEG",
        options={"quality": 60},
        null=True,
        blank=True,
    )
    history = HistoricalRecords()
    date_created = models.DateTimeField(auto_now=True)
    date_updated = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "User Profiles"

    def __str__(self) -> str:
        return self.first_name + " " + self.last_name


class PasswordHistory(models.Model):
    user = models.ForeignKey(
        User,
        related_name="password_history",
        on_delete=models.CASCADE,
    )
    password = models.CharField(max_length=120)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Password History"

    def __str__(self) -> str:
        return str(self.user.email)


def create_profile(sender, instance, created, *args, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


post_save.connect(create_profile, sender=User)
