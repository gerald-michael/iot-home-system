from django.contrib.auth.models import Permission
from rest_framework import filters, generics, permissions, response, views

from accounts.api.serializers import (
    CustomRegisterSerializer,
    UserProfileUpdateSerializer,
    UserSerializer,
)
from accounts.models import User, UserProfile


class CanRegisterUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm("add_user")


class CanViewUserHistory(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm("view_historicaluser")


class UserDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        serializer = UserSerializer(user)
        return response.Response(serializer.data)


class UserUpdateView(generics.CreateAPIView):
    serializer_class = UserProfileUpdateSerializer

    def get_queryset(self):
        user = self.request.user
        return UserProfile.objects.filter(user=user)


class UserView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "username",
        "email",
        "user_profile__lastname",
        "user_profile__firstname",
        "user_profile__phone_number",
    ]
    ordering = ["username"]
    ordering_fields = "__all__"


class PermissionListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):

        if request.user.is_superuser:
            user_permissions = Permission.objects.all()
        else:
            user_permissions = (
                request.user.user_permissions.all()
                | Permission.objects.filter(group__user=request.user)
            )
        permissions_list = []
        for user_permission in user_permissions:
            permissions_list.append(user_permission.codename)
        return response.Response(permissions_list)


class RegisterView(generics.CreateAPIView):
    permission_classes = [CanRegisterUser]
    serializer_class = CustomRegisterSerializer
    queryset = User.objects.all()


class AllUserDetailView(generics.RetrieveAPIView):
    # permission_classes = [CanViewUserHistory]
    serializer_class = UserSerializer
    queryset = User.objects.all()
