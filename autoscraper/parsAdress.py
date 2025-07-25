import requests
import time

def parse_address_with_nominatim(raw_address):
    time.sleep(1)  # Respecter la limite de 1 requête/s
    url = 'https://nominatim.openstreetmap.org/search'
    params = {
        'q': raw_address,
        'format': 'json',
        'addressdetails': 1,
        'limit': 1
    }
    headers = {
        'User-Agent': 'autoscraper-bot'
    }
    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200 and response.json():
        addr = response.json()[0]['address']
        return {
            'lieu': addr.get('road', ''),
            'ville': addr.get('city', '') or addr.get('town', '') or addr.get('village', ''),
            'code_postal': addr.get('postcode', ''),
            'pays': addr.get('country', '')
        }
    return {'lieu': '', 'ville': '', 'code_postal': '', 'pays': ''}
