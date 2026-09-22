"""DCMD preview: python server.py --port 8001"""
import argparse
import json
import math
import os
import time
import unicodedata
from datetime import datetime, timezone, timedelta
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote

import requests
from main import hava_durumu_cek, GEOCODING_URL

ROOT = Path(__file__).resolve().parent
PROVINCES = json.loads((ROOT / 'data/turkiye.json').read_text(encoding='utf-8-sig'))
COUNTRIES = {c['code']: c for c in json.loads((ROOT / 'data/countries.json').read_text(encoding='utf-8'))}
CACHE = {}
SECURITY_HEADERS = json.loads((ROOT / 'vercel.json').read_text(encoding='utf-8'))['headers'][0]['headers']


def check_country(country):
    if country not in COUNTRIES:
        raise ValueError('Listeden geçerli bir ülke seç.')


def search_locations(country, query, language='tr'):
    check_country(country)
    if not 2 <= len(query.strip()) <= 100:
        raise ValueError('Şehir veya bölge için 2–100 karakter yaz.')
    response = requests.get(GEOCODING_URL, params={'name': query.strip(), 'countryCode': country, 'count': 20, 'language': language}, timeout=12)
    response.raise_for_status()
    return {'results': [{'id': r['id'], 'name': r['name'], 'region': r.get('admin1', ''), 'district': r.get('admin2', '')}
                        for r in response.json().get('results', []) if r.get('country_code') == country]}


def validate_current(result):
    current = result.get('current', {})
    fields = ('temperature_2m', 'apparent_temperature', 'wind_speed_10m', 'weather_code', 'precipitation', 'is_day')
    if any(not isinstance(current.get(k), (float, int)) or not math.isfinite(current[k]) for k in fields):
        raise RuntimeError('Güncel hava durumu şu anda alınamıyor.')
    offset = result.get('utc_offset_seconds', 10800)
    stamp = datetime.fromisoformat(current['time']).replace(tzinfo=timezone(timedelta(seconds=offset)))
    age = (datetime.now(timezone.utc) - stamp).total_seconds()
    if age > 5400 or age < -1800:
        raise RuntimeError('Güncel hava verisi henüz gelmedi.')
    return current, int(stamp.timestamp())


def get_international_weather(country, location_id, language='tr'):
    check_country(country)
    if not location_id.isdigit() or len(location_id) > 12:
        raise ValueError('Arama sonuçlarından bir konum seç.')
    key = ('international', country, location_id, language)
    if key in CACHE and time.monotonic() - CACHE[key][0] < 300:
        return CACHE[key][1]
    response = requests.get('https://geocoding-api.open-meteo.com/v1/get', params={'id': location_id, 'language': language}, timeout=12)
    response.raise_for_status()
    place = response.json()
    if place.get('country_code') != country:
        raise ValueError('Seçilen konum bu ülkede değil. Yeniden arama yap.')
    coordinates = {k: place[k] for k in ('latitude', 'longitude')}
    result = hava_durumu_cek(coordinates['latitude'], coordinates['longitude'], sadece_anlik=True, saat_dilimi='auto')
    current, timestamp = validate_current(result)
    payload = {'country': COUNTRIES[country]['name'], 'province': place['name'], 'district': place.get('admin1', ''),
               'coordinates': coordinates, 'current': current, 'timestamp': timestamp, 'timezone': result['timezone']}
    if len(CACHE) > 1000:
        CACHE.clear()
    CACHE[key] = (time.monotonic(), payload)
    return payload


def normalize(value):
    return ''.join(c for c in unicodedata.normalize('NFKD', value.lower().replace('ı', 'i')) if not unicodedata.combining(c)).replace(' ', '')


def resolve_location(province, district):
    if district is None:
        return province['coordinates']
    query = province['name'] if district['name'] == 'Merkez' else district['name']
    response = requests.get(GEOCODING_URL, params={'name': query, 'count': 100, 'language': 'tr', 'countryCode': 'TR'}, timeout=12)
    response.raise_for_status()
    aliases = {'afyonkarahisar': 'afyon', 'kahramanmaras': 'maras', 'sanliurfa': 'urfa'}
    def canonical(name):
        name = normalize(name)
        return aliases.get(name, name)
    candidates = [r for r in response.json().get('results', [])
                  if r.get('country_code') == 'TR'
                  and canonical(r.get('admin1', '')) == canonical(province['name'])
                  and normalize(r['name']) == normalize(query)
                  and (r.get('feature_code', '').startswith('PPL') or r.get('feature_code') == 'ADM2')]
    if not candidates:
        raise ValueError('Bu ilçenin konumu doğrulanamadı. İl merkezi seçeneğini deneyebilirsin.')
    candidates.sort(key=lambda r: (r.get('feature_code', '').startswith('PPL'), r.get('population', 0)), reverse=True)
    return {key: candidates[0][key] for key in ('latitude', 'longitude')}


