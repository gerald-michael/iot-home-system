from rest_framework import serializers
from organizations.models import (
    Organization,
    OrganizationUser,
    OrganizationOwner,
)
from accounts.models import User, UserProfile
from phonenumber_field.phonenumber import to_python
from household.models import OrganisationProfile


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


class OrganisationUserListSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = OrganizationUser
        exclude = ("organization", "modified")


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"
        read_only_fields = ("slug",)


class OrganisationOwnerSerializer(serializers.Serializer):
    username = serializers.CharField(style={"placeholder": "Username"})

    def validate_username(self, username):
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User doesn't exist")
        return username

    def create(self, validated_data):
        user = User.objects.get(username=validated_data.get("username"))
        if not OrganizationUser.objects.filter(
            user=user, organization=self.context.get("organisation")
        ).exists():
            try:
                organization_user = OrganizationUser.objects.create(
                    user=user, organization=self.context.get("organisation")
                )
            except:
                raise serializers.ValidationError(
                    "Failed to add organisation user"
                )
        else:
            organization_user = OrganizationUser.objects.get(
                user_id=user, organization=self.context.get("organisation")
            )

        OrganizationOwner.objects.create(
            organization=self.context.get("organisation"),
            organization_user=organization_user,
        )
        return {
            "username": validated_data.get("username"),
            "detail": "owner added successfully",
        }


class OrganisationUserSerializer(serializers.Serializer):
    username = serializers.CharField(style={"placeholder": "Username"})

    def validate_username(self, username):
        if not User.objects.filter(username=username).exists():
            raise serializers.ValidationError("User doesn't exist")
        return username

    def create(self, validated_data):
        user = User.objects.get(username=validated_data.get("username"))
        if not OrganizationUser.objects.filter(
            user=user, organization=self.context.get("organisation")
        ).exists():
            try:
                OrganizationUser.objects.create(
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


class OrganisationProfileSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        max_length=120, required=False, style={"placeholder": "Phone Number"}
    )
    logo = serializers.ImageField(
        required=False,
    )
    email = serializers.EmailField(style={"placeholder": "Email"})
    address = serializers.CharField(
        max_length=120, style={"placeholder": "Address"}
    )
    instance_id = serializers.CharField(
        max_length=120, style={"placeholder": "Instance Id"}
    )
    token = serializers.CharField(
        max_length=120, style={"placeholder": "Token"}
    )
    lat = serializers.DecimalField(
        max_digits=22, decimal_places=16, style={"placeholder": "Lattitude"}
    )
    long = serializers.DecimalField(
        max_digits=22, decimal_places=16, style={"placeholder": "Longitude"}
    )
    description = serializers.CharField(
        max_length=500, style={"placeholder": "Description"}
    )

    def validate_phone_number(self, data):
        phone_number = to_python(data)
        if phone_number and not phone_number.is_valid():
            serializers.ValidationError("Enter a valid phone number.")
        return phone_number

    def create(self, validated_data):
        organisation = self.context.get("organisation")
        organisation_profile = OrganisationProfile.objects.get(
            organisation=organisation
        )
        if validated_data.get("email"):
            organisation_profile.email = validated_data.get("email")
        if validated_data.get("lat"):
            organisation_profile.lat = validated_data.get("lat")
        if validated_data.get("long"):
            organisation_profile.long = validated_data.get("long")
        if validated_data.get("phone_number"):
            organisation_profile.phone_number = validated_data.get(
                "phone_number"
            )
        if validated_data.get("logo"):
            organisation_profile.logo = validated_data.get("logo")
        if validated_data.get("address"):
            organisation_profile.address = validated_data.get("address")
        if validated_data.get("description"):
            organisation_profile.description = validated_data.get(
                "description"
            )
        if validated_data.get("token"):
            organisation_profile.token = validated_data.get("token")
        if validated_data.get("instance_id"):
            organisation_profile.instance_id = validated_data.get(
                "instance_id"
            )
        organisation_profile.save()
        return organisation_profile
