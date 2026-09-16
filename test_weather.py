import unittest
from unittest.mock import patch
from datetime import datetime, timezone, timedelta

import server


class WeatherTests(unittest.TestCase):
    def setUp(self):
        server.CACHE.clear()

    def test_wrong_province_district_pair_rejected(self):
        with self.assertRaises(ValueError):
            server.get_weather('6', '1421')

    def test_invalid_province_rejected(self):
        with self.assertRaises(ValueError):
            server.get_weather('999')

    def test_unsupported_country_rejected(self):
        with self.assertRaises(ValueError):
            server.search_locations('US', 'Paris')

    @patch('server.requests.get')
    def test_search_excludes_same_name_in_another_country(self, request):
        request.return_value.json.return_value = {'results': [
            {'id': 1, 'name': 'Paris', 'country_code': 'FR'},
            {'id': 2, 'name': 'Paris', 'country_code': 'US'}]}
        self.assertEqual([p['id'] for p in server.search_locations('FR', 'Paris')['results']], [1])

    @patch('server.requests.get')
    def test_location_country_mismatch_rejected(self, request):
        request.return_value.json.return_value = {'country_code': 'DE'}
        with self.assertRaises(ValueError):
            server.get_international_weather('PL', '123')

    def test_local_weather_timestamp_uses_provider_offset(self):
        now = datetime.now(timezone.utc).replace(second=0, microsecond=0)
        for offset in (0, 3600, 7200, 10800):
            local = now + timedelta(seconds=offset)
            current = dict(temperature_2m=20, apparent_temperature=19, wind_speed_10m=10,
                           weather_code=0, precipitation=0, is_day=1, time=local.strftime('%Y-%m-%dT%H:%M'))
            _, timestamp = server.validate_current({'current': current, 'utc_offset_seconds': offset})
            self.assertEqual(timestamp, int(now.timestamp()))

    @patch('server.hava_durumu_cek')
    def test_old_or_incomplete_weather_is_not_recommended(self, weather):
        current = dict(temperature_2m=20, apparent_temperature=19, wind_speed_10m=10,
                       weather_code=0, precipitation=0, is_day=1,
                       time=(datetime.now(timezone(timedelta(hours=3))) - timedelta(hours=2)).strftime('%Y-%m-%dT%H:%M'))
        weather.return_value = {'current': current}
        with self.assertRaises(RuntimeError):
            server.get_weather('34')
        current['temperature_2m'] = None
        with self.assertRaises(RuntimeError):
            server.get_weather('34')

    @patch('server.requests.get')
    def test_same_named_district_in_other_province_rejected(self, request):
        request.return_value.json.return_value = {'results': [dict(name='Kadıköy', country_code='TR', admin1='Yalova', feature_code='PPL', latitude=40.6, longitude=29.2)]}
        province = next(p for p in server.PROVINCES if p['id'] == 34)
        district = next(d for d in province['districts'] if d['id'] == 1421)
        with self.assertRaises(ValueError):
            server.resolve_location(province, district)


if __name__ == '__main__':
    unittest.main()
