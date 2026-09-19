# Fashe incelemesi

Son gelen Downloads arşivi 2.0.2 olarak tanımlanıyor. Önceki açılmış kopyayla
dosya içerikleri karşılaştırıldı: ortak dosyalarda config/settings_schema.json ve
assets/base.css farklı. Yeni ZIP'te README.md, CHANGELOG.md, .shopifyignore ve
.theme-check.yml bulunmuyor; toplam 98 dosya var. 25 JSON, 50 şema ve 79 referans
kontrolü geçti. Ekler başlık boyutları, kart açıklama/puan stilleri, menü hizası
ve fotoğraf üzeri kontrast kuralları. Shopify bağımlılığı ve JS bulguları devam
ediyor. Eski README'nin lisans belirsizliğini çözen yeni bir lisans verilmemiş.

Arşiv theme-review/fashe klasörüne güvenli yol denetimiyle açıldı; yayın çıktısına dahil değildir.
102 dosyada 25 JSON, 50 Liquid şeması ve 79 statik şablon referansı kontrolü geçti.
theme.js sözdizimi kontrolü geçti. Shopify CLI ve gerçek mağaza testi yapılmadı;
bu kontrol kapsamlı bir güvenlik denetimi veya hatasızlık garantisi değildir.

Doğrudan entegrasyona uygun değil:

- README.md:124 lisansı Undecided olarak tanımlıyor.
- Liquid şablonları, müşteri formları ve sepet uçları Shopify gerektiriyor.
- theme.js:76–82 miktar düğmeleri max ve step değerlerini dikkate almıyor.
- changeCartLine HTTP başarısızlığını kullanıcıya bildirmiyor; çağıran dinleyiciler reddedilen Promise'i yakalamıyor.
- Arama metni kısalınca mevcut istek iptal edilmiyor. JSON arama geri dönüşü abort sinyali kullanmıyor; eski sonuçlar yeniden açılabilir.
- JSON arama sonuçlarında başlık ve URL doğrudan innerHTML içine yerleştiriliyor; güvenli metin/URL işlemesi gerekir.
- Sepete eklemede çekmece açılıyor; bu, DCMD'nin istenen davranışıyla çelişiyor.
- Yalnız İngilizce çeviri dosyaları mevcut.

Kullanıcının CSS örneklerinde seçicisiz bloklar, çakışan .card/.inner adları,
tanımlanması gereken 3D değişkenleri ve Tailwind gerektiren sınıflar var.
Birebir kopyalanmadılar. Özgün dcmd-editorial.css ve güncellenen dcmd-enhance.js
ile arama, kart, hata, yükleme yıldızı ve ön plan animasyonları uyarlandı.
Bölümler gizlenmez; hareket azaltma tercihi desteklenir. Sürekli dönen 3D ürün
listesi eklenmedi. Arşiv kaynakları yeniden dağıtılmadı.
