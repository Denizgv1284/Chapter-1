# Hava durumuna göre kombin — ilk sürüm

Çalıştırma (proje klasöründen):

```powershell
.venv\Scripts\python.exe server.py --port 8001
```

Bilgisayar: http://localhost:8001/#weather-style
Telefon: aynı Wi-Fi üzerinden bilgisayarın yerel IP adresi, port 8001.
Sunucu açık kalmalı ve internet bağlantısı bulunmalı. Statik Live Server,
Python `/api/weather` uç noktasını çalıştırmaz.

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

Bu bir yerel prototiptir. Ticari yayına çıkmadan önce Open-Meteo servis
planı ve kullanım şartları değerlendirilmelidir: https://open-meteo.com/en/pricing
