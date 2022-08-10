from household.models import Household
from rest_framework import permissions


class HouseholdUsersOnly(permissions.BasePermission):
    message = "Access for only householdal users"

    def has_permission(self, request, view):
        household = Household.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if household.is_member(request.user):
            return True


class HouseholdAdminOnly(permissions.BasePermission):
    message = "Access for only householdal admins"

    def has_permission(self, request, view):
        household = Household.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if household.is_admin(request.user):
            return True


class HouseholdOwnerOnly(permissions.BasePermission):
    message = "Access for only householdal owner"

    def has_permission(self, request, view):
        household = Household.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if household.is_owner(request.user):
            return True


class HouseholdAdminOrReadOnly(permissions.BasePermission):
    message = "Access for only householdal owner"

    def has_permission(self, request, view):
        household = Household.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if request.method in permissions.SAFE_METHODS and (
            household.is_member(request.user)
            | household.is_admin(request.user)
            | household.is_owner(request.user)
        ):
            return True
        if household.is_owner(request.user) | household.is_admin(
            request.user
        ):
            return True


class HouseholdOwnerReadOnly(permissions.BasePermission):
    message = "Access for only household owner"

    def has_permission(self, request, view):
        household = Household.objects.get(
            slug=request.resolver_match.kwargs["slug"]
        )
        if request.method in permissions.SAFE_METHODS and (
            household.is_member(request.user)
            | household.is_admin(request.user)
        ):
            return True
        if household.is_owner(request.user):
            return True


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_staff
