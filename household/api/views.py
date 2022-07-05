from rest_framework.response import Response

# Create your views here.
from rest_framework import generics, views, filters, permissions
from organisation.api.serializers import (
    OrganisationOwnerSerializer,
    OrganisationProfileSerializer,
    OrganizationSerializer,
    OrganisationUserSerializer,
    OrganisationUserListSerializer,
)
from organizations.models import Organization, OrganizationOwner, OrganizationUser
from organisation.permissions import (
    OrganisationalAdminOnly,
    OrganisationalAdminOrReadOnly,
    OrganisationalOwnerReadOnly,
    OrganisationalUsersOnly,
    OrganisationalOwnerOnly,
    IsAdminOrReadOnly,
)
from organisation.models import OrganisationProfile


class OrganisationListView(generics.ListCreateAPIView):
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


class OrganisationDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [OrganisationalOwnerReadOnly | permissions.IsAdminUser]
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()
    lookup_field = "slug"


class OrganisationDeleteView(generics.DestroyAPIView, OrganisationalOwnerOnly):
    permission_classes = [OrganisationalOwnerOnly | permissions.IsAdminUser]
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()


class OrganisationUserList(generics.ListAPIView):
    permission_classes = [OrganisationalUsersOnly | permissions.IsAdminUser]
    serializer_class = OrganisationUserListSerializer

    def get_queryset(self):
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        return OrganizationUser.objects.filter(organization=organisation)


class OrganisationProfileView(generics.ListCreateAPIView):
    serializer_class = OrganisationProfileSerializer
    pagination_class = None
    permission_classes = [OrganisationalOwnerOnly | permissions.IsAdminUser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        context["organisation"] = organisation
        return context

    def get_queryset(self):
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        return OrganisationProfile.objects.filter(organisation=organisation)


class OrganisationOwnerView(generics.CreateAPIView):
    permission_classes = [permissions.IsAdminUser | OrganisationalOwnerOnly]
    serializer_class = OrganisationOwnerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        context["organisation"] = organisation
        return context

    def get_queryset(self):
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        return OrganizationOwner.objects.filter(organization=organisation)


class OrganisationUserAddView(generics.CreateAPIView):
    permission_classes = [OrganisationalAdminOnly]
    serializer_class = OrganisationUserSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        context["organisation"] = organisation
        return context

    def get_queryset(self):
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        return OrganizationUser.objects.filter(organization=organisation)


class OrganisationalUserCount(views.APIView):
    permission_classes = [OrganisationalUsersOnly]

    def get(self, request, format=None, *args, **kwargs):
        organisation_user = OrganizationUser.objects.filter(
            organization__slug=kwargs["slug"]
        ).count()
        return Response(organisation_user)