def get_weather(province_id, district_id=''):
    province = next((p for p in PROVINCES if str(p['id']) == province_id), None)
    if not province:
        raise ValueError('Geçerli bir il seç.')
    district = next((d for d in province['districts'] if str(d['id']) == district_id), None)
    if district_id and not district:
        raise ValueError('Bu ile ait geçerli bir ilçe seç.')
    key = (province_id, district_id)
    if key in CACHE and time.monotonic() - CACHE[key][0] < 300:
        return CACHE[key][1]
    coordinates = resolve_location(province, district)
    result = hava_durumu_cek(coordinates['latitude'], coordinates['longitude'], sadece_anlik=True)
    current, timestamp = validate_current(result)
    payload = {'country': 'Türkiye', 'province': province['name'], 'district': district['name'] if district else 'İl merkezi', 'coordinates': coordinates, 'current': current, 'timestamp': timestamp, 'timezone': 'Europe/Istanbul'}
    CACHE[key] = (time.monotonic(), payload)
    return payload


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/music/config':
            try:
                config_file = ROOT / 'music-config.local.json'
                config = json.loads(config_file.read_text(encoding='utf-8-sig')) if config_file.exists() else {}
                # Only these public SDK values can leave the server. Never expose signing keys.
                public = {
                    'spotifyClientId': os.getenv('SPOTIFY_CLIENT_ID', config.get('spotifyClientId', '')),
                    'spotifyRedirectUri': os.getenv('SPOTIFY_REDIRECT_URI', config.get('spotifyRedirectUri', '')),
                    'appleDeveloperToken': os.getenv('APPLE_MUSIC_DEVELOPER_TOKEN', config.get('appleDeveloperToken', '')),
                }
                if not all(isinstance(value, str) for value in public.values()):
                    raise ValueError('Invalid configuration')
                body = json.dumps(public).encode('utf-8')
                status = 200
            except (OSError, ValueError, AttributeError):
                body = b'{"error":"Music configuration unavailable"}'
                status = 503
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if parsed.path in ('/api/weather', '/api/locations'):
            params = parse_qs(parsed.query)
            try:
                country = params.get('country', ['TR'])[0]
                check_country(country)
                language = params.get('language', ['tr'])[0]
                if language not in ('en', 'tr', 'pl', 'de', 'ru', 'zh'):
                    raise ValueError('Invalid language')
                if parsed.path == '/api/locations':
                    payload = search_locations(country, params.get('q', [''])[0], language)
                elif country != 'TR':
                    payload = get_international_weather(country, params.get('location', [''])[0], language)
                else:
                    payload = get_weather(params.get('province', [''])[0], params.get('district', [''])[0])
                status = 200
            except ValueError as error:
                payload, status = {'error': str(error)}, 400
            except (requests.RequestException, RuntimeError, KeyError, TypeError):
                payload, status = {'error': 'Güncel hava durumu alınamadı. İnternet bağlantısını kontrol edip tekrar dene.'}, 503
            body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        allowed = {'/', '/index.html', '/style.css', '/script.js', '/weather.css', '/weather.js', '/data/turkiye.json', '/data/countries.json', '/music.css', '/music.js', '/music-services.js', '/languages.js', '/languages.css'}
        path = unquote(parsed.path)
        resolved = (ROOT / path.lstrip('/')).resolve()
        allowed.add('/commerce.js')
        allowed.update({'/dcmd-enhance.js', '/dcmd-enhance.css', '/dcmd-system.css', '/dcmd-editorial.css'})
        allowed.update({'/dcmd-reference.css', '/dcmd-reference.js'})
        asset = any(resolved.is_relative_to(ROOT / folder) for folder in ('images', 'vendor', 'policies'))
        if not resolved.is_relative_to(ROOT) or (path not in allowed and not asset) or (path != '/' and resolved.is_dir()):
            self.send_error(404)
            return
        super().do_GET()

    def do_HEAD(self):
        self.send_error(405)

    def end_headers(self):
        for header in SECURITY_HEADERS:
            self.send_header(header['key'], header['value'])
        super().end_headers()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8001)
    args = parser.parse_args()
    print(f'DCMD: http://localhost:{args.port}', flush=True)
    ThreadingHTTPServer(('0.0.0.0', args.port), partial(Handler, directory=str(ROOT))).serve_forever()
