from rest_polymorphic.serializers import PolymorphicSerializer
from rest_framework import serializers

from devices.models import (
    DeviceReading,
    GasSensorReading,
    ProximitySensorReading,
    TouchSensorReading,
)


class DeviceReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceReading
        exclude = ("household",)
        read_only_fields = ("date_created", "date_updated")


class GasSensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GasSensorReading
        exclude = ("household",)
        read_only_fields = ("date_created", "date_updated")


class ProximitySensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProximitySensorReading
        exclude = ("household",)
        read_only_fields = ("date_created", "date_updated")


class TouchSensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TouchSensorReading
        exclude = ("household",)
        read_only_fields = ("date_created", "date_updated")


class DeviceReadingPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        DeviceReading: DeviceReadingSerializer,
        GasSensorReading: GasSensorReadingSerializer,
        ProximitySensorReading: ProximitySensorReadingSerializer,
        TouchSensorReading: TouchSensorReadingSerializer,
    }

    def create(self, validated_data):
        validated_data["household"] = self.context["household"]
        return super().create(validated_data)
