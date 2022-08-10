# from django.contrib.auth.decorators import login_required
# from django.urls import include
from django.urls import path, include
from household.api.views import (
    HouseholdListView,
    HouseholdDetailView,
    HouseholdDeleteView,
    HouseholdUserList,
    HouseholdOwnerView,
    HouseholdUserAddView,
    HouseholdUserCount,
)

# from organizations.views import default as views

urlpatterns = [
    path(
        "",
        view=HouseholdListView.as_view(),
        name="household_list",
    ),
    path(
        "<slug>/",
        include(
            [
                path(
                    "",
                    HouseholdDetailView.as_view(),
                    name="household_detail",
                ),
                path(
                    "delete/",
                    view=HouseholdDeleteView.as_view(),
                    name="household_delete",
                ),
                path("device/", include("devices.api.urls")),
                path(
                    "users/",
                    include(
                        [
                            path(
                                "",
                                HouseholdUserList.as_view(),
                                name="household_user_list",
                            ),
                            path(
                                "owner/",
                                HouseholdOwnerView.as_view(),
                                name="household_owner",
                            ),
                            path(
                                "add/",
                                view=HouseholdUserAddView.as_view(),
                                name="household_user_add",
                            ),
                            path(
                                "count/",
                                view=HouseholdUserCount.as_view(),
                                name="household_user_count",
                            ),
                            # path(
                            #     "<int:user_pk>/remind/",
                            #     view=login_required(
                            #         views.OrganizationUserRemind.as_view()
                            #     ),
                            #     name="household_user_remind",
                            # ),
                            # path(
                            #     "<int:user_pk>/",
                            #     view=login_required(
                            #         views.OrganizationUserDetail.as_view()
                            #     ),
                            #     name="household_user_detail",
                            # ),
                            # path(
                            #     "<int:user_pk>/edit/",
                            #     view=login_required(
                            #         views.OrganizationUserUpdate.as_view()
                            #     ),
                            #     name="household_user_edit",
                            # ),
                            # path(
                            #     "<int:user_pk>/delete/",
                            #     view=login_required(
                            #         views.OrganizationUserDelete.as_view()
                            #     ),
                            #     name="household_user_delete",
                            # ),
                        ]
                    ),
                ),
            ]
        ),
    ),
]
