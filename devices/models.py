from django.db import models
from polymorphic.models import PolymorphicModel
from household.models import HouseholdAwareModelMixin
from utils.model_utils import TimeStampedEditableModel
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Category(HouseholdAwareModelMixin, TimeStampedEditableModel):
    name = models.CharField(max_length=120)

    def __str__(self) -> str:
        return self.name


class Device(HouseholdAwareModelMixin, TimeStampedEditableModel):
    title = models.CharField(max_length=120)
    description = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="message_category"
    )

    class Choices(models.TextChoices):
        GAS = "GAS", "Gas"
        PROXIMITY = "PROXIMITY", "Proximity"
        TOUCH = "TOUCH", "Touch"
        DIGITAL = "DIGITAL", "Digital"


    type = models.CharField(
        _("Device Type"), max_length=10, choices=Choices.choices
    )

    def __str__(self) -> str:
        return self.title


class DeviceReading(
    PolymorphicModel, HouseholdAwareModelMixin, TimeStampedEditableModel
):
    device = models.ForeignKey(
        Device, related_name="device", on_delete=models.CASCADE
    )


class GasSensorReading(DeviceReading):
    pass


class ProximitySensorReading(DeviceReading):
    pass


class DigitalCameraReading(DeviceReading):
    pass


class TouchSensorReading(DeviceReading):
    pass
