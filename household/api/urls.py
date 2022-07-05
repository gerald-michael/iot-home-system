from django.contrib.auth.decorators import login_required
from django.urls import include
from django.urls import path
from organisation.api.views import OrganisationListView, OrganisationDetailView, OrganisationDeleteView, OrganisationUserList, OrganisationProfileView, OrganisationOwnerView, OrganisationUserAddView, OrganisationalUserCount
from organizations.views import default as views

urlpatterns = [
    path(
        "",
        view=OrganisationListView.as_view(),
        name="organization_list",
    ),
    path(
        "<slug>/",
        include(
            [
                path(
                    "",
                    OrganisationDetailView.as_view(),
                    name="organization_detail",
                ),
                path(
                    "delete/",
                    view=OrganisationDeleteView.as_view(),
                    name="organization_delete",
                ),
                path("message/", include('message.api.urls')),
                path("subscription/", include('subscribers.api.urls')),
                path("profile/", OrganisationProfileView.as_view()),
                path(
                    "users/",
                    include(
                        [
                            path(
                                "",
                                OrganisationUserList.as_view(),
                                name="organization_user_list",
                            ),
                            path(
                                "owner/",
                                OrganisationOwnerView.as_view(),
                                name="organization_owner"
                            ),
                            path(
                                "add/",
                                view=OrganisationUserAddView.as_view(),
                                name="organization_user_add",
                            ),
                            path(
                                "count/",
                                view=OrganisationalUserCount.as_view(),
                                name="organisation_user_count"
                            ),
                            path(
                                "<int:user_pk>/remind/",
                                view=login_required(
                                    views.OrganizationUserRemind.as_view()
                                ),
                                name="organization_user_remind",
                            ),
                            path(
                                "<int:user_pk>/",
                                view=login_required(
                                    views.OrganizationUserDetail.as_view()
                                ),
                                name="organization_user_detail",
                            ),
                            path(
                                "<int:user_pk>/edit/",
                                view=login_required(
                                    views.OrganizationUserUpdate.as_view()
                                ),
                                name="organization_user_edit",
                            ),
                            path(
                                "<int:user_pk>/delete/",
                                view=login_required(
                                    views.OrganizationUserDelete.as_view()
                                ),
                                name="organization_user_delete",
                            ),
                        ]
                    ),
                ),
            ]
        ),
    ),
]
