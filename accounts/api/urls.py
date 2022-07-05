from django.urls import include, path, re_path
from rest_auth.registration.views import VerifyEmailView

from accounts.api.views import *

urlpatterns = [
    path("", UserView.as_view()),
    path("<int:pk>/", AllUserDetailView.as_view(), name="user_detail"),
    path("auth/", include("rest_auth.urls")),
    path("detail/", UserDetailView.as_view(), name="detail"),
    path("profile/", UserUpdateView.as_view(), name="profile"),
    path("register/", RegisterView.as_view(), name="profile"),
    # re_path(
    #     r"^rest-auth/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$",
    #     PasswordResetConfirmView.as_view(),
    #     name="password_reset_confirm",
    # ),
    re_path(
        r"^account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    path(
        "account-confirm-email/<key>/",
        VerifyEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("permissions/", PermissionListView.as_view(), name="permissions"),
]
