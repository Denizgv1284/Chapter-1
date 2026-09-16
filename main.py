# Buraya sen kod yazacaksın
# Proje: Python konu Hava Durumu Tahmin Uygulaması Part 1
# İlk olarak kullanıcıdan şehir isimlerini alacağız ve bu şehirlerin hava durumunu tahmin edeceğiz.

import requests  # requests kütüphanesini kullanarak API'den veri çekeceğiz.

API_URL = "https://api.open-meteo.com/v1/forecast"
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

COORDINATES = {
    "latitude": 41.0082,
    "longitude": 28.9784,
    "city": "Istanbul"
}

print("Hava Durumu Tahmin Uygulamasına Hoşgeldiniz!")
print("=" * 50)
print(f"Şehir: {COORDINATES['city']}")
print(f"Enlem: {COORDINATES['latitude']}")
print(f"Boylam: {COORDINATES['longitude']}")
print("=" * 50)
print("\nHazırlandı! Devam etmeye hazır.\n")


# =============================================================================
# PART 2: API'DEN VERİ ÇEKME
# =============================================================================
def sehir_konum_bul(sehir_adi: str) -> dict:
    """
    kullanıcının yazdığı Türkiye'deki şehiri arar ve kordinatlarını döndürü.
    """

    params = {
        "name": sehir_adi,
        "count": 1,
        "language": "tr",
        "countryCode": "TR"
    }


    try:
        respone = requests.get(
            GEOCODING_URL,

            params=params,
            timeout=10
        )

        respone.raise_for_status()


        veri = respone.json()

    except requests.RequestException as hata:
        print(f"Hata: Şehir aranamadı - {hata}")
        return{}

    sonuclar = veri.get("results", [])

    if not sonuclar:
        print("bu isimde Türkiye'de bir şehir bulunamadı.")
        return{}

    sehir = sonuclar[0]

    return{
        "city": sehir["name"],
        "latitude": sehir["latitude"],
        "longitude": sehir["longitude"]
    }

def hava_durumu_cek(enlem: float, boylam: float, sadece_anlik: bool = False, saat_dilimi: str = "Europe/Istanbul") -> dict:
    """
    Open-Meteo API'sinden anlık ve günlük hava durumu verilerini çeker.

    Args:
        enlem (float): Şehir enlemi
        boylam (float): Şehir boylamı

    Returns:
        dict: Anlık ve 5 günlük hava durumu verisi
    """

    params = {
        "latitude": enlem,
        "longitude": boylam,
        "current": "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,is_day",
        "timezone": saat_dilimi
    }

    if not sadece_anlik:
        params["daily"] = "weather_code,temperature_2m_max,temperature_2m_min"

    try:
        print("API'ye bağlanılıyor...")

        response = requests.get(
            API_URL,
            params=params,
            timeout=10
        )

        print("API'den cevap geldi!")

        response.raise_for_status()

        print("HTTP DURUMU BAŞARILI")

        veri = response.json()

        print("JSON verisi alındı!")

        current = veri.get("current", {})
        daily = veri.get("daily", {})

    except requests.RequestException as hata:
        print(f"Hata: API isteği başarısız - {hata}")
        return {}

    # Günlük tahmin listesini oluştur
    gunluk_tahmin = []

    for i in range(len(daily.get("time", []))):
        gunluk_tahmin.append({
            "tarih": daily["time"][i],
            "weather_code": daily["weather_code"][i],
            "en_yuksek": daily["temperature_2m_max"][i],
            "en_dusuk": daily["temperature_2m_min"][i],
        })

    return {
        "current": current,
        "timezone": veri.get("timezone", "Europe/Istanbul"),
        "utc_offset_seconds": veri.get("utc_offset_seconds", 10800),
        "sehir": COORDINATES["city"],
        "enlem": enlem,
        "boylam": boylam,
        "sicaklik": current.get("temperature_2m"),
        "ruzgar_hizi": current.get("wind_speed_10m"),
        "weather_code": current.get("weather_code"),
        "gunluk_tahmin": gunluk_tahmin,
    }


