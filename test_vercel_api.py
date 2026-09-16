"""Exercise the actual Vercel entry points over HTTP without external APIs."""
import json
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.request import urlopen
from urllib.error import HTTPError
from unittest.mock import patch

from api.weather import handler as WeatherHandler
from api.locations import handler as LocationsHandler


class DeploymentTests(unittest.TestCase):
    def request(self, handler, path):
        with ThreadingHTTPServer(('127.0.0.1', 0), handler) as server:
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                try:
                    response = urlopen(f'http://127.0.0.1:{server.server_port}{path}', timeout=5)
                except HTTPError as error:
                    response = error
                with response:
                    self.assertIn('application/json', response.headers['Content-Type'])
                    self.assertEqual(response.headers['X-Content-Type-Options'], 'nosniff')
                    self.assertEqual(response.headers['X-Frame-Options'], 'DENY')
                    self.assertIn("frame-ancestors 'none'", response.headers['Content-Security-Policy'])
                    return response.status, json.load(response)
            finally:
                server.shutdown()
                thread.join()

    @patch('server.get_weather', return_value={'current': {'temperature_2m': 22}})
    def test_weather_entry(self, weather):
        status, data = self.request(WeatherHandler, '/api/weather?country=TR&province=34')
        self.assertEqual(status, 200)
        self.assertEqual(data['current']['temperature_2m'], 22)
        weather.assert_called_once_with('34', '')

    @patch('server.search_locations', return_value={'results': [{'id': 1, 'name': 'Warszawa'}]})
    def test_search_entry(self, search):
        status, data = self.request(LocationsHandler, '/api/locations?country=PL&q=Warszawa')
        self.assertEqual(status, 200)
        self.assertEqual(data['results'][0]['name'], 'Warszawa')
        search.assert_called_once_with('PL', 'Warszawa', 'tr')

    def test_bad_input_is_json(self):
        status, data = self.request(WeatherHandler, '/api/weather?province=999')
        self.assertEqual(status, 400)
        self.assertIn('error', data)

    @patch('server.get_weather', side_effect=RuntimeError('upstream unavailable'))
    def test_provider_failure_is_json(self, weather):
        status, data = self.request(WeatherHandler, '/api/weather?province=34')
        self.assertEqual(status, 503)
        self.assertIn('error', data)
