from django.db import models
from polymorphic.models import PolymorphicModel
from household.models import HouseholdAwareModelMixin
from utils.model_utils import TimeStampedEditableModel
from django.utils.translation import gettext_lazy as _

# Create your models here.


class DeviceReading(
    PolymorphicModel, HouseholdAwareModelMixin, TimeStampedEditableModel
):
    pass


class GasSensorReading(DeviceReading):
    value = models.IntegerField()


class ProximitySensorReading(DeviceReading):
    image = models.ImageField()
    distance = models.IntegerField()


class TouchSensorReading(DeviceReading):
    image = models.ImageField()
