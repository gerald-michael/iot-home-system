from django.db import models
from django.db.models.signals import post_save
from phonenumber_field.modelfields import PhoneNumberField
from organizations.models import Organization
from django.utils.translation import gettext_lazy as _

# Create your models here.


def upload_household_profile_logo(instance, filename):
    return "profile/{household}/{filename}".format(
        household=instance.household, filename=filename
    )


class Household(Organization):
    email = models.EmailField(null=True, blank=True)


class HouseholdAwareModelMixin(models.Model):
    household = models.ForeignKey(
        Household,
        on_delete=models.CASCADE,
    )

    class Meta:
        abstract = True


class HouseholdQuerySet(models.QuerySet):
    def for_user(self, user):
        return self.filter(account__users=user)


class HouseholdProfile(models.Model):
    household = models.OneToOneField(
        Household, related_name="household_profile", on_delete=models.CASCADE
    )
    lat = models.DecimalField(
        max_digits=22, decimal_places=16, null=True, blank=True
    )
    long = models.DecimalField(
        max_digits=22, decimal_places=16, null=True, blank=True
    )
    address = models.CharField(max_length=120, null=True, blank=True)
    phone_number = PhoneNumberField(
        _("Phone Number"), unique=False, blank=True, null=True, default=None
    )
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.household.name


def create_household_profile(sender, instance, created, *args, **kwargs):
    if created:
        HouseholdProfile.objects.create(household=instance)


post_save.connect(create_household_profile, sender=Household)
