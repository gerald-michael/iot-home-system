import json
import requests


response = requests.post(
    "https://hsssiot.com/api/v1/accounts/auth/login/",
    data={
        "email": "gerald1@gmail.com",
        "password": "5#eVwn8yeQNjAn",
    },
)
token = response.json()["key"]
file_obj = {"image": open("/home/gerald/Pictures/Screenshot-10.png", "rb")}
data = {
    "resourcetype": "TouchSensorReading",
    # "distance": 44.0,
}
response = requests.post(
    "https://hsssiot.com/api/v1/household/aksam/device/",
    data=data,
    files=file_obj,
    headers={
        "Authorization": f"Token {token}",
        "Accept": "application/json",
    },
)
print(response.text)
