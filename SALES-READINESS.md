# DCMD satışa hazırlık

## Mevcut durum: demo — gerçek satışa açılmamalı

Ürün kartları, beden/adet seçimi, tarayıcıda stok denetimi, sepet sayacı,
erişilebilir çekmece, dil/tema ve test siparişi arayüzleri hazır.
Mevcut fiyatlar, kapasite ve sipariş durumları örnektir; gerçek stok değildir.
Kart/ödeme bilgisi toplanmaz. Hesap alanı devre dışıdır.

## Sağlanması ve uygulanması gerekenler

- Platform kararı alındı: mevcut DCMD/Vercel tasarımı korunacak, ticaret servisi
  bağlanacak. Sağlayıcı ve hesap erişimi henüz seçilmedi. Shopify Liquid ZIP'i
  mevcut statik sunucuda çalışmaz. Tema lisansı belirsizdir.
- Yetkili ödeme sağlayıcısı/mağaza projesi ve test ortamı. Gizli anahtarlar yalnızca
  sunucu ortam değişkenlerine konur; HTML/JS veya Git'e eklenmez.
- Sunucuda kalıcı ürün/SKU, varyant, fiyat, para birimi ve stok kaydı.
  İstemciden gelen fiyat/toplam güvenilmez; sunucu yeniden hesaplar.
- Stok rezervasyonu, yinelenen işlemlere dayanıklı sipariş oluşturma ve imzalı
  ödeme bildirimleri. Ödeme dönüş sayfası tek başına ödeme kanıtı değildir.
- Güvenli üyelik: doğrulanan e-posta, parola sıfırlama, oturum yönetimi,
  hız sınırlama ve kullanıcıya özel sipariş erişim denetimi.
- Şirket adı/adresi/vergi bilgileri, gerçek destek ve iade e-postaları.
- Gerçek ürün açıklamaları, materyal/bakım, beden ölçüleri, stok ve fiyatlar.
- Satış ülkeleri, vergi ve kargo kuralları, hazırlık süresi, iade akışı.
- İşletmenin onayladığı gizlilik, satış ve iade metinleri; taslaklar nihai değildir.
- Sipariş e-postaları, teslimat durumu entegrasyonu, iptal/geri ödeme akışı.
- İzleme, yedekleme/geri yükleme, erişim kayıtları ve veri saklama/silme süreci.

## Canlı satış açılış testleri

Başarılı/başarısız ödeme, 3D doğrulama, geciken/tekrarlanan webhook,
aynı son ürünü eşzamanlı satın alma, fiyat değiştirme girişimi, başka müşterinin
siparişine erişim, parola sıfırlama, iptal/geri ödeme ve e-posta teslimatı
sağlayıcının test ortamında geçmeden demo uyarıları kaldırılmaz.

Bu liste çalışır bir backend'in yerine geçmez. Sağlayıcı seçimi ve hesap
erişimleri olmadan gerçek satış, profil ve ödeme entegrasyonu tamamlanamaz.
