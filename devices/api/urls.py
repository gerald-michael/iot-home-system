from rest_framework import routers
from devices.api.views import (
    DeviceReadingViewset,
)

router = routers.DefaultRouter()
router.register(r"", DeviceReadingViewset, basename="device_reading")
urlpatterns = router.urls
