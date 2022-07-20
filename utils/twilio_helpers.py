from twilio.rest import Client
from django.conf import settings

account_sid = settings.TWILIO_ACCOUNT_SID
auth_token = settings.TWILIO_AUTH_TOKEN
client = Client(account_sid, auth_token)


def send_text(sender, to, text):
    message = client.messages.create(
        body=text,
        from_=f'whatsapp:${sender}',
        to=f'whatsapp:${to}'
    )
    return message


def send_media(sender, to, media_url, body=None):
    message = client.messages.create(
        media_url=[
            media_url
        ],
        body=f'*{body}*',
        from_=f'whatsapp:${sender}',
        to=f'whatsapp:${to}'
    )
    return message


def send_location(sender, to, lat, long, address, name):
    message = client.messages.create(
        messaging_service_sid='MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        body=name,
        persistent_action=[f'geo:${lat},${long}|${address}'],
        to=f'whatsapp:${to}'
    )
    return message
