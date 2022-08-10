from django.contrib import admin
from household.models import (
    Household,
    HouseholdOwner,
    HouseholdInvitation,
    HouseholdUser,
)

# Register your models here.
admin.site.register(Household)
admin.site.register(HouseholdOwner)
admin.site.register(HouseholdInvitation)
admin.site.register(HouseholdUser)