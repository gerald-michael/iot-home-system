from rest_framework.response import Response

# Create your views here.
from rest_framework import generics, views, filters, permissions
from household.api.serializers import (
    HouseholdOwnerSerializer,
    HouseholdProfileSerializer,
    OrganizationSerializer,
    HouseholdUserSerializer,
    HouseholdUserListSerializer,
)
from organizations.models import (
    Organization,
    OrganizationOwner,
    OrganizationUser,
)
from household.permissions import (
    HouseholdAdminOnly,
    HouseholdAdminOrReadOnly,
    HouseholdOwnerReadOnly,
    HouseholdUsersOnly,
    HouseholdOwnerOnly,
    IsAdminOrReadOnly,
)
from household.models import HouseholdProfile


class HouseholdListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = OrganizationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name",
    ]
    ordering = [
        "created",
    ]
    ordering_fields = [
        "created",
    ]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Organization.objects.filter(is_active=True)
        return Organization.objects.filter(
            organization_users__user_id=self.request.user, is_active=True
        )


class HouseholdDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [HouseholdOwnerReadOnly | permissions.IsAdminUser]
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()
    lookup_field = "slug"


class HouseholdDeleteView(generics.DestroyAPIView, HouseholdOwnerOnly):
    permission_classes = [HouseholdOwnerOnly | permissions.IsAdminUser]
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()


class HouseholdUserList(generics.ListAPIView):
    permission_classes = [HouseholdUsersOnly | permissions.IsAdminUser]
    serializer_class = HouseholdUserListSerializer

    def get_queryset(self):
        household = Organization.objects.get(slug=self.kwargs["slug"])
        return OrganizationUser.objects.filter(organization=household)


class HouseholdProfileView(generics.ListCreateAPIView):
    serializer_class = HouseholdProfileSerializer
    pagination_class = None
    permission_classes = [HouseholdOwnerOnly | permissions.IsAdminUser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        household = Organization.objects.get(slug=self.kwargs["slug"])
        context["household"] = household
        return context

    def get_queryset(self):
        household = Organization.objects.get(slug=self.kwargs["slug"])
        return HouseholdProfile.objects.filter(household=household)


class HouseholdOwnerView(generics.CreateAPIView):
    permission_classes = [permissions.IsAdminUser | HouseholdOwnerOnly]
    serializer_class = HouseholdOwnerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        household = Organization.objects.get(slug=self.kwargs["slug"])
        context["household"] = household
        return context

    def get_queryset(self):
        household = Organization.objects.get(slug=self.kwargs["slug"])
        return OrganizationOwner.objects.filter(organization=household)


class HouseholdUserAddView(generics.CreateAPIView):
    permission_classes = [HouseholdAdminOnly]
    serializer_class = HouseholdUserSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        household = Organization.objects.get(slug=self.kwargs["slug"])
        context["household"] = household
        return context

    def get_queryset(self):
        household = Organization.objects.get(slug=self.kwargs["slug"])
        return OrganizationUser.objects.filter(organization=household)


class HouseholdUserCount(views.APIView):
    permission_classes = [HouseholdUsersOnly]

    def get(self, request, format=None, *args, **kwargs):
        household_user = OrganizationUser.objects.filter(
            organization__slug=kwargs["slug"]
        ).count()
        return Response(household_user)
