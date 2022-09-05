from django.conf import settings
import requests

def send_text(message, contact, refrenceId):
    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/chat"

    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}body={message}&priority=10&referenceId={refrenceId}"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_image(image_url, contact, caption, refrenceId):

    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/image"
    caption_bold = f'*{caption}*'
    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}image={image_url}&caption={caption_bold}&referenceId={refrenceId}&nocache=false"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_video(video, contact, referenceId):

    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/video"

    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&video={video}&referenceId={referenceId}&nocache=false"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_voice(audio, contact, referenceId):

    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/voice"

    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&audio={audio}&referenceId={referenceId}&nocache=false"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_audio(audio, contact, referenceId):

    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/audio"

    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&audio={audio}&referenceId={referenceId}&nocache=false"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_document(file_url, filename, contact, referenceId):
    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/document"

    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&filename={filename}&document={file_url}&referenceId={referenceId}&nocache=false"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_link(link, contact, referenceId):

    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/link"

    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&link={link}&referenceId={referenceId}"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_contact(phone_number, contact, refrenceId):
    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/contact"
    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&contact={phone_number}&referenceId={refrenceId}"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_location(address, lat, lng, contact, referenceId):
    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/location"

    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&address={address}&lat={lat}7&lng={lng}&referenceId={referenceId}"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text


def send_contact_card(firstname, lastname, organisation, dob, job_title, website_url, email, socials, contact,  referenceId):
    url = f"{settings.ULTRAMSG_API_URL}{settings.ULTRAMSG_INSTANCE_ID}/messages/vcard"
    social_info = ""
    count = 1
    for social in socials:
        social_info += f"item{count}.URL:{social['url']}\nitem{count}.X-ABLabel:{social['label']}\n"
        count += count
    payload = f"token={settings.ULTRAMSG_TOKEN}&to={contact}&vcard=BEGIN:VCARD\nVERSION:3.0\nN:{lastname};{firstname};;;\nFN:{firstname} {lastname}\nORG:{organisation}\nBDAY:{dob}\nTITLE:{job_title}\nURL:{website_url}\nEMAIL:{email}\n{social_info}NOTE:Created By Ultramsg.com\nEND:VCARD&referenceId={referenceId}"
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.request("POST", url, data=payload, headers=headers)

    return response.text
