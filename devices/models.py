import os
from django.conf import settings
from uuid import uuid4
from django.db import models
from polymorphic.models import PolymorphicModel
from household.models import HouseholdAwareModelMixin
from utils.model_utils import TimeStampedEditableModel
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from twilio.rest import Client
from utils.ultramsg_helpers import send_image
import requests

# Create your models here.


class DeviceReading(
    PolymorphicModel, HouseholdAwareModelMixin, TimeStampedEditableModel
):
    pass


class GasSensorReading(DeviceReading):
    value = models.DecimalField(
        max_digits=22, decimal_places=16, null=True, blank=True
    )
    status = models.CharField(max_length=10)


class ProximitySensorReading(DeviceReading):
    image = models.ImageField()
    distance = models.DecimalField(
        max_digits=22, decimal_places=16, null=True, blank=True
    )


class TouchSensorReading(DeviceReading):
    image = models.ImageField()


def send_message_touch(sender, instance, created, *args, **kwargs):
    if created:
        host_url = settings.HOST_URL
        url = f"https://api.ultramsg.com/{settings.ULTRAMSG_INSTANCE_ID}/messages/image"
        payload = f"token={settings.ULTRAMSG_TOKEN}&to={str(instance.household.phone_number)}&image={host_url}{instance.image.url}&caption=Image recieved from vibration sensor&referenceId={str(uuid4)}&nocache="
        headers = {"content-type": "application/x-www-form-urlencoded"}
        requests.request("POST", url, data=payload, headers=headers)
        account_sid = os.environ["ACCOUNT_SID"]
        auth_token = os.environ["ACCOUNT_TOKEN"]
        account_number = os.environ["TWILIO_PHONE_NUMBER"]
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=f"Image recievied from proximity sensor at distance.",
            from_=account_number,
            to=str(instance.household.phone_number),
        )


def send_message_proximity(sender, instance, created, *args, **kwargs):
    if created:
        host_url = settings.HOST_URL
        url = f"https://api.ultramsg.com/{settings.ULTRAMSG_INSTANCE_ID}/messages/image"
        payload = f"token={settings.ULTRAMSG_TOKEN}&to={str(instance.household.phone_number)}&image={host_url}{instance.image.url}&caption=Image recievied from proximity sensor at distance {round(instance.distance,2)} cm.&referenceId={str(uuid4)}&nocache="
        headers = {"content-type": "application/x-www-form-urlencoded"}
        requests.request("POST", url, data=payload, headers=headers)
        account_sid = settings.ACCOUNT_SID
        auth_token = settings.ACCOUNT_TOKEN
        account_number = settings.TWILIO_PHONE_NUMBER
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=f"Image recievied from proximity sensor at distance {round(instance.distance,2)} cm.",
            from_=account_number,
            to=str(instance.household.phone_number),
        )


def send_message_gas(sender, instance, created, *args, **kwargs):
    if created and instance.status.lower()=="high":
        url = f"https://api.ultramsg.com/{settings.ULTRAMSG_INSTANCE_ID}/messages/chat"
        payload = f"token={settings.ULTRAMSG_TOKEN}&to={str(instance.household.phone_number)}&body=High gas reading recieved from gas sensor, value: {round(instance.value,2)}.&priority=10&referenceId={str(uuid4)}"
        headers = {"content-type": "application/x-www-form-urlencoded"}
        requests.request("POST", url, data=payload, headers=headers)
        account_sid = settings.ACCOUNT_SID
        auth_token = settings.ACCOUNT_TOKEN
        account_number = settings.TWILIO_PHONE_NUMBER
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=f"High gas reading recieved from gas sensor, value: {round(instance.value,2)}.",
            from_=account_number,
            to=str(instance.household.phone_number),
        )


post_save.connect(send_message_gas, sender=GasSensorReading)
post_save.connect(send_message_proximity, sender=ProximitySensorReading)
post_save.connect(send_message_touch, sender=TouchSensorReading)
