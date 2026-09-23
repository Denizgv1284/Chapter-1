// Static/file previews have no Python routes. Use the same public provider,
// with the same country/district checks; never invent a successful response.
(() => {
  const normalize = value => String(value || '').toLowerCase().replaceAll('ı','i').normalize('NFKD').replace(/[\u0300-\u036f\s]/g,'');
  const aliases = {afyonkarahisar:'afyon', kahramanmaras:'maras', sanliurfa:'urfa'};
  const canonical = value => aliases[normalize(value)] || normalize(value);
  const json = async (url, params, signal) => {
    let response;
    try { response = await fetch(`${url}?${new URLSearchParams(params)}`, {signal}); }
    catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new Error('Hava durumu bağlantısı kurulamadı. İnternet bağlantını kontrol edip yeniden dene.');
    }
    if (!response.ok) throw new Error('Hava durumu servisi şu anda yanıt vermiyor. Biraz sonra yeniden dene.');
    try { return await response.json(); }
    catch { throw new Error('Hava durumu servisinden geçersiz yanıt geldi. Tekrar dene.'); }
  };
  const search = (name, countryCode, language, signal, count=20) => json('https://geocoding-api.open-meteo.com/v1/search', {name,countryCode,language,count}, signal);
  window.DCMDWeatherDirect = async (endpoint, input, signal) => {
    const params = new URLSearchParams(input);
    const country = params.get('country') || 'TR', language = params.get('language') || 'tr';
    const locations = window.DCMDLocationData;
    const countryInfo = locations?.countries.find(item => item.code === country);
    if (!countryInfo) throw new Error('Listeden geçerli bir ülke seç.');
    if (endpoint === 'locations') {
      const query = params.get('q')?.trim() || '';
      if (query.length < 2 || query.length > 100) throw new Error('Şehir için 2–100 karakter yaz.');
      const data = await search(query,country,language,signal);
      return {results:(data.results || []).filter(place => place.country_code === country).map(place => ({id:place.id,name:place.name,district:place.admin2 || '',region:place.admin1 || ''}))};
    }
    let coordinates, province, district;
    if (country === 'TR') {
      const selected = locations.provinces.find(item => String(item.id) === params.get('province'));
      if (!selected) throw new Error('Geçerli bir il seç.');
      province = selected.name; coordinates = selected.coordinates; district = 'İl merkezi';
      if (params.get('district')) {
        const area = selected.districts.find(item => String(item.id) === params.get('district'));
        if (!area) throw new Error('Bu ile ait geçerli bir ilçe seç.');
        const query = area.name === 'Merkez' ? province : area.name;
        const data = await search(query,'TR','tr',signal,100);
        const candidates = (data.results || []).filter(place => place.country_code === 'TR' && canonical(place.admin1) === canonical(province) && normalize(place.name) === normalize(query) && (/^PPL/.test(place.feature_code) || place.feature_code === 'ADM2'));
        candidates.sort((a,b) => Number(/^PPL/.test(b.feature_code))-Number(/^PPL/.test(a.feature_code)) || (b.population || 0)-(a.population || 0));
        if (!candidates.length) throw new Error('Bu ilçenin konumu doğrulanamadı. İl merkezi seçeneğini deneyebilirsin.');
        coordinates = candidates[0]; district = area.name;
      }
    } else {
      const id = params.get('location') || '';
      if (!/^\d{1,12}$/.test(id)) throw new Error('Arama sonuçlarından bir konum seç.');
      const place = await json('https://geocoding-api.open-meteo.com/v1/get', {id,language},signal);
      if (place.country_code !== country) throw new Error('Seçilen konum bu ülkede değil. Yeniden arama yap.');
      coordinates = place; province = place.name; district = place.admin1 || '';
    }
    const {latitude,longitude} = coordinates;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Konum koordinatları alınamadı.');
    const data = await json('https://api.open-meteo.com/v1/forecast', {latitude,longitude,current:'temperature_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code,is_day',timezone:'auto',timeformat:'unixtime'},signal);
    if (!data.current || !Number.isFinite(data.current.time)) throw new Error('Hava durumu servisinden eksik yanıt geldi. Tekrar dene.');
    return {country:countryInfo.name,province,district,coordinates:{latitude,longitude},current:data.current,timestamp:data.current.time,timezone:data.timezone};
  };
})();
