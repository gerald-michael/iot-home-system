from model_utils.fields import AutoCreatedField, AutoLastModifiedField
from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampedEditableModel(models.Model):
    date_created = AutoCreatedField(_('date created'), editable=True)
    date_updated = AutoLastModifiedField(_('date updated'), editable=True)

    class Meta:
        abstract = True
