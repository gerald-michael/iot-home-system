from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from organizations.abstract import (
    AbstractOrganization,
    AbstractOrganizationOwner,
    AbstractOrganizationUser,
    AbstractOrganizationInvitation,
)
from django.utils.translation import gettext_lazy as _

# Create your models here.


def upload_household_profile_logo(instance, filename):
    return "profile/{household}/{filename}".format(
        household=instance.household, filename=filename
    )


class Household(AbstractOrganization):
    email = models.EmailField(null=True, blank=True)
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
        return self.name

    class Meta(AbstractOrganization.Meta):
        abstract = False


class HouseholdUser(AbstractOrganizationUser):
    """
    Default OrganizationUser model.
    """

    class Meta(AbstractOrganizationUser.Meta):
        abstract = False


class HouseholdOwner(AbstractOrganizationOwner):
    """
    Default OrganizationOwner model.
    """

    class Meta(AbstractOrganizationOwner.Meta):
        abstract = False


class HouseholdInvitation(AbstractOrganizationInvitation):
    class Meta(AbstractOrganizationInvitation.Meta):
        abstract = False


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