# =============================================================================
# PART 3: HAVA DURUMU KODLARINI TÜRKÇELEŞTİRME
# =============================================================================

def hava_durumu_acikla(weather_code: int | None) -> str:
    """
    Open-Meteo hava durumu kodunu Türkçe açıklamaya çevirir.
    """

    kod_haritalari = {
        0: "Açık gökyüzü",
        1: "Çoğunlukla açık",
        2: "Parçalı bulutlu",
        3: "Kapalı",
        45: "Sisli",
        48: "Dondurucu sis",
        51: "Hafif yağmur",
        53: "Orta yağmur",
        55: "Yoğun yağmur",
        61: "Hafif yağış",
        63: "Orta yağış",
        65: "Şiddetli yağış",
        71: "Hafif kar",
        73: "Orta kar",
        75: "Yoğun kar",
        80: "Hafif sağanak yağış",
        81: "Orta sağanak yağış",
        82: "Yoğun sağanak yağış",
        95: "Gök gürültülü sağanak yağış",
        99: "Şiddetli fırtına + dolu"
    }

    if weather_code is None:
        return "Bilgi yok"

    return kod_haritalari.get(
        weather_code,
        "Bilinmeyen hava durumu"
    )


# =============================================================================
# PART 4: 5 GÜNLÜK TAHMİN TABLOSU
# =============================================================================

def gunluk_tahmin_yazdir(
    gunluk_tahmin: list[dict],
    adet: int = 5
) -> None:
    """
    5 günlük hava tahminini tablo şeklinde yazdırır.

    Args:
        gunluk_tahmin (list[dict]): Günlük tahmin listesi
        adet (int): Kaç gün gösterileceği
    """

    print("\n" + "=" * 80)
    print("5 GÜNLÜK HAVA TAHMİNİ")
    print("=" * 80)

    print(
        f"{'Tarih':<12} "
        f"{'Durum':<25} "
        f"{'En Yüksek':>12} "
        f"{'En Düşük':>12}"
    )

    print("-" * 80)

    for item in gunluk_tahmin[:adet]:
        durum = hava_durumu_acikla(
            item["weather_code"]
        )

        print(
            f"{item['tarih']:<12} "
            f"{durum:<25} "
            f"{item['en_yuksek']:>10.1f}°C "
            f"{item['en_dusuk']:>12.1f}°C"
        )

    print("=" * 80)


# =============================================================================
# PROGRAMI ÇALIŞTIR
# =============================================================================

if __name__ == "__main__":

    print("TEST 1: Program main kısmına girdi")

    sehir_adi = input("Hangi ilin hava durumunu görmek istersiniz? ")

    konum = sehir_konum_bul(sehir_adi)

    if konum:
        COORDINATES = konum

        veri = hava_durumu_cek(
            COORDINATES["latitude"],
            COORDINATES["longitude"]
        )

    else:
        veri = {} 

    print("TEST 2: Fonksiyondan geri dönüldü")
    print("Gelen veri:", veri)

    if veri:

        print("\n" + "=" * 80)
        print("ANLIK HAVA DURUMU")
        print("=" * 80)

        print(f"Şehir: {veri['sehir']}")
        print(f"Sıcaklık: {veri['sicaklik']} °C")
        print(f"Rüzgar Hızı: {veri['ruzgar_hizi']} km/h")

        hava_durumu_aciklama = hava_durumu_acikla(
            veri["weather_code"]
        )

        print(f"Hava Durumu: {hava_durumu_aciklama}")

        print("=" * 80)

        gunluk_tahmin_yazdir(
            veri["gunluk_tahmin"]
        )

    else:
        print("Veri alınamadı!")

# ====================================================================================================
# PART 5: Yeni Şehirler ekleniyor... 
# ====================================================================================================

