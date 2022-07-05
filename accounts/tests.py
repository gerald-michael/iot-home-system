from django.contrib.auth import get_user_model
from django.urls import reverse
from hypothesis import given, settings
from hypothesis.extra import django
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase

# Create your tests here.
User = get_user_model()
factory = APIRequestFactory()


class TestUserProfile(django.TestCase):
    @given(django.from_model(User))
    @settings(deadline=None)
    def test_model_properties(self, instance: User) -> None:
        instance.save()
        # Test UserProfile.has_verified_email()
        assert instance.has_verified_email() == instance.is_verified

        # Test UserProfile.get_full_name()
        assert instance.get_full_name() == str(instance)

        # Test UserProfile.get_short_name()
        assert instance.get_short_name() == instance.email


class TestAccountsApp(APITestCase):
    def test_register_endpoint(self):
        self.client.post(
            "http://localhost:8000/v1/accounts/auth/register/",
            {
                "email": "gerald@gmail.com",
                "username": "gerald",
                "password1": "root2021",
                "password2": "root2021",
            },
        )
        response = self.client.post(
            reverse("rest_login"),
            {"email": "gerald@gmail.com", "password": "root2021"},
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['key']}")
        print(response.data)
