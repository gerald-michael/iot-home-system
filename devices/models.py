import os
from uuid import uuid4
from django.db import models
from polymorphic.models import PolymorphicModel
from household.models import HouseholdAwareModelMixin
from utils.model_utils import TimeStampedEditableModel
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from twilio.rest import Client
from utils.ultramsg_helpers import send_image

# Create your models here.


class DeviceReading(
    PolymorphicModel, HouseholdAwareModelMixin, TimeStampedEditableModel
):
    pass


class GasSensorReading(DeviceReading):
    value = models.DecimalField(
        max_digits=22, decimal_places=16, null=True, blank=True
    )


class ProximitySensorReading(DeviceReading):
    image = models.ImageField()
    distance = models.DecimalField(
        max_digits=22, decimal_places=16, null=True, blank=True
    )


class TouchSensorReading(DeviceReading):
    image = models.ImageField()


def send_message_touch(sender, instance, created, *args, **kwargs):
    if created:
        host_url = os.environ("HOST_URL")
        send_image(
            contact=instance.household.phone_number,
            image_url=f"{host_url}{instance.image.url}",
            refrenceId=uuid4,
            caption=f"Image recievied from proximity sensor at distance {instance.distance} cm.",
        )
        account_sid = os.environ["ACCOUNT_SID"]
        auth_token = os.environ["ACCOUNT_TOKEN"]
        account_number = os.environ["TWILIO_PHONE_NUMBER"]
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=f"Image recievied from proximity sensor at distance {instance.distance} cm.",
            from_=account_number,
            to=instance.household.phone_number,
        )


def send_message_proximity(sender, instance, created, *args, **kwargs):
    if created:
        host_url = os.environ("HOST_URL")
        send_image(
            contact=instance.household.phone_number,
            image_url=f"{host_url}{instance.image.url}",
            refrenceId=uuid4,
            caption="Image recievied from touch sensor",
        )
        account_sid = os.environ["ACCOUNT_SID"]
        auth_token = os.environ["ACCOUNT_TOKEN"]
        account_number = os.environ["TWILIO_PHONE_NUMBER"]
        client = Client(account_sid, auth_token)
        client.messages.create(
            body="Image recievied from touch sensor",
            from_=account_number,
            to=instance.household.phone_number,
        )


post_save.connect(send_message_proximity, sender=ProximitySensorReading)
post_save.connect(send_message_touch, sender=TouchSensorReading)
