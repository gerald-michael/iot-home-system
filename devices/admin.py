from django.contrib import admin
from polymorphic.admin import (
    PolymorphicParentModelAdmin,
    PolymorphicChildModelAdmin,
    PolymorphicChildModelFilter,
)
from devices.models import (
    DeviceReading,
    GasSensorReading,
    ProximitySensorReading,
    TouchSensorReading,
)

# Register your models here.


class DeviceReadingAdmin(PolymorphicChildModelAdmin):
    base_model = DeviceReading


@admin.register(GasSensorReading)
class GasSensorReadingAdmin(DeviceReadingAdmin):
    base_model = GasSensorReading


@admin.register(ProximitySensorReading)
class ProximitySensorReadingAdmin(DeviceReadingAdmin):
    base_model = ProximitySensorReading


@admin.register(TouchSensorReading)
class TouchSensorReadingAdmin(DeviceReadingAdmin):
    base_model = TouchSensorReading


@admin.register(DeviceReading)
class DeviceReadingParentAdmin(PolymorphicParentModelAdmin):
    base_model = DeviceReading
    child_models = (
        GasSensorReading,
        ProximitySensorReading,
        TouchSensorReading,
    )
    list_filter = (PolymorphicChildModelFilter,)
