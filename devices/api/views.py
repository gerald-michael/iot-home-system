from rest_framework import viewsets, filters, permissions
from devices.models import DeviceReading
from devices.api.serializers import (
    DeviceReadingPolymorphicSerializer,
)
from household.models import Household
from household.permissions import HouseholdUsersOnly

# Create your views here.


class DeviceReadingViewset(viewsets.ModelViewSet):
    permission_classes = [HouseholdUsersOnly | permissions.IsAdminUser]
    serializer_class = DeviceReadingPolymorphicSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = []
    ordering = ["date_created"]
    ordering_fields = [
        "date_created",
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        household = Household.objects.get(slug=self.kwargs["slug"])
        context["household"] = household
        return context

    def get_queryset(self):
        household = Household.objects.get(slug=self.kwargs["slug"])
        return DeviceReading.objects.filter(household=household)
