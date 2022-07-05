import re

from allauth.account.adapter import get_adapter
from django.conf import settings
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from phonenumber_field.phonenumber import to_python
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from accounts.models import *


class HistoricalRecordField(serializers.ListField):
    child = serializers.DictField()

    def to_representation(self, data):
        return super().to_representation(data.values())


class UserProfileSerializer(serializers.ModelSerializer):
    history = HistoricalRecordField(read_only=True)

    class Meta:
        model = UserProfile
        fields = (
            "image",
            "firstname",
            "lastname",
            "phone_number",
            "history",
        )


class UserProfileUpdateSerializer(serializers.Serializer):
    firstname = serializers.CharField(
        max_length=120, required=False, style={"placeholder": "First Name"}
    )
    lastname = serializers.CharField(
        max_length=120, required=False, style={"placeholder": "Last Name"}
    )
    phone_number = serializers.CharField(
        max_length=120, required=False, style={"placeholder": "Phone Number"}
    )
    image = serializers.ImageField(
        required=False,
    )

    def validate_phone_number(self, data):
        phone_number = to_python(data)
        if phone_number and not phone_number.is_valid():
            serializers.ValidationError("Enter a valid phone number.")
        return phone_number

    def create(self, validated_data):
        request = self.context.get("request", None)
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        if validated_data.get("firstname"):
            user_profile.firstname = validated_data.get("firstname")
        if validated_data.get("lastname"):
            user_profile.lastname = validated_data.get("lastname")
        if validated_data.get("image"):
            user_profile.image = validated_data.get("image")
        if validated_data.get("phone_number"):
            user_profile.phone_number = validated_data.get("phone_number")
        user_profile.save()
        return user_profile


class UserSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer()
    history = HistoricalRecordField(read_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "id",
            "user_profile",
            "username",
            "date_joined",
            "last_login",
            "is_staff",
            "history",
        ]


class TokenSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    password_change_required = serializers.SerializerMethodField()

    class Meta:
        model = Token
        fields = ("key", "user", "password_change_required")

    def get_user(self, obj):
        serializer_data = UserSerializer(obj.user).data
        return serializer_data

    def get_password_change_required(self, obj):
        newest = (
            PasswordHistory.objects.filter(Q(user=obj.user))
            .order_by("date_created")
            .last()
        )
        expiry_date = timezone.now() - timezone.timedelta(
            days=settings.PASSWORD_EXPIRY_DAYS
        )
        if newest.date_created > expiry_date:
            return False
        return True


class CustomLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(style={"placeholder": "Email"})
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password", "placeholder": "Password"},
    )

    def get_cleaned_data(self):
        return {
            "email": self.validated_data.get("email", ""),
            "password": self.validated_data.get("password", ""),
        }

    def validate_password(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if not data["email"]:
            raise serializers.ValidationError(_("Email is required"))

        if not data["password"]:
            raise serializers.ValidationError(_("Password is required"))

        user = authenticate(
            self.context["request"],
            email=data["email"],
            password=data["password"],
        )
        if not user:
            raise serializers.ValidationError(_("Username or password is incorrect"))
        data["user"] = user
        data["test"] = True

        return data


class CustomRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(
        style={"placeholder": "Email"},
    )
    username = serializers.CharField(
        max_length=120,
        style={"placeholder": "Username"},
    )
    password1 = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password", "placeholder": "Password"},
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password", "placeholder": "Confirm Password"},
    )

    def get_cleaned_data(self):
        return {
            "username": self.validated_data.get("username", ""),
            "password1": self.validated_data.get("password1", ""),
            "password2": self.validated_data.get("password2", ""),
            "email": self.validated_data.get("email", ""),
        }

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exist on the system")
        return email

    def validate_username(self, username):
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exist on the system")
        return username

    def validate_password1(self, password):
        if not re.findall(
            r"^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$", password
        ):
            raise serializers.ValidationError(
                "Password should be atleast 8, 1 uppercase, 1 lowercase, 1 number and 1 special character."
            )
        return password

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError(
                _("The two password fields didn't match.")
            )
        return data

    def save(self):
        self.cleaned_data = self.get_cleaned_data()
        email = self.cleaned_data.get("email")
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password1")
        user = User.objects.create_user(
            email=email, username=username, password=password, is_staff=False
        )
        PasswordHistory.objects.create(
            user=user,
            password=user.password,
        )
        return user


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        max_length=128,
        write_only=True,
        required=True,
        style={"input_type": "password", "placeholder": "Old Password"},
    )
    password1 = serializers.CharField(
        max_length=128,
        write_only=True,
        required=True,
        style={"input_type": "password", "placeholder": "Password"},
    )
    password2 = serializers.CharField(
        max_length=128,
        write_only=True,
        required=True,
        style={"input_type": "password", "placeholder": "Confirm Password"},
    )
    set_password_form_class = SetPasswordForm

    def validate_old_password(self, value):
        request = self.context.get("request")
        user = request.user
        if not user.check_password(value):
            err_msg = _(
                "Your old password was entered incorrectly. Please enter it again."
            )
            raise serializers.ValidationError(err_msg)
        return value

    def validate_password1(self, password1):
        request = self.context.get("request")
        user = request.user
        password_history = PasswordHistory.objects.filter(
            user=user,
        )
        for password_encoded in password_history.iterator():
            if check_password(password1, password_encoded.password):
                raise serializers.ValidationError("You cannot reuse old password")
        if not re.findall(
            r"^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$",
            password1,
        ):
            raise serializers.ValidationError(
                "Password should be atleast 8, 1 uppercase, 1 lowercase, 1 number and 1 special character."
            )
        return password1

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError(
                _("Password and Confirm password do not match.")
            )
        return data

    def save(self, **kwargs):
        request = self.context.get("request")
        user = request.user
        user.set_password(self.validated_data.get("password1", ""))
        user.save()
        PasswordHistory.objects.create(
            user=user,
            password=user.password,
        )
