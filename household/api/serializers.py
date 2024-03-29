from rest_framework import serializers
from household.models import (
    Household,
    HouseholdOwner,
    HouseholdUser,
)
from accounts.models import User, UserProfile
from phonenumber_field.phonenumber import to_python


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude = ("user", "date_updated", "date_created", "id")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = (
            "password",
            "groups",
            "user_permissions",
            "is_verified",
            "is_active",
            "is_staff",
            "is_superuser",
            "id",
        )


class HouseholdUserListSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = HouseholdUser
        exclude = ("organization", "modified")


class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        fields = "__all__"
        read_only_fields = ("slug",)
    def validate_phone_number(self, data):
        phone_number = to_python(data)
        if phone_number and not phone_number.is_valid():
            serializers.ValidationError("Enter a valid phone number.")
        return phone_number


class HouseholdOwnerSerializer(serializers.Serializer):
    username = serializers.CharField(style={"placeholder": "Username"})

    def validate_username(self, username):
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User doesn't exist")
        return username

    def create(self, validated_data):
        user = User.objects.get(username=validated_data.get("username"))
        if not HouseholdUser.objects.filter(
            user=user, organization=self.context.get("organisation")
        ).exists():
            try:
                household_user = HouseholdUser.objects.create(
                    user=user, organization=self.context.get("organisation")
                )
            except:
                raise serializers.ValidationError(
                    "Failed to add organisation user"
                )
        else:
            household_user = HouseholdUser.objects.get(
                user_id=user, organization=self.context.get("organisation")
            )

        HouseholdOwner.objects.create(
            organization=self.context.get("organisation"),
            organization_user=household_user,
        )
        return {
            "username": validated_data.get("username"),
            "detail": "owner added successfully",
        }


class HouseholdUserSerializer(serializers.Serializer):
    username = serializers.CharField(style={"placeholder": "Username"})

    def validate_username(self, username):
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User doesn't exist")
        return username

    def create(self, validated_data):
        user = User.objects.get(username=validated_data.get("username"))
        if not HouseholdUser.objects.filter(
            user=user, organization=self.context.get("organisation")
        ).exists():
            try:
                HouseholdUser.objects.create(
                    user=user, organization=self.context.get("organisation")
                )
            except:
                raise serializers.ValidationError(
                    "Failed to add organisation user"
                )
        else:
            raise serializers.ValidationError("User already exists")
        return {
            "username": validated_data.get("username"),
            "detail": "owner added successfully",
        }