# DCMD satış hazırlığı

## Mevcut sürüm: yalnızca simülasyon

Gerçek tahsilat, kargo, e-posta, merkezi stok veya korumalı yönetici hesabı yoktur.
`commerce.js` test kapasitesini sayfa belleğinde tutar. Sayfa yenilenince sıfırlanır;
farklı müşteriler arasında paylaşılmaz. Footer'daki panel halka açık bir DEMO'dur,
üretim yönetici paneli olarak kullanılamaz. Gerçek satış bir bayrak değiştirilerek açılamaz.

- Üretim modeli: talep üzerine. Sayılar hazır ürün stoğu değil beden bazlı kapasitedir.
- EUR fiyatları: Europe 59.99, Capital/Black 49.99, Casual 39.99; minimum 39 EUR.
- Bedenler: XS, Small, Medium, Large, X Large, Oversize.
- Test kapasitesi her ürün için sırasıyla 2, 5, 8, 4, 1, 0. Kritik eşik 3.
- Sipariş öncesi kapasite ve fiyat doğrulanır; başarılı test siparişinde kapasite azalır.
- Tutarlar toplama sırasında euro cent olarak hesaplanır.
- İletişim/adres yalnızca ekran belleğinde kullanılır. Kart alanları değiştirilemeyen
  örneklerdir. Kişisel form verileri yerel depoya veya sunucuya yazılmaz.
- Son anonim test siparişi `dcmd-demo-order`, örnek oy `dcmd-demo-vote` anahtarında
  tutulur. Footer temizleme düğmesi bunları ve eski geri bildirim kaydını siler.
- Takip URL'si yalnızca aynı tarayıcının son kaydı içindir. Özel sekme veya başka
  cihazda gerçek takip gibi çalışmaz. Test durumları otomatik kargoya geçmez.
- E-posta ekranı taslaktır. Pazarlama tercihi test siparişinde ayrı kaydedilir;
  gerçek abonelik veya e-posta gönderimi yaratmaz.

## Politika ve şirket bilgileri

Kullanıcının son tercihi: gereksiz veriler tutulmayacak; gerçek kart verisi yalnızca
ödeme sağlayıcısında işlenecek. Telefon alanı eklenmedi. Gizlilik sayfası mevcut
test davranışını, platformun IP/teknik kayıtlarını ve gelecekteki sağlayıcı işlemlerini
ayrı açıklıyor. Sertifika henüz yok; alınırsa veren kurum, numara, kapsam, geçerlilik
ve doğrulama bağlantısı girilmeden rozet yayınlanmayacak. TLS sertifikası GDPR
belgelendirmesi yerine geçmez. Vercel log saklama/erişim ayarları panelden ayrıca incelenmeli.

Kaynak: kullanıcının `Desktop/DCMD/About us and Policy` klasöründeki üç dosya.
`policies/` altında Hakkımızda, Gizlilik, Kargo/İade ve Şartlar olarak ayrıldı;
sohbet zaman damgaları kaldırıldı, eksik hükümler tamamlanmış gibi gösterilmedi.
Gizlilik dosyası ilk bölümde kesiliyor. Şirket unvanı, ülke, adres, sicil/vergi
numarası, şirket/iade/iletişim e-postaları kullanıcı tarafından sonra verilecek.

Canlı satış öncesi eksiksiz veri sorumlusu, işleme amaçları/hukuki dayanaklar,
sağlayıcılar/aktarımlar, saklama süreleri, haklar ve başvuru yöntemi tamamlanmalı.
Hazırlık 3–7 iş günü ve ülke bazlı teslimat süreleri yalnızca kaynak taslaktır.
Kargo, vergiler, AB tüketici cayma/ayıplı mal hükümleri ve iade adresi netleştirilmeli.
Standart beden seçimi veya talep üzerine baskı otomatik olarak kişiselleştirilmiş
ürün istisnası sayılmamalı. İade metnindeki kullanılmamışlık koşulu, geri ödeme
süreleri ve cayma bildirimi akışı kayıt ülkesine göre gözden geçirilmeli.
Bu sürüm tam AB mevzuat uyumu veya hukuki inceleme sertifikası değildir.

## Gerçek hizmetlere geçiş sırası

1. Şirket ve tam politika metinlerini tamamla; vergi ve hedef pazar/kargo ücretlerini belirle.
2. Sunucuda kalıcı veritabanı ve kimlik doğrulamalı, MFA destekli yönetici alanı kur.
   Ürün/varyant fiyatları ve üretim kapasitesi sunucuda tek kaynak olmalı.
3. Ödeme sağlayıcısını şirket ülkesine göre seç. Sağlayıcının hosted checkout veya
   tokenleştirilmiş alanlarını kullan; kart numarası/CVC uygulamaya ulaşmamalı.
   Apple Pay/PayPal gerçek destek, domain doğrulaması ve hesap etkinleştirmesi ister.
4. Sunucu yalnızca ürün/varyant ID ve miktar kabul etsin; fiyat/kargo/vergi sunucudan
   hesaplanmalı. Stok/kapasite rezervasyonu atomik işlemle, son kullanma süresiyle tutulmalı.
