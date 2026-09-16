function recommendOutfit(current) {
  const temperature = current.apparent_temperature;
  const wet = current.precipitation > 0 || [51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99].includes(current.weather_code);
  let title, reason, categories;
  if (temperature < 12) {
    title = 'Katmanlarla sıcak kal.';
    reason = 'Hava soğuk. Hoodie ve pantolonu temel katman olarak kullan; dışarıda üzerine sıcak tutan bir mont ekle.';
    categories = ['hoodie', 'pants'];
  } else if (temperature < 21) {
    title = 'Hafif bir katman, tam senlik.';
    reason = 'Serin havada tişörtün üzerine bir hoodie al. Pantolonla kombinini tamamla.';
    categories = ['hoodie', 'tshirt', 'pants'];
  } else {
    title = temperature >= 28 ? 'Sıcak havaya hafif bir seçim.' : 'Tişört havası. Kendi tarzında.';
    reason = temperature >= 28 ? 'Hissedilen sıcaklık yüksek. Koleksiyondan bir tişört seç; rahat ve hafif parçalarla tamamla.' : 'Hava ılık. Bir tişört ve rahat kesimli pantolonla dışarı çıkabilirsin.';
    categories = temperature >= 28 ? ['tshirt'] : ['tshirt', 'pants'];
  }
  if (wet) reason += ' Yağış var; bu parçalar yağmurluk yerine geçmez. Su geçirmeyen bir dış katman veya şemsiye ekle.';
  if (current.wind_speed_10m >= 25) reason += ' Rüzgâr kuvvetli; rüzgâr kesen bir dış katman da al.';
  return { title, reason, categories };
}

async function fetchWeatherApi(endpoint, params, signal) {
  let response;
  try {
    response = await fetch(`/api/${endpoint}?${params}`, {signal, cache:'no-store'});
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Hava durumu servisine ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.');
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Hava durumu servisi kullanılamıyor. Lütfen biraz sonra tekrar dene.');
  }
  let data;
  try { data = await response.json(); }
  catch { throw new Error('Hava durumu servisinden geçersiz yanıt geldi. Tekrar dene.'); }
  if (!response.ok) throw new Error(data?.error || 'Hava durumu servisi geçici olarak kullanılamıyor. Tekrar dene.');
  if (!data || (endpoint === 'locations' ? !Array.isArray(data.results) : !data.current || !data.coordinates)) {
    throw new Error('Hava durumu servisinden eksik yanıt geldi. Tekrar dene.');
  }
  return data;
}

if (typeof module !== 'undefined') module.exports = { recommendOutfit, fetchWeatherApi };

