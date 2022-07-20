from rest_framework import viewsets, filters, response, views, generics
from devices.models import Category, Device, DeviceReading
from devices.api.serializers import (
    CategorySerializer,
    DeviceReadingPolymorphicSerializer,
    DeviceSerializer,
)
from organizations.models import Organization
from household.permissions import HouseholdUsersOnly

# Create your views here.
class CategoryViewset(viewsets.ModelViewSet):
    pagination_class = None
    permission_classes = [HouseholdUsersOnly]
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name",
    ]
    ordering = ["name"]
    ordering_fields = ["name"]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        context["organisation"] = organisation
        return context

    def get_queryset(self):
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        return Category.objects.filter(organisation=organisation)


class DeviceViewset(viewsets.ModelViewSet):
    permission_classes = [HouseholdUsersOnly]
    serializer_class = DeviceReadingPolymorphicSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "category__name"]
    ordering = ["date_created"]
    ordering_fields = [
        "sent",
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        context["organisation"] = organisation
        return context

    def get_queryset(self):
        organisation = Organization.objects.get(slug=self.kwargs["slug"])
        return Message.objects.filter(organisation=organisation)
