import requests


response = requests.post(
    "http://localhost:8000/api/v1/accounts/auth/login/",
    data={
        "email": "gerald1@gmail.com",
        "password": "5#eVwn8yeQNjAn",
    },
)
token = response.json()["key"]
response = requests.post(
    "http://localhost:8000/api/v1/household/geralds-home/device/",
    data={
        "resourcetype": "GasSensorReading",
        "value": 34,
    },
    headers={
        "Authorization": f"Token {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
)
print(response.text)
