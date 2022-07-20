from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()
# router.register(r'templates', MessageViewset, basename="device")
# router.register(r'category', CategoryViewset, basename="messages_category")
urlpatterns = router.urls
