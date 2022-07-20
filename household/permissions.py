from organizations.models import Organization
from rest_framework import permissions


class HouseholdUsersOnly(permissions.BasePermission):
    message = "Access for only organizational users"

    def has_permission(self, request, view):
        organization = Organization.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if organization.is_member(request.user):
            return True


class HouseholdAdminOnly(permissions.BasePermission):
    message = "Access for only organizational admins"

    def has_permission(self, request, view):
        organization = Organization.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if organization.is_admin(request.user):
            return True


class HouseholdOwnerOnly(permissions.BasePermission):
    message = "Access for only organizational owner"

    def has_permission(self, request, view):
        organization = Organization.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if organization.is_owner(request.user):
            return True


class HouseholdAdminOrReadOnly(permissions.BasePermission):
    message = "Access for only organizational owner"

    def has_permission(self, request, view):
        organization = Organization.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if request.method in permissions.SAFE_METHODS and (
            organization.is_member(request.user)
            | organization.is_admin(request.user)
            | organization.is_owner(request.user)
        ):
            return True
        if organization.is_owner(request.user) | organization.is_admin(
            request.user
        ):
            return True


class HouseholdOwnerReadOnly(permissions.BasePermission):
    message = "Access for only organizational owner"

    def has_permission(self, request, view):
        organization = Organization.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if request.method in permissions.SAFE_METHODS and (
            organization.is_member(request.user)
            | organization.is_admin(request.user)
        ):
            return True
        if organization.is_owner(request.user):
            return True


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_staff