if (typeof document !== 'undefined') (async function () {
  const byId = (id) => document.getElementById(id);
  const provinceSelect = byId('weatherProvince');
  const districtSelect = byId('weatherDistrict');
  const countrySelect = byId('weatherCountry');
  const citySelect = byId('weatherCityResult');
  const cityQuery = byId('weatherCityQuery');
  const submit = byId('weatherSubmit');
  const status = byId('weatherStatus');
  const result = byId('weatherResult');
  let provinces = [], countries = [], map, selectedMarker, controller, requestId = 0, hasRequested = false;
  let provinceLayer, countryLayer, searchController, searchVersion = 0;
  let selectedCountry = 'TR';
  let mapOverview = true;
  let lastWeather = null;
  let clockZone = 'Europe/Istanbul', clockLabel = 'Türkiye';
  const markers = new Map();
  const bounds = [[34, -25], [70, 49]];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  byId('expandWeatherMap').addEventListener('click', () => {
    const expanded = byId('weatherMap').closest('.weather-location').classList.toggle('map-expanded');
    byId('expandWeatherMap').setAttribute('aria-expanded', String(expanded));
    byId('expandWeatherMap').textContent = expanded ? 'Haritayı küçült ⤡' : 'Haritayı büyüt ⤢';
  });
  function updateClock() {
    byId('turkeyClock').textContent = clockZone ? `${new Intl.DateTimeFormat(window.DCMDLanguage?.locale || 'tr-TR', { timeZone:clockZone, hour:'2-digit', minute:'2-digit' }).format(new Date())} · ${window.DCMDLanguage?.t(clockLabel) || clockLabel}` : 'Yerel saat için konum seç';
  }
  updateClock();
  setInterval(updateClock, 30000);

  function resetResult() {
    requestId++;
    controller?.abort();
    selectedMarker?.remove(); selectedMarker = null;
    result.hidden = true;
    byId('weatherEmpty').hidden = false;
    byId('weatherPanel').setAttribute('aria-busy', 'false');
    status.classList.remove('is-error');
    status.textContent = 'Konumunu seçtikten sonra “Kombinimi bul”a dokun.';
    submit.disabled = countrySelect.value === 'TR' ? !provinceSelect.value : !citySelect.value;
    submit.innerHTML = 'Kombinimi bul <span>↗</span>';
    hasRequested = false;
    lastWeather = null;
  }

  function flyTo(point, zoom, fromAbove = false) {
    if (!map) return;
    mapOverview = false;
    map.stop();
    if (reducedMotion.matches || navigator.connection?.saveData) {map.setView(point, zoom, {animate:false}); return;}
    // A single cancellable flight prevents delayed country jumps after a new selection.
    map.flyTo(point, zoom, {duration:fromAbove ? 1 : .65});
  }

  function updateMapLayers() {
    if (!map || !provinceLayer || !countryLayer) return;
    const showProvinces = selectedCountry === 'TR' && map.getZoom() >= 5;
    if (showProvinces) {provinceLayer.addTo(map); countryLayer.remove();}
    else {provinceLayer.remove(); countryLayer.addTo(map);}
  }

  function selectCountry(code, animate = true) {
    const country = countries.find(c => c.code === code);
    if (!country) return;
    if (code === selectedCountry) {
      if (animate) flyTo([country.lat, country.lon], country.zoom, true);
      return;
    }
    selectedCountry = code;
    countrySelect.value = code;
    searchVersion++;
    searchController?.abort();
    byId('weatherFindCity').disabled = false;
    cityQuery.value = '';
    citySelect.replaceChildren(new Option('Önce şehir ara', ''));
    citySelect.disabled = true;
    byId('weatherCityStatus').textContent = '';
    const turkey = code === 'TR';
    byId('weatherProvinceLabel').hidden = !turkey;
    byId('weatherDistrictLabel').hidden = !turkey;
    provinceSelect.required = turkey;
    provinceSelect.disabled = !turkey;
    byId('weatherCitySearch').hidden = turkey;
    cityQuery.disabled = turkey;
    provinceSelect.value = '';
    districtSelect.replaceChildren(new Option('Önce il seç', ''));
    districtSelect.disabled = true;
    selectedMarker?.remove(); selectedMarker = null;
    clockZone = turkey ? 'Europe/Istanbul' : null;
    clockLabel = country.name;
    updateClock();
    byId('weatherMapTitle').textContent = country.name.toLocaleUpperCase('tr-TR');
    cityQuery.placeholder = `${country.name} içinde şehir veya bölge ara…`;
    if (map) {
      updateMapLayers();
      if (animate) flyTo([country.lat, country.lon], country.zoom, true);
    }
    resetResult();
  }
  countrySelect.addEventListener('change', () => selectCountry(countrySelect.value));
  citySelect.addEventListener('change', resetResult);
  cityQuery.addEventListener('input', () => {
    searchVersion++; searchController?.abort();
    byId('weatherFindCity').disabled = false;
    citySelect.replaceChildren(new Option('Arama sonuçlarından seç', '')); citySelect.disabled = true;
    resetResult();
  });
  async function findCity(preserveSelection = false) {
    const previousSelection = preserveSelection === true ? citySelect.value : '';
    const query = cityQuery.value.trim();
    if (query.length < 2) {byId('weatherCityStatus').textContent = 'En az 2 karakter yaz.'; return;}
    searchController?.abort(); searchController = new AbortController();
    if (!previousSelection) {
      citySelect.replaceChildren(new Option('Konumlar aranıyor…', ''));
      citySelect.disabled = true;
      resetResult();
    }
    const active = searchController, version = ++searchVersion;
    const timeout = setTimeout(() => active.abort(), 20000);
    byId('weatherFindCity').disabled = true;
    byId('weatherCityStatus').textContent = 'Konumlar aranıyor…';
    try {
      const params = new URLSearchParams({country:countrySelect.value, q:query, language:window.DCMDLanguage?.language || 'tr'});
      const data = await fetchWeatherApi('locations', params, active.signal);
      if (version !== searchVersion) return;
      citySelect.replaceChildren(new Option('Konumunu seç', ''));
      data.results.forEach(place => citySelect.add(new Option([...new Set([place.name, place.district, place.region].filter(Boolean))].join(' / '), place.id)));
      if (previousSelection) {
        citySelect.value = previousSelection;
        if (!citySelect.value) resetResult();
      }
      citySelect.disabled = !data.results.length;
      byId('weatherCityStatus').textContent = data.results.length ? `${data.results.length} konum bulundu. Listeden bulunduğun yeri seç.` : 'Bu ülkede sonuç bulunamadı. Yerel şehir adını veya posta kodunu dene.';
    } catch(error) {
      if (version === searchVersion) byId('weatherCityStatus').textContent = error.name === 'AbortError' ? 'Arama zaman aşımına uğradı. Tekrar dene.' : error.message;
    } finally {clearTimeout(timeout); if (version === searchVersion) byId('weatherFindCity').disabled = false;}
  }
  byId('weatherFindCity').addEventListener('click', findCity);
  cityQuery.addEventListener('keydown', event => {if (event.key === 'Enter') {event.preventDefault(); findCity();}});

  function selectProvince(id) {
    provinceSelect.value = String(id);
    if (countrySelect.value !== 'TR') return;
    const province = provinces.find(p => String(p.id) === String(id));
    clockZone = 'Europe/Istanbul'; clockLabel = province?.name || 'Türkiye'; updateClock();
    districtSelect.replaceChildren(new Option('İl merkezi', ''));
    if (province) {
      province.districts.slice().sort((a,b) => a.name.localeCompare(b.name, 'tr')).forEach(d => districtSelect.add(new Option(d.name, d.id)));
      if (map) {
        const { latitude, longitude } = province.coordinates;
        flyTo([latitude, longitude], 8);
        markers.forEach((marker, markerId) => marker.getElement()?.classList.toggle('is-selected', markerId === province.id));
      }
    }
    districtSelect.disabled = !province;
    if (selectedMarker) { selectedMarker.remove(); selectedMarker = null; }
    resetResult();
  }
  provinceSelect.addEventListener('change', () => selectProvince(provinceSelect.value));
  districtSelect.addEventListener('change', resetResult);
  byId('resetWeatherMap').addEventListener('click', () => {
    if (!map) return;
    mapOverview = true;
    map.stop();
    if (reducedMotion.matches || navigator.connection?.saveData) map.fitBounds(bounds, {animate:false});
    else map.flyToBounds(bounds, {duration:1.1});
    byId('weatherMapTitle').textContent = 'TÜRKİYE + AVRUPA';
  });

  function describeWeather(code, day) {
    if (code === 0) return [day ? 'Açık ve güneşli' : 'Açık gökyüzü', day ? '☀' : '☾'];
    if (code <= 2) return ['Parçalı bulutlu', day ? '⛅' : '☾'];
    if (code === 3) return ['Bulutlu', '☁'];
    if ([45,48].includes(code)) return ['Sisli', '≋'];
    if ([71,73,75,77,85,86].includes(code)) return ['Kar yağışlı', '❄'];
    if ([95,96,99].includes(code)) return ['Gök gürültülü sağanak', 'ϟ'];
    if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return ['Yağışlı', '☂'];
    return ['Hava durumu bilgisi', '☁'];
  }

  function render(data) {
    lastWeather = data;
    const c = data.current;
    const stamp = new Date(data.timestamp * 1000);
    const age = Date.now() - stamp.getTime();
    if (!Number.isFinite(age) || age > 90 * 60000 || age < -30 * 60000) throw new Error('Güncel veri henüz gelmedi. Biraz sonra yeniden dene.');
    const [description, symbol] = describeWeather(c.weather_code, c.is_day);
    byId('weatherPlace').textContent = [...new Set([data.province, data.district, window.DCMDLanguage?.t(data.country) || data.country].filter(Boolean))].join(' / ');
    byId('weatherDay').textContent = c.is_day ? 'Gündüz' : 'Gece';
    byId('weatherTemp').textContent = `${Math.round(c.temperature_2m)}°`;
    byId('weatherSymbol').textContent = symbol;
    byId('weatherDescription').textContent = description;
    byId('weatherFeels').textContent = `${Math.round(c.apparent_temperature)}°C`;
    byId('weatherWind').textContent = `${Math.round(c.wind_speed_10m)} km/sa`;
    byId('weatherRain').textContent = `${c.precipitation.toLocaleString(window.DCMDLanguage?.locale || 'tr-TR')} mm`;
    clockZone = data.timezone; clockLabel = data.province; updateClock();
    const dateFormat = new Intl.DateTimeFormat(window.DCMDLanguage?.locale || 'tr-TR', {timeZone:clockZone,day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
    byId('weatherTimestamp').textContent = `Veri zamanı: ${dateFormat.format(stamp)} · Yerel saat (${data.timezone})`;
    const outfit = recommendOutfit(c);
    byId('outfitTitle').textContent = outfit.title;
    byId('outfitReason').textContent = outfit.reason;
    const container = byId('outfitProducts');
    container.replaceChildren();
    const cards = [...document.querySelectorAll('#products .product-card')];
    const chosen = cards.filter(card => outfit.categories.includes(card.dataset.category) && !card.querySelector('.add').disabled);
    chosen.forEach(card => {
      const row = document.createElement('div');
      row.className = 'outfit-product';
      const picture = card.querySelector('img').cloneNode(true);
      picture.loading = 'lazy';
      const details = document.createElement('div');
      const name = document.createElement('h4');
      name.textContent = card.dataset.name;
      const price = document.createElement('p');
      price.textContent = `${window.DCMDCommerce.money(Number(card.dataset.price))} · ${card.querySelector('.size-select').value}`;
      details.append(name, price);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Sepete ekle';
      button.setAttribute('aria-label', `${card.dataset.name} — sepete ekle`);
      button.addEventListener('click', () => {card.scrollIntoView({behavior:'smooth',block:'center'});card.querySelector('.size-select').focus({preventScroll:true});});
      button.textContent = 'Beden seç';
      row.append(picture, details, button);
      container.append(row);
    });
    if (map) {
      const point = [data.coordinates.latitude, data.coordinates.longitude];
      selectedMarker?.remove();
      selectedMarker = L.circleMarker(point, {radius:9, color:'#fff', weight:3, fillColor:'#f4c400', fillOpacity:1}).addTo(map);
      selectedMarker.bindTooltip(`${data.province} / ${data.district}`);
      flyTo(point, countrySelect.value !== 'TR' || districtSelect.value ? 10 : 8);
    }
    byId('weatherEmpty').hidden = true;
    result.hidden = false;
  }

  async function loadWeather() {
    if (countrySelect.value === 'TR' ? !provinceSelect.value : !citySelect.value) return;
    controller?.abort();
    controller = new AbortController();
    const activeController = controller;
    const version = ++requestId;
    const timeout = setTimeout(() => activeController.abort(), 30000);
    byId('weatherPanel').setAttribute('aria-busy', 'true');
    result.hidden = true;
    byId('weatherEmpty').hidden = true;
    status.classList.remove('is-error');
    status.textContent = 'Konumun için güncel hava ve kombin hazırlanıyor…';
    submit.disabled = true;
    submit.textContent = 'Hazırlanıyor…';
    hasRequested = true;
    try {
      const params = new URLSearchParams({country:countrySelect.value, province:provinceSelect.value, district:districtSelect.value, location:citySelect.value, language:window.DCMDLanguage?.language || 'tr'});
      const data = await fetchWeatherApi('weather', params, activeController.signal);
      if (version !== requestId) return;
      render(data);
      status.textContent = 'Bulunduğun yer, şu anın havası, senin seçimin.';
    } catch (error) {
      if (version !== requestId) return;
      status.textContent = error.name === 'AbortError' ? 'Bağlantı zaman aşımına uğradı. Tekrar dene.' : error.message;
      status.classList.add('is-error');
      result.hidden = true;
    } finally {
      clearTimeout(timeout);
      if (version === requestId) {
        submit.disabled = false;
        submit.innerHTML = 'Yeniden güncelle <span>↗</span>';
        byId('weatherPanel').setAttribute('aria-busy', 'false');
      }
    }
  }
  byId('weatherForm').addEventListener('submit', event => {event.preventDefault(); loadWeather();});
  setInterval(() => {if (hasRequested && !document.hidden) loadWeather();}, 15 * 60000);
  document.addEventListener('visibilitychange', () => {if (!document.hidden && hasRequested) loadWeather();});

  window.addEventListener('dcmd:languagechange', () => {
    updateClock();
    if (lastWeather && !result.hidden) render(lastWeather);
    if (countrySelect.value !== 'TR' && cityQuery.value.trim().length >= 2) {
      findCity(true).then(() => {if (hasRequested && citySelect.value) loadWeather();});
    }
    if (map && countryLayer) countryLayer.eachLayer(marker => {
      const name = window.DCMDLanguage.country(marker.options.countryCode);
      marker.setTooltipContent(name);
      marker.getElement()?.setAttribute('title', name);
      marker.getElement()?.setAttribute('aria-label', name);
    });
  });

  try {
    const responses = await Promise.all([fetch('data/turkiye.json'),fetch('data/countries.json')]);
    if (responses.some(r => !r.ok)) throw new Error('Konum listesi yüklenemedi. Sayfayı yenile.');
    [provinces, countries] = await Promise.all(responses.map(r => r.json()));
    countrySelect.replaceChildren();
    countries.slice().sort((a,b) => a.name.localeCompare(b.name,'tr')).forEach(c => countrySelect.add(new Option(c.name,c.code)));
    countrySelect.value = 'TR'; countrySelect.disabled = false;
    provinceSelect.replaceChildren(new Option('İlini seç', ''));
    provinces.slice().sort((a,b) => a.name.localeCompare(b.name, 'tr')).forEach(p => provinceSelect.add(new Option(p.name, p.id)));
    provinceSelect.disabled = false;
    if (typeof L === 'undefined') throw new Error('Harita yüklenemedi. İl ve ilçe listesinden devam edebilirsin.');
    map = L.map('weatherMap', {scrollWheelZoom:false, minZoom:2, maxZoom:12, worldCopyJump:true, zoomAnimation:false, fadeAnimation:false}).fitBounds(bounds);
    map.on('dragstart', () => map.stop());
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, updateWhenIdle:true, updateWhenZooming:false, keepBuffer:1, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map).on('tileerror', () => {byId('mapHint').textContent = 'Harita görselleri yüklenemedi. Konum listesinden devam edebilirsin.';});
    provinceLayer = L.layerGroup().addTo(map);
    countryLayer = L.layerGroup().addTo(map);
    countries.forEach(c => {
      L.marker([c.lat,c.lon], {icon:L.divIcon({className:'country-dot', html:c.code,iconSize:[27,27]}),title:window.DCMDLanguage?.country(c.code) || c.name,alt:c.name,countryCode:c.code}).addTo(countryLayer).bindTooltip(window.DCMDLanguage?.country(c.code) || c.name).on('click', () => selectCountry(c.code));
    });
    map.on('zoomend', updateMapLayers);
    provinces.forEach(p => {
      const marker = L.marker([p.coordinates.latitude, p.coordinates.longitude], {icon:L.divIcon({className:'province-dot', html:'<span></span>', iconSize:[28,28]}), title:p.name, alt:p.name});
      marker.addTo(provinceLayer).bindTooltip(p.name).on('click', () => selectProvince(p.id));
      markers.set(p.id, marker);
    });
    updateMapLayers();
    cityQuery.disabled = true;
    let mapResizeFrame;
    new ResizeObserver(() => {
      cancelAnimationFrame(mapResizeFrame);
      mapResizeFrame = requestAnimationFrame(() => {
        map.stop();
        const center = map.getCenter(), zoom = map.getZoom();
        map.invalidateSize({animate:false, pan:false});
        // Keep the overview framed after rotation, without moving a selected city.
        if (mapOverview) {
          map.fitBounds(bounds, {animate:false});
        } else map.setView(center, zoom, {animate:false});
        updateMapLayers();
      });
    }).observe(byId('weatherMap'));
  } catch (error) {
    status.textContent = error.message;
    status.classList.add('is-error');
  }
})();
