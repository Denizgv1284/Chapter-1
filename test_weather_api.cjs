const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fetchWeatherApi } = require('./weather.js');

test('weather API uses the current origin and passes cancellation', async t => {
  const controller = new AbortController();
  t.mock.method(global, 'fetch', async (url, options) => {
    assert.equal(url, '/api/weather?province=34');
    assert.equal(options.signal, controller.signal);
    assert.equal(options.cache, 'no-store');
    return Response.json({ current: {}, coordinates: {} });
  });
  await fetchWeatherApi('weather', new URLSearchParams({ province: '34' }), controller.signal);
});

test('HTML fallback, network failures, and broken JSON produce readable errors', async t => {
  const mock = t.mock.method(global, 'fetch');
  mock.mock.mockImplementation(async () => new Response('<html>Not found</html>', { status: 404 }));
  await assert.rejects(fetchWeatherApi('locations', ''), /servisi kullanılamıyor/);
  mock.mock.mockImplementation(async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(fetchWeatherApi('weather', ''), /İnternet bağlantını/);
  mock.mock.mockImplementation(async () => new Response('{', { headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects(fetchWeatherApi('weather', ''), /geçersiz yanıt/);
  mock.mock.mockImplementation(async () => Response.json({ error: 'Tekrar dene' }, { status: 503 }));
  await assert.rejects(fetchWeatherApi('weather', ''), /Tekrar dene/);
});

test('abort stays distinguishable from a network error', async t => {
  t.mock.method(global, 'fetch', async () => { throw new DOMException('Aborted', 'AbortError'); });
  await assert.rejects(fetchWeatherApi('weather', ''), { name: 'AbortError' });
});