5. İmzalı webhook doğrulanmadan sipariş paid yapılmamalı. Sağlayıcı event ID benzersiz,
   işleme idempotent olmalı. Aynı bildirimin tekrarı stok düşürmemeli veya mail çoğaltmamalı.
6. Başarılı ödeme işlemi ile birlikte veritabanı outbox kaydı oluştur; e-posta worker'ı
   retry/backoff ile göndersin. Doğrulanmış alan adı, SPF/DKIM/DMARC ve iade/bounce
   yönetimi tamamlanmalı. İşlemsel mail ve pazarlama izni ayrı tutulmalı.
7. Gerçek takip API'si tahmin edilemeyen süreli token/kullanıcı doğrulaması ve yetki
   kontrolü kullanmalı. Kargo durumları doğrulanmış taşıyıcı webhook'undan gelmeli.
8. Gerçek cayma/iade başvurusu, teslim onayı, stok/kapasite iadesi ve ücret iadesi akışını kur.
9. Ortak anket ve stoğa/kapasiteye haber verme için kalıcı veri, kötüye kullanım
   sınırlaması, ayrı bilgilendirme, saklama süresi ve silme akışı ekle.
10. Gerçek satıştan önce test/sandbox ödemesi, başarısız ödeme, çift webhook,
    eşzamanlı son kapasite, rezervasyon bitişi, iptal/iade ve e-posta hata senaryolarını doğrula.

## Güvenlik temeli

Vercel'de CSP (script kaynak kısıtı, object/base/form/frame kısıtları), nosniff,
frame engeli, referrer ve cihaz izin başlıkları var. CSP tek başına uygulama
güvenliği sağlamaz. Yeni ödeme SDK alan adları seçilen sağlayıcıya göre eklenmeli.
Şifreler/API anahtarları yalnızca Vercel Environment Variables'a konmalı;
istemci JS, HTML, public veya Git'e eklenmemeli. `.vercelignore` yerel ayarları dışlar.
Gerçek backend için yetkilendirme, CSRF/origin doğrulaması, distributed rate limit,
girdi doğrulama, loglarda PII maskeleme, yedek/geri dönüş, bağımlılık taraması ve
alarm sistemi ayrıca uygulanmalı. Test paneline gerçek yönetim işlemi eklenmemeli.

Mevcut font/harita hizmetleri ağ isteği yapar. Yeni reklam/analitik eklenmedi.
İleride isteğe bağlı izleyiciler eklenirse onay verilmeden yüklenmemeli; reddetme
ve geri alma kabul kadar kolay olmalı. Genel bir zorunlu gizlilik onayı, sözleşme
veya mevzuat kaynaklı veri işlemenin yerine geçirilmemeli.

Kaynaklar:
- https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_en.htm
- https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en
- https://docs.stripe.com/checkout/fulfillment (sağlayıcı seçimi değil, webhook örneği)
- https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html

## Test

## Hesap ve sipariş durumu arayüzü

Son akış: kartta adet seçilir; sepete ekleme çekmeceyi otomatik açar ve toplam
adet rozetini günceller. Yerel demo kapasitesi hem seçilen adet hem mevcut sepet
toplamı üzerinden denetlenir. Çekmece native dialog ile klavye odağını sınırlar.
Gerçek satış için SALES-READINESS.md takip edilir; Vercel tasarımı korunacaktır.

Üst çubukta sepet sayacı ve hesap düğmesi bulunur. Hesap penceresi henüz
kimlik doğrulama servisine bağlı değildir: alanlar devre dışıdır ve parola
toplanmaz. Gerçek üyelik için sağlayıcı/proje, güvenli oturum yönetimi,
e-posta doğrulama ve parola sıfırlama akışları ayrıca bağlanmalıdır.

Siparişlerde `processing` (sarı), `shipped` (yeşil), `cancelled` (kırmızı)
görünümleri desteklenir. Yeni test siparişleri `processing` başlar; otomatik
kargolama veya iptal yoktur. Tarayıcıdaki durum verisi yalnızca demodur.
Gerçek durum değişikliği gelecekte sunucudan doğrulanmalıdır.
Destek e-postası mağaza sahibi tarafından sağlanana kadar tanımlı değildir;
iptal bilgi alanı bunu açıkça belirtir.

`node test_account_status.cjs` üç ekran genişliğinde sayaç, hesap penceresi
ve sentetik siparişlerin üç durumunu test eder.

## Mevcut test akışı

`python server.py --port 8002`

`$env:DCMD_TEST_URL='http://127.0.0.1:8002'; node test_commerce_browser.cjs`

Yeni ürün: mevcut kart şablonunun `data-collection`, kategori, ad, ön/arka görsel
alanlarını güncelle. `commerce.js` görselin `-front.jpeg` adından sabit ürün ID'si
oluşturur, koleksiyon fiyatını ve tüm beden seçeneklerini uygular. Aynı ID tekrar
kullanılmamalıdır; gerçek katalogda kalıcı SKU ve sunucu doğrulaması gerekir.
