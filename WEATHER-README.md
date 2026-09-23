# Hava durumuna göre kombin

## GitHub + Vercel yayını

GitHub kaynak kodunu tutar; site ve Python API uçları Vercel üzerinde çalışır.
`api/weather.py` ve `api/locations.py`, `server.py` içindeki aynı doğrulama ve
hava durumu kodunu kullanır. Ziyaretçilerin Python kurması veya bilgisayarındaki
sunucunun açık kalması gerekmez.

Bu değişiklikleri GitHub'a gönderip Vercel'de yeni deployment oluştur.
Vercel Root Directory bu dosyanın bulunduğu proje kökü olmalı.
`vercel.json`, Framework Preset olarak Other, build komutu olarak
`node build-static.cjs`, çıktı klasörü olarak `public` kullanır.
Panelde eski build/output override ayarları varsa bunları kaldır.
`requirements.txt` Python bağımlılıklarını yükletir. Build yalnızca web
dosyalarını public klasörüne kopyalar; yerel ayarlar ve Python kaynakları
statik yayına dahil edilmez.

Yayın sonrası `/api/weather?country=TR&province=34` ve
`/api/locations?country=PL&q=Warszawa` adreslerinin JSON döndürdüğünü kontrol et.
Ardından sitede il/ilçe ve Avrupa şehir aramasını dene.
GitHub Pages ve salt statik Live Server Python API çalıştırmaz. Bu önizlemelerde
API bulunamadığında `weather-direct.js` aynı sağlayıcıya doğrudan bağlanır.
Ülke ve ilçe doğrulaması korunur; yanlış konum için veri gösterilmez.

## Yerel geliştirme

Çalıştırma (proje klasöründen):

```powershell
.venv\Scripts\python.exe server.py --port 8001
```

Bilgisayar: http://localhost:8001/#weather-style
Telefon: aynı Wi-Fi üzerinden bilgisayarın yerel IP adresi, port 8001.
Yerel Python API için sunucu açık kalmalı. Dosya adı `server.py`;
`preview_server.py` bu projede yoktur. `index.html` çift tıklanarak da açılabilir:
konum listeleri `data/locations.js` üzerinden yüklenir, hava verisi doğrudan
sağlayıcıdan alınır. Güncel hava ve sokak haritası için internet gerekir.
Yerel Natural Earth ülke sınırları internet olmadan da haritada görünür.

`main.py` içindeki hava durumu işlevi hem mevcut konsol uygulamasına hem
siteye hizmet eder. Web sürümü yalnızca current alanlarını ister.
İlçe koordinatları Open-Meteo geocoding üzerinden il ve isim doğrulanarak
çözülür; bulunamayan ilçelerde il merkezine sessiz geçiş yapılmaz.
Veriler 5 dakika sunucu önbelleğinde tutulur; açık ekran 15 dakikada bir
yenilenir. 90 dakikadan eski veriler öneriye dönüştürülmez.

Türkiye ve Avrupa için 50 ülke seçeneği bulunur. Türkiye'de il–ilçe listesi,
diğer ülkelerde şehir/bölge/posta kodu araması kullanılır. Arama sonuçları ve
konum kimlikleri sunucuda seçilen ülkeyle doğrulanır. Saat dilimi hava
servisinden alınır; saat ve veri zamanı seçilen konumun yerel saatindedir.

Haritada ülke merkez noktaları, Türkiye'ye yaklaşıldığında il noktaları
gösterilir. Ülke seçimindeki kısa uzaklaşma/yakınlaşma Leaflet flyTo ile
çalışır; 3D küre veya sürekli animasyon yoktur. Azaltılmış hareket veya veri
tasarrufu seçiliyse doğrudan konuma geçilir. Harita döşemeleri kamera
hareketi bittikten sonra yüklenir; ek harita kütüphanesi eklenmemiştir.

Giysi önerileri hissedilen sıcaklık (<12, 12–21, 21–28, >=28 °C),
yağış ve rüzgâra göre değişir. Kumaş veya su geçirmezlik bilgisi varsayılmaz.

Kaynaklar:
- Hava ve koordinat çözümleme: https://open-meteo.com/en/docs
- İl ve ilçe listesi: https://api.turkiyeapi.dev/v1/provinces
- Harita: https://www.openstreetmap.org/copyright
- Leaflet 1.9.4: vendor/leaflet-LICENSE.txt

Ticari yayına çıkmadan önce Open-Meteo servis
planı ve kullanım şartları değerlendirilmelidir: https://open-meteo.com/en/pricing
