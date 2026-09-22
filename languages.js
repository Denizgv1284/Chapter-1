(() => {
  const codes = ['en','tr','pl','de','ru','zh'];
  const locales = {en:'en-GB',tr:'tr-TR',pl:'pl-PL',de:'de-DE',ru:'ru-RU',zh:'zh-CN'};
  let language = 'en';
  try { const saved=localStorage.getItem('dcmd-language'); if(codes.includes(saved)) language=saved; } catch {}
  // Source text | English | Turkish | Polish | German | Russian | Simplified Chinese.
  const rows = `
OUR STORY|OUR STORY|HİKÂYEMİZ|NASZA HISTORIA|UNSERE GESCHICHTE|НАША ИСТОРИЯ|我们的故事
Born from the shadows, designed for the spotlight.|Born from the shadows, designed for the spotlight.|Gölgelerden doğdu, sahne ışıkları için tasarlandı.|Zrodzeni z cienia, stworzeni do blasku reflektorów.|Aus dem Schatten geboren, für das Rampenlicht entworfen.|Рождённые в тени, созданные для света софитов.|诞生于暗影，为聚光灯而生。
DCMD isn't just a brand; it’s a silent statement. Born in the underground currents of modern culture, we set out to break the ordinary. We combine raw confidence, an aura of mystery, and absolute freedom with a sharp European streetwear identity. Every piece we craft is made for those who refuse to blend in—for the ones who write their own rules in the dark and own the room without saying a word.|DCMD isn't just a brand; it’s a silent statement. Born in the underground currents of modern culture, we set out to break the ordinary. We combine raw confidence, an aura of mystery, and absolute freedom with a sharp European streetwear identity. Every piece we craft is made for those who refuse to blend in—for the ones who write their own rules in the dark and own the room without saying a word.|DCMD sadece bir marka değil; sessiz ama güçlü bir ifade biçimi. Modern kültürün yeraltı akımlarından doğarak sıradanlığı kırmak için yola çıktık. Ham özgüveni, gizemli bir aurayı ve mutlak özgürlüğü keskin bir Avrupa sokak modası kimliğiyle harmanlıyoruz. Ürettiğimiz her parça, kalabalığın içinde kaybolmayı reddedenler—kendi kurallarını karanlıkta yazıp tek kelime etmeden tüm dikkatleri üzerine çekenler için tasarlandı.|DCMD to nie tylko marka; to cicha deklaracja. Zrodzeni w podziemnych nurtach współczesnej kultury, postanowiliśmy przełamać zwyczajność. Łączymy bezkompromisową pewność siebie, aurę tajemnicy i absolutną wolność z wyrazistą europejską tożsamością streetwearu. Każdy nasz projekt powstaje dla tych, którzy nie chcą wtapiać się w tłum—którzy piszą własne zasady w ciemności i przyciągają uwagę bez jednego słowa.|DCMD ist mehr als eine Marke; es ist ein stilles Statement. Entstanden in den Underground-Strömungen moderner Kultur, wollen wir das Gewöhnliche durchbrechen. Wir verbinden unverfälschtes Selbstbewusstsein, eine geheimnisvolle Aura und absolute Freiheit mit einer markanten europäischen Streetwear-Identität. Jedes Stück ist für Menschen gemacht, die nicht in der Masse untergehen—die im Dunkeln ihre eigenen Regeln schreiben und ohne ein Wort den Raum für sich gewinnen.|DCMD — не просто бренд, а негромкое, но сильное заявление. Родившись в андеграундных течениях современной культуры, мы решили выйти за рамки обыденного. Мы соединяем уверенность, ауру тайны и абсолютную свободу с выразительным европейским уличным стилем. Каждая вещь создана для тех, кто отказывается сливаться с толпой—кто пишет свои правила в темноте и притягивает взгляды, не произнося ни слова.|DCMD 不仅是一个品牌，更是一种无声的宣言。我们诞生于现代文化的地下潮流，立志打破平凡。我们将不加修饰的自信、神秘气质与绝对自由融入鲜明的欧洲街头服饰风格。每一件作品都为拒绝随波逐流的人而设计——他们在暗处书写自己的规则，无需言语便能吸引全场目光。
Your selection is saved.|Your selection is saved.|Seçimin kaydedildi.|Twój wybór został zapisany.|Deine Auswahl wurde gespeichert.|Ваш выбор сохранён.|你的选择已保存。
Change selection|Change selection|Seçimi değiştir|Zmień wybór|Auswahl ändern|Изменить выбор|更改选择
Selection could not be saved.|Selection could not be saved.|Seçim kaydedilemedi.|Nie udało się zapisać wyboru.|Auswahl konnte nicht gespeichert werden.|Не удалось сохранить выбор.|无法保存选择。
Browser storage is unavailable. Please try again.|Browser storage is unavailable. Please try again.|Tarayıcı depolaması kullanılamıyor. Lütfen tekrar dene.|Pamięć przeglądarki jest niedostępna. Spróbuj ponownie.|Browserspeicher nicht verfügbar. Bitte erneut versuchen.|Хранилище браузера недоступно. Попробуйте ещё раз.|浏览器存储不可用，请重试。
Beden seç|Choose size|Beden seç|Wybierz rozmiar|Größe wählen|Выбрать размер|选择尺码
Language|Language|Dil|Język|Sprache|Язык|语言
Retry|Retry|Tekrar dene|Spróbuj ponownie|Erneut versuchen|Повторить|重试
Locations are temporarily unavailable. Check your connection and retry.|Locations are temporarily unavailable. Check your connection and retry.|Konumlar şu anda yüklenemiyor. Bağlantını kontrol edip tekrar dene.|Lokalizacje są chwilowo niedostępne. Sprawdź połączenie i spróbuj ponownie.|Orte sind vorübergehend nicht verfügbar. Verbindung prüfen und erneut versuchen.|Места временно недоступны. Проверьте соединение и повторите.|地点暂不可用，请检查连接后重试。
Quantity|Quantity|Adet|Ilość|Menge|Количество|数量
Sign in|Sign in|Giriş yap|Zaloguj się|Anmelden|Войти|登录
Password|Password|Şifre|Hasło|Passwort|Пароль|密码
Email & password|Email & password|E-posta ve şifre|E-mail i hasło|E-Mail und Passwort|Почта и пароль|邮箱和密码
Sign in / Create account|Sign in / Create account|Giriş yap / Hesap oluştur|Zaloguj się / Utwórz konto|Anmelden / Konto erstellen|Войти / Создать аккаунт|登录 / 创建账号
Accounts are not available yet. No email or password is collected.|Accounts are not available yet. No email or password is collected.|Üyelik henüz açık değil. E-posta veya şifre toplanmaz.|Konta nie są jeszcze dostępne. Nie zbieramy e-maili ani haseł.|Konten sind noch nicht verfügbar. Keine E-Mails oder Passwörter werden erfasst.|Аккаунты пока недоступны. Почта и пароли не собираются.|账号功能尚未开放，不收集邮箱或密码。
Planned account features: profile, order history and saved preferences.|Planned account features: profile, order history and saved preferences.|Planlanan hesap özellikleri: profil, sipariş geçmişi ve kayıtlı tercihler.|Planowane funkcje: profil, historia zamówień i zapisane preferencje.|Geplante Funktionen: Profil, Bestellverlauf und gespeicherte Einstellungen.|Планируется: профиль, история заказов и сохранённые настройки.|计划提供：个人资料、订单历史和保存偏好。
Processing · Demo|Processing · Demo|İşleniyor · Demo|W trakcie · Demo|In Bearbeitung · Demo|В обработке · Демо|处理中 · 演示
Shipped · Demo|Shipped · Demo|Kargoya verildi · Demo|Wysłano · Demo|Versendet · Demo|Отправлено · Демо|已发货 · 演示
Cancelled · Demo|Cancelled · Demo|İptal edildi · Demo|Anulowano · Demo|Storniert · Demo|Отменено · Демо|已取消 · 演示
ⓘ Support contacts|ⓘ Support contacts|ⓘ Destek için hatlarımız|ⓘ Kontakt z pomocą|ⓘ Supportkontakt|ⓘ Контакты поддержки|ⓘ 联系客服
Support email is not configured yet.|Support email is not configured yet.|Destek e-posta adresi henüz tanımlanmadı.|E-mail pomocy nie został jeszcze ustawiony.|Support-E-Mail noch nicht eingerichtet.|Почта поддержки пока не указана.|尚未配置客服邮箱。
Önizleme:|Preview:|Önizleme:|Podgląd:|Vorschau:|Предпросмотр:|预览：
siparişi için cayma/iade talebi. Yanıt adresi:|return request. Reply address:|siparişi için cayma/iade talebi. Yanıt adresi:|wniosek o zwrot. Adres odpowiedzi:|Rückgabeanfrage. Antwortadresse:|запрос возврата. Адрес ответа:|退货申请。回复地址：
Gönderilmedi ve saklanmadı.|Not sent or saved.|Gönderilmedi ve saklanmadı.|Nie wysłano ani nie zapisano.|Nicht versendet oder gespeichert.|Не отправлено и не сохранено.|未发送或保存。
Alıcı:|To:|Alıcı:|Do:|An:|Кому:|收件人：
Konu: DCMD test siparişin alındı —|Subject: DCMD demo order received —|Konu: DCMD test siparişin alındı —|Temat: Zamówienie demo DCMD przyjęte —|Betreff: DCMD-Demobestellung erhalten —|Тема: Демозаказ DCMD принят —|主题：已收到DCMD演示订单 —
Merhaba|Hello|Merhaba|Witaj|Hallo|Здравствуйте|您好
Toplam:|Total:|Toplam:|Suma:|Gesamt:|Итого:|总计：
Ödeme:|Payment:|Ödeme:|Płatność:|Zahlung:|Оплата:|付款：
simülasyon|simulation|simülasyon|symulacja|Simulation|симуляция|模拟
Test takip bağlantın:|Your demo tracking link:|Test takip bağlantın:|Link śledzenia demo:|Dein Demo-Trackinglink:|Демо-ссылка отслеживания:|演示追踪链接：
DCMD test siparişini aldık. Bu işlemde ödeme alınmadı ve ürün gönderilmeyecek.|We received your DCMD demo order. No payment was taken and no products will be shipped.|DCMD test siparişini aldık. Bu işlemde ödeme alınmadı ve ürün gönderilmeyecek.|Otrzymaliśmy zamówienie demo DCMD. Bez płatności i wysyłki.|DCMD-Demobestellung erhalten. Keine Zahlung erfolgt und kein Versand.|Демозаказ DCMD получен. Оплата не списана, товары не отправляются.|已收到DCMD演示订单。未收款，也不会发货。
Bu bağlantı yalnızca siparişi oluşturduğun tarayıcıdaki son test kaydı için geçerlidir.|This link only works for the latest demo record in the browser that created it.|Bu bağlantı yalnızca siparişi oluşturduğun tarayıcıdaki son test kaydı için geçerlidir.|Link działa tylko dla ostatniego rekordu demo w tej przeglądarce.|Link gilt nur für den letzten Demodatensatz im ursprünglichen Browser.|Ссылка работает только для последней демозаписи в исходном браузере.|链接仅适用于创建订单的浏览器中的最新演示记录。
Bu bir e-posta önizlemesidir; gönderilmedi.|This is an email preview; it was not sent.|Bu bir e-posta önizlemesidir; gönderilmedi.|To podgląd e-maila; nie wysłano go.|Dies ist eine E-Mail-Vorschau; nicht versendet.|Это предпросмотр письма; оно не отправлено.|这是邮件预览，未发送。
Bu tarayıcıda bu test siparişi bulunamadı. Takip, siparişin oluşturulduğu tarayıcıda son kayıt için kullanılabilir.|Demo order not found. Tracking works for the latest order in its original browser.|Bu tarayıcıda bu test siparişi bulunamadı. Takip, siparişin oluşturulduğu tarayıcıda son kayıt için kullanılabilir.|Nie znaleziono zamówienia demo. Śledzenie ostatniego zamówienia działa w pierwotnej przeglądarce.|Demobestellung nicht gefunden. Tracking funktioniert für die letzte Bestellung im ursprünglichen Browser.|Демозаказ не найден. Отслеживание последнего заказа доступно в исходном браузере.|未找到演示订单。追踪仅适用于原浏览器中的最新订单。
Test geri bildirimi alındı. Gönderilmedi veya saklanmadı.|Demo feedback received. Not sent or saved.|Test geri bildirimi alındı. Gönderilmedi veya saklanmadı.|Opinia demo odebrana. Nie wysłano ani nie zapisano.|Demo-Feedback erhalten. Nicht versendet oder gespeichert.|Демоотзыв получен. Не отправлен и не сохранён.|已收到演示反馈，未发送或保存。
Anketi kapat|Close poll|Anketi kapat|Zamknij ankietę|Umfrage schließen|Закрыть опрос|关闭投票
İade talebini kapat|Close return request|İade talebini kapat|Zamknij wniosek|Rückgabe schließen|Закрыть возврат|关闭退货申请
Takibi kapat|Close tracking|Takibi kapat|Zamknij śledzenie|Tracking schließen|Закрыть отслеживание|关闭追踪
Paneli kapat|Close panel|Paneli kapat|Zamknij panel|Panel schließen|Закрыть панель|关闭面板
Örnek kart numarası|Sample card number|Örnek kart numarası|Przykładowy numer karty|Beispielkartennummer|Пример номера карты|示例卡号
ALMANYA / DE|GERMANY / DE|ALMANYA / DE|NIEMCY / DE|DEUTSCHLAND / DE|ГЕРМАНИЯ / DE|德国 / DE
İTALYA / IT|ITALY / IT|İTALYA / IT|WŁOCHY / IT|ITALIEN / IT|ИТАЛИЯ / IT|意大利 / IT
İSPANYA / ES|SPAIN / ES|İSPANYA / ES|HISZPANIA / ES|SPANIEN / ES|ИСПАНИЯ / ES|西班牙 / ES
PORTEKİZ / PT|PORTUGAL / PT|PORTEKİZ / PT|PORTUGALIA / PT|PORTUGAL / PT|ПОРТУГАЛИЯ / PT|葡萄牙 / PT
TÜRKİYE / TR|TÜRKİYE / TR|TÜRKİYE / TR|TURCJA / TR|TÜRKEI / TR|ТУРЦИЯ / TR|土耳其 / TR
Talep üzerine üretim · Taslak hazırlık süresi 3–7 iş günü. Gerçek teslimat, vergi ve kargo tutarları satış başlamadan kesinleştirilecek.|Made to order · Draft lead time: 3–7 business days. Delivery, taxes and shipping will be confirmed before sales begin.|Talep üzerine üretim · Taslak hazırlık süresi 3–7 iş günü. Teslimat, vergi ve kargo satış öncesi kesinleşecek.|Na zamówienie · Wstępny czas: 3–7 dni roboczych. Dostawa i opłaty zostaną ustalone przed sprzedażą.|Auf Bestellung · Vorläufig 3–7 Werktage. Lieferung und Abgaben werden vor Verkaufsstart bestätigt.|Под заказ · Предварительно 3–7 рабочих дней. Сроки и сборы уточнят до начала продаж.|按需生产 · 暂定3–7个工作日。配送、税费与运费将在销售前确认。
Şartlar|Terms|Şartlar|Regulamin|Bedingungen|Условия|条款
ve|and|ve|i|und|и|及
kargo/iade taslağını|shipping/returns draft|kargo/iade taslağını|projekt dostawy i zwrotów|Versand-/Retourenentwurf|проект доставки и возврата|配送与退货草案
okudum. Bunun gerçek ödeme veya sipariş oluşturmadığını anladım.|read. I understand this does not create a real payment or order.|okudum. Bunun gerçek ödeme veya sipariş oluşturmadığını anladım.|przeczytane. Rozumiem, że to nie jest prawdziwa płatność ani zamówienie.|gelesen. Dies ist keine echte Zahlung oder Bestellung.|прочитаны. Это не реальный платёж или заказ.|已阅读。我理解这不会产生真实付款或订单。
Gizlilik bilgilendirmesi|Privacy notice|Gizlilik bilgilendirmesi|Informacja o prywatności|Datenschutzhinweis|Уведомление о конфиденциальности|隐私说明
: Form bilgileri test e-posta önizlemesi için kullanılır. Pazarlama izni siparişin koşulu değildir.|: Form details are used for a demo email preview. Marketing consent is optional.|: Form bilgileri test e-posta önizlemesi içindir. Pazarlama izni isteğe bağlıdır.|: Dane służą do podglądu e-maila demo. Zgoda marketingowa jest dobrowolna.|: Daten dienen einer Demo-E-Mail-Vorschau. Marketingeinwilligung ist freiwillig.|: Данные используются для демописьма. Согласие на маркетинг необязательно.|：表单信息用于演示邮件预览，营销同意为可选项。
Kart bilgilerinizi bu forma girmeyin. Mevcut sürüm telefon numarası istemez; iletişim ve adres bilgilerini sunucuya göndermez. Barındırma ve dış hizmetler bağlantı sırasında IP/teknik bilgileri işleyebilir.|Do not enter real card details. Contact and address data stay in this browser. Hosting and external services may process IP and technical data.|Gerçek kart bilgisi girmeyin. İletişim ve adres bilgileri tarayıcıda kalır. Barındırma ve dış hizmetler IP ve teknik veri işleyebilir.|Nie wpisuj danych prawdziwej karty. Dane kontaktowe i adres zostają w przeglądarce. Hosting i usługi zewnętrzne mogą przetwarzać IP i dane techniczne.|Keine echten Kartendaten eingeben. Kontakt- und Adressdaten bleiben im Browser. Hosting und externe Dienste können IP- und technische Daten verarbeiten.|Не вводите данные настоящей карты. Контакты и адрес остаются в браузере. Хостинг и внешние сервисы могут обрабатывать IP и технические данные.|请勿输入真实卡片信息。联系信息与地址仅留在浏览器中。托管及外部服务可能处理IP和技术数据。
Ayrıntılar|Details|Ayrıntılar|Szczegóły|Details|Подробнее|详情
Kampanya e-postaları almak istiyorum (isteğe bağlı test tercihi; abonelik oluşturulmaz).|I'd like promotional emails (optional demo preference; no subscription is created).|Kampanya e-postaları almak istiyorum (isteğe bağlı test tercihi; abonelik oluşturulmaz).|Chcę e-maile promocyjne (dobrowolna opcja demo; bez subskrypcji).|Ich möchte Werbe-E-Mails (freiwillige Demoauswahl; kein Abonnement).|Хочу рекламные письма (необязательная демоопция; подписка не создаётся).|我愿意接收推广邮件（可选演示偏好，不创建订阅）。
Takip bağlantısı yalnızca bu tarayıcıdaki test kaydını açar. Gerçek kargo bağlantısı değildir.|Tracking opens the demo record in this browser only. It is not a carrier link.|Takip bağlantısı yalnızca bu tarayıcıdaki test kaydını açar. Gerçek kargo bağlantısı değildir.|Śledzenie otwiera tylko rekord demo w tej przeglądarce. To nie jest link przewoźnika.|Tracking öffnet nur den Demodatensatz dieses Browsers, keine Sendungsverfolgung.|Ссылка открывает демозапись в этом браузере, а не сайт перевозчика.|追踪链接仅打开此浏览器的演示记录，并非物流链接。
Müşteriye gönderilecek e-posta — önizleme|Customer email — preview|Müşteriye gönderilecek e-posta — önizleme|E-mail klienta — podgląd|Kunden-E-Mail — Vorschau|Письмо клиенту — предпросмотр|客户邮件 — 预览
E-posta gönderilmedi. Bu, sipariş bildiriminin taslağıdır.|No email sent. This is a draft order notification.|E-posta gönderilmedi. Bu, sipariş bildiriminin taslağıdır.|E-mail nie został wysłany. To projekt powiadomienia.|Keine E-Mail gesendet. Dies ist ein Benachrichtigungsentwurf.|Письмо не отправлено. Это черновик уведомления.|未发送邮件，这只是订单通知草稿。
Bu form yalnızca test önizlemesi oluşturur. Şirkete talep veya e-posta göndermez.|This form creates a demo preview only. Nothing is sent to the company.|Bu form yalnızca test önizlemesi oluşturur. Şirkete talep veya e-posta göndermez.|Formularz tworzy tylko podgląd demo. Nic nie wysyła do firmy.|Dieses Formular erstellt nur eine Demovorschau. Nichts wird versendet.|Форма создаёт только демопредпросмотр. Ничего не отправляется компании.|此表单仅创建演示预览，不会向公司发送任何内容。
Bu ekran bir testtir. Kargo firmasına bağlı değildir ve gerçek teslimat durumunu göstermez.|Demo screen. Not connected to a carrier; no real delivery status.|Bu ekran bir testtir. Kargo firmasına bağlı değildir ve gerçek teslimat durumunu göstermez.|Ekran demo. Bez połączenia z przewoźnikiem i rzeczywistego statusu dostawy.|Demoansicht ohne Verbindung zum Versanddienst und ohne echten Lieferstatus.|Демоэкран без связи с перевозчиком и без реального статуса доставки.|演示页面，未连接物流公司，不显示真实配送状态。
Yalnızca bu sayfa oturumunun örnek kapasitesi. Gerçek yönetici paneli değildir; sayfa yenilenince sıfırlanır. Kritik eşik: 3.|Sample capacity for this session. Not a real admin panel; resets on reload. Low-capacity threshold: 3.|Bu oturuma ait örnek kapasite. Gerçek yönetici paneli değildir; yenilemede sıfırlanır. Kritik eşik: 3.|Przykładowa pojemność sesji. To nie jest panel administratora; reset po odświeżeniu. Próg: 3.|Beispielkapazität dieser Sitzung. Kein Adminpanel; Reset beim Neuladen. Schwelle: 3.|Демолимит сеанса. Не панель администратора; сбрасывается при обновлении. Порог: 3.|当前会话示例产能，非真实管理面板，刷新后重置。低产能阈值：3。
Ürün veya fiyat değişti. Sepeti yeniden oluştur.|Product or price changed. Rebuild your cart.|Ürün veya fiyat değişti. Sepeti yeniden oluştur.|Produkt lub cena się zmieniły. Utwórz koszyk ponownie.|Artikel oder Preis geändert. Warenkorb neu erstellen.|Товар или цена изменились. Соберите корзину заново.|商品或价格已变化，请重新添加购物车。
yeterli test üretim kapasitesi yok.|not enough demo production capacity.|yeterli test üretim kapasitesi yok.|brak wystarczającej pojemności demo.|nicht genügend Demokapazität.|недостаточно демомест.|演示产能不足。
Lütfen teslimat alanlarını boş bırakma.|Please complete the delivery fields.|Lütfen teslimat alanlarını boş bırakma.|Uzupełnij dane dostawy.|Bitte Lieferfelder ausfüllen.|Заполните поля доставки.|请填写配送信息。
test simülasyonu. Hesap açılmaz, giriş yapılmaz ve para çekilmez.|demo simulation. No account, sign-in or charges.|test simülasyonu. Hesap açılmaz, giriş yapılmaz ve para çekilmez.|symulacja demo. Bez konta, logowania i opłat.|Demosimulation. Kein Konto, Login oder Zahlung.|демосимуляция. Без аккаунта, входа и списаний.|演示模拟，不创建账号、不登录、不扣款。
Bu tarayıcıdaki test kayıtları temizlendi.|Demo data cleared in this browser.|Bu tarayıcıdaki test kayıtları temizlendi.|Dane demo w przeglądarce usunięte.|Demodaten dieses Browsers gelöscht.|Демоданные браузера удалены.|此浏览器的演示数据已清除。
seçimin test için kaydedildi. Bu tarayıcıda değiştirebilirsin; ortak oylama henüz açık değil.|choice saved for the demo. You can change it in this browser; public voting is not open yet.|seçimin test için kaydedildi. Bu tarayıcıda değiştirebilirsin; ortak oylama henüz açık değil.|wybór zapisany w demo. Możesz go zmienić w przeglądarce; publiczne głosowanie jest zamknięte.|Auswahl in der Demo gespeichert. Im Browser änderbar; öffentliche Abstimmung noch geschlossen.|выбор сохранён в демо. Можно изменить в браузере; общее голосование пока закрыто.|选择已保存为演示。可在此浏览器修改，公共投票尚未开放。
Test siparişi alındı|Demo order received|Test siparişi alındı|Zamówienie demo przyjęte|Demobestellung erhalten|Демозаказ принят|已收到演示订单
Hazırlanıyor — testte başlatılmadı|Preparing — not started in demo|Hazırlanıyor — testte başlatılmadı|Przygotowanie — nie rozpoczęto w demo|Vorbereitung — in Demo nicht gestartet|Подготовка — в демо не начата|准备中 — 演示中未开始
Kargoya verildi — testte başlatılmadı|Shipped — not started in demo|Kargoya verildi — testte başlatılmadı|Wysłano — nie rozpoczęto w demo|Versand — in Demo nicht gestartet|Отправка — в демо не начата|已发货 — 演示中未开始
Teslim edildi — testte başlatılmadı|Delivered — not started in demo|Teslim edildi — testte başlatılmadı|Dostarczono — nie rozpoczęto w demo|Zustellung — in Demo nicht gestartet|Доставка — в демо не начата|已送达 — 演示中未开始
Beden / Size|Size|Beden|Rozmiar|Größe|Размер|尺码
Beden|Size|Beden|Rozmiar|Größe|Размер|尺码
Small|Small|Küçük|Mały|Klein|Маленький|小码
Medium|Medium|Orta|Średni|Mittel|Средний|中码
Large|Large|Büyük|Duży|Groß|Большой|大码
X Large|Extra large|Çok büyük|Bardzo duży|Extragroß|Очень большой|加大码
Oversize|Oversize|Bol kesim|Oversize|Oversize|Оверсайз|宽松
Talep üzerine üretim · Test kapasitesi|Made to order · Demo capacity|Talep üzerine üretim · Test kapasitesi|Produkcja na zamówienie · Pojemność demo|Auf Bestellung · Demokapazität|Под заказ · Демо-лимит|按需生产 · 演示产能
Üretim kapasitesi dolu|Production capacity full|Üretim kapasitesi dolu|Brak wolnych miejsc produkcji|Produktionskapazität ausgeschöpft|Производственный лимит исчерпан|产能已满
Kapasite dolu|Capacity full|Kapasite dolu|Brak miejsc|Kapazität voll|Лимит исчерпан|产能已满
Kritik kapasite|Low capacity|Kritik kapasite|Niska dostępność|Geringe Kapazität|Мало мест|产能紧张
Üretime uygun|Available for production|Üretime uygun|Dostępne do produkcji|Produktion möglich|Доступно для производства|可生产
Added to cart|Added to cart|Sepete eklendi|Dodano do koszyka|Zum Warenkorb hinzugefügt|Добавлено в корзину|已加入购物车
Hakkımızda / Kurumsal bilgiler|About / Company information|Hakkımızda / Kurumsal bilgiler|O nas / Dane firmy|Über uns / Unternehmensdaten|О нас / Данные компании|关于我们 / 公司信息
Hakkımızda|About us|Hakkımızda|O nas|Über uns|О нас|关于我们
Şirket unvanı: Kuruluş aşamasında|Company: Being established|Şirket unvanı: Kuruluş aşamasında|Firma: W trakcie tworzenia|Unternehmen: In Gründung|Компания: В процессе создания|公司：筹建中
Şirket e-postası: Eklenecek|Company email: Not yet available|Şirket e-postası: Henüz hazır değil|E-mail firmy: Jeszcze niedostępny|Firmen-E-Mail: Noch nicht verfügbar|Почта компании: Пока недоступна|公司邮箱：暂未提供
İade e-postası: Eklenecek|Returns email: Not yet available|İade e-postası: Henüz hazır değil|E-mail zwrotów: Jeszcze niedostępny|Retouren-E-Mail: Noch nicht verfügbar|Почта для возвратов: Пока недоступна|退货邮箱：暂未提供
İletişim e-postası: Eklenecek|Contact email: Not yet available|İletişim e-postası: Henüz hazır değil|E-mail kontaktowy: Jeszcze niedostępny|Kontakt-E-Mail: Noch nicht verfügbar|Контактная почта: Пока недоступна|联系邮箱：暂未提供
Kayıtlı adres, ülke ve vergi numarası: Eklenecek|Registered address, country and tax ID: Not yet available|Kayıtlı adres, ülke ve vergi numarası: Henüz hazır değil|Adres, kraj i NIP: Jeszcze niedostępne|Adresse, Land und Steuernummer: Noch nicht verfügbar|Адрес, страна и налоговый номер: Пока недоступны|注册地址、国家和税号：暂未提供
Test mağazası. Gerçek sipariş ve ödeme kabul edilmez.|Demo store. No real orders or payments accepted.|Test mağazası. Gerçek sipariş ve ödeme kabul edilmez.|Sklep demo. Bez prawdziwych zamówień i płatności.|Demoshop. Keine echten Bestellungen oder Zahlungen.|Демомагазин. Реальные заказы и платежи не принимаются.|演示商店，不接受真实订单或付款。
Gizlilik politikası (taslak)|Privacy policy (draft)|Gizlilik politikası (taslak)|Polityka prywatności (projekt)|Datenschutz (Entwurf)|Конфиденциальность (проект)|隐私政策（草案）
Kargo, iade ve cayma (taslak)|Shipping and returns (draft)|Kargo, iade ve cayma (taslak)|Dostawa i zwroty (projekt)|Versand und Widerruf (Entwurf)|Доставка и возврат (проект)|配送与退货（草案）
Şartlar ve koşullar (taslak)|Terms and conditions (draft)|Şartlar ve koşullar (taslak)|Regulamin (projekt)|AGB (Entwurf)|Условия (проект)|条款与条件（草案）
Test üretim paneli|Demo inventory|Test üretim paneli|Panel produkcji demo|Demo-Bestand|Демо-инвентарь|演示库存
Test kayıtlarımı temizle|Clear my demo data|Test kayıtlarımı temizle|Usuń moje dane demo|Meine Demodaten löschen|Удалить мои демоданные|清除演示数据
Cayma / iade talebi (test)|Return request (demo)|Cayma / iade talebi (test)|Zwrot (demo)|Rückgabe (Demo)|Возврат (демо)|退货申请（演示）
Contact DCMD|Contact DCMD|DCMD ile iletişim|Kontakt z DCMD|DCMD kontaktieren|Связаться с DCMD|联系DCMD
Shop the collection|Shop the collection|Koleksiyonu keşfet|Odkryj kolekcję|Kollektion entdecken|Смотреть коллекцию|探索系列
DCMD campaign|DCMD campaign|DCMD kampanyası|Kampania DCMD|DCMD-Kampagne|Кампания DCMD|DCMD宣传大片
Two cities. One mindset.|Two cities. One mindset.|İki şehir. Tek bakış açısı.|Dwa miasta. Jedna wizja.|Zwei Städte. Eine Haltung.|Два города. Один взгляд.|两座城市，同一种态度。
Front and back details, worn as designed. Explore the Capital and Black collections through the campaign cast.|Front and back details, worn as designed. Explore the Capital and Black collections through the campaign cast.|Ön ve arka detayları model üzerinde incele. Capital ve Black koleksiyonlarını keşfet.|Zobacz przód i tył na modelach. Odkryj kolekcje Capital i Black.|Vorder- und Rückseite am Model. Entdecke Capital und Black.|Детали спереди и сзади на моделях. Открой коллекции Capital и Black.|通过模特欣赏正反面细节，探索Capital和Black系列。
View front & back|View front & back|Önü ve arkayı gör|Zobacz przód i tył|Vorder- und Rückseite|Вид спереди и сзади|查看正反面
Explore the piece|Explore the piece|Ürünü incele|Zobacz produkt|Artikel entdecken|Смотреть товар|探索单品
Sıradaki şehir|Next city|Sıradaki şehir|Następne miasto|Nächste Stadt|Следующий город|下一座城市
Bir şehir.|One city.|Bir şehir.|Jedno miasto.|Eine Stadt.|Один город.|一座城市。
Senin izin.|Your mark.|Senin izin.|Twój ślad.|Deine Spur.|Твой след.|你的印记。
Sıradaki tasarıma yön ver.|Shape the next design.|Sıradaki tasarıma yön ver.|Wpłyń na kolejny projekt.|Gestalte das nächste Design mit.|Определи следующий дизайн.|影响下一款设计。
Hangi başkenti üzerinde taşımak istersin?|Which capital would you wear?|Hangi başkenti üzerinde taşımak istersin?|Którą stolicę chcesz nosić?|Welche Hauptstadt möchtest du tragen?|Какую столицу ты хочешь носить?|你想穿上哪座首都？
Başkentini seç|Choose your capital|Başkentini seç|Wybierz stolicę|Hauptstadt wählen|Выбери столицу|选择首都
Seçimini bırak|Cast your vote|Seçimini bırak|Zagłosuj|Abstimmen|Проголосовать|投票
Anket önizlemesi · Seçimin yalnızca bu tarayıcıda saklanır. Ortak oylama henüz açık değil.|Demo poll · Your choice stays in this browser. Public voting is not open yet.|Anket önizlemesi · Seçimin yalnızca bu tarayıcıda saklanır. Ortak oylama henüz açık değil.|Ankieta demo · Wybór pozostaje w przeglądarce. Publiczne głosowanie jeszcze nie działa.|Demo-Umfrage · Auswahl nur in diesem Browser. Öffentliche Abstimmung noch nicht aktiv.|Демо-опрос · Выбор хранится в браузере. Общее голосование пока закрыто.|演示投票 · 选择仅存于此浏览器，公共投票尚未开放。
Siparişini tamamla|Complete your order|Siparişini tamamla|Dokończ zamówienie|Bestellung abschließen|Оформить заказ|完成订单
Test mağazası · Para çekilmez, ürün gönderilmez ve e-posta gönderilmez. Örnek bilgilerle deneyebilirsin.|Demo store · No charges, shipments or emails. Use sample details.|Test mağazası · Para çekilmez, ürün veya e-posta gönderilmez. Örnek bilgi kullan.|Sklep demo · Bez opłat, wysyłki i e-maili. Użyj przykładowych danych.|Demoshop · Keine Zahlung, Lieferung oder E-Mail. Beispieldaten verwenden.|Демомагазин · Без списаний, доставки и писем. Используй тестовые данные.|演示商店 · 不收费、不发货、不发送邮件。请使用示例信息。
01 / İletişim ve teslimat|01 / Contact and delivery|01 / İletişim ve teslimat|01 / Kontakt i dostawa|01 / Kontakt und Lieferung|01 / Контакты и доставка|01 / 联系与配送
Ad soyad|Full name|Ad soyad|Imię i nazwisko|Vollständiger Name|Полное имя|姓名
Adınız ve soyadınız|Your full name|Adınız ve soyadınız|Twoje imię i nazwisko|Dein vollständiger Name|Ваше полное имя|您的姓名
E-posta|Email|E-posta|E-mail|E-Mail|Эл. почта|电子邮箱
E-posta adresiniz|Your email address|E-posta adresiniz|Twój e-mail|Deine E-Mail-Adresse|Ваш адрес почты|您的邮箱地址
Sipariş e-postasının önizlemesinde kullanılır.|Used in the order email preview.|Sipariş e-postasının önizlemesinde kullanılır.|Do podglądu e-maila zamówienia.|Für die Bestell-E-Mail-Vorschau.|Для предпросмотра письма о заказе.|用于订单邮件预览。
Teslimat adresi|Delivery address|Teslimat adresi|Adres dostawy|Lieferadresse|Адрес доставки|收货地址
Cadde, sokak, bina ve daire numarası|Street, building and apartment|Cadde, sokak, bina ve daire numarası|Ulica, budynek i mieszkanie|Straße, Haus und Wohnung|Улица, дом и квартира|街道、楼号和房号
Şehir|City|Şehir|Miasto|Stadt|Город|城市
Posta kodu|Postal code|Posta kodu|Kod pocztowy|Postleitzahl|Индекс|邮政编码
02 / Ödeme yöntemi|02 / Payment method|02 / Ödeme yöntemi|02 / Metoda płatności|02 / Zahlungsart|02 / Способ оплаты|02 / 付款方式
Kredi kartı|Credit card|Kredi kartı|Karta kredytowa|Kreditkarte|Кредитная карта|信用卡
Banka kartı|Debit card|Banka kartı|Karta debetowa|Debitkarte|Дебетовая карта|借记卡
Kart numarası|Card number|Kart numarası|Numer karty|Kartennummer|Номер карты|卡号
Son kullanma|Expiry date|Son kullanma|Data ważności|Gültig bis|Срок действия|有效期
Hazır test kartı kullanılır. Gerçek kart bilgisi girilmez veya saklanmaz.|A sample card is used. No real card details are entered or stored.|Hazır test kartı kullanılır. Gerçek kart bilgisi girilmez veya saklanmaz.|Używana jest karta testowa. Prawdziwe dane nie są wpisywane ani zapisywane.|Eine Testkarte wird verwendet. Keine echten Kartendaten werden eingegeben oder gespeichert.|Используется тестовая карта. Реальные данные не вводятся и не хранятся.|使用示例卡，不输入或保存真实卡片信息。
Sipariş özeti|Order summary|Sipariş özeti|Podsumowanie zamówienia|Bestellübersicht|Состав заказа|订单摘要
Ürünler|Items|Ürünler|Produkty|Artikel|Товары|商品
Ürün|Product|Ürün|Produkt|Artikel|Товар|商品
Test teslimatı|Demo delivery|Test teslimatı|Dostawa demo|Demo-Lieferung|Демо-доставка|演示配送
Ücretsiz|Free|Ücretsiz|Bezpłatnie|Kostenlos|Бесплатно|免费
Toplam (EUR)|Total (EUR)|Toplam (EUR)|Suma (EUR)|Gesamt (EUR)|Итого (EUR)|总计（EUR）
Örnek fiyatlar. Gerçek vergi ve kargo hesaplaması uygulanmaz.|Sample prices. Real taxes and shipping are not calculated.|Örnek fiyatlar. Gerçek vergi ve kargo hesaplaması uygulanmaz.|Przykładowe ceny. Bez rzeczywistych podatków i kosztów dostawy.|Beispielpreise. Keine echten Steuern oder Versandkosten.|Примерные цены. Налоги и доставка не рассчитываются.|示例价格，不计算真实税费和运费。
Test siparişini oluştur|Place demo order|Test siparişini oluştur|Złóż zamówienie demo|Demobestellung aufgeben|Создать демозаказ|创建演示订单
Test siparişin oluşturuldu|Demo order created|Test siparişin oluşturuldu|Zamówienie demo utworzone|Demobestellung erstellt|Демозаказ создан|演示订单已创建
Test siparişini takip et ↗|Track demo order ↗|Test siparişini takip et ↗|Śledź zamówienie demo ↗|Demobestellung verfolgen ↗|Отследить демозаказ ↗|追踪演示订单 ↗
Cayma / iade talebi|Return request|Cayma / iade talebi|Wniosek o zwrot|Rückgabeanfrage|Запрос возврата|退货申请
Sipariş numarası|Order number|Sipariş numarası|Numer zamówienia|Bestellnummer|Номер заказа|订单号
Açıklama (isteğe bağlı)|Message (optional)|Açıklama (isteğe bağlı)|Wiadomość (opcjonalnie)|Nachricht (optional)|Сообщение (необязательно)|留言（选填）
Test talebini önizle|Preview demo request|Test talebini önizle|Podgląd wniosku demo|Demoanfrage ansehen|Просмотр демозапроса|预览演示申请
Sipariş takibi|Order tracking|Sipariş takibi|Śledzenie zamówienia|Sendungsverfolgung|Отслеживание заказа|订单追踪
Test üretim kapasitesi|Demo production capacity|Test üretim kapasitesi|Produkcyjna pojemność demo|Demo-Produktionskapazität|Демо-производственная мощность|演示产能
Test kapasitesini sıfırla|Reset demo capacity|Test kapasitesini sıfırla|Resetuj pojemność demo|Demokapazität zurücksetzen|Сбросить демолимит|重置演示产能
Kapasite|Capacity|Kapasite|Dostępność|Kapazität|Лимит|产能
Durum|Status|Durum|Status|Status|Статус|状态
Collections|Collections|Koleksiyonlar|Kolekcje|Kollektionen|Коллекции|系列
All collections|All collections|Tüm koleksiyonlar|Wszystkie kolekcje|Alle Kollektionen|Все коллекции|所有系列
Shorts|Shorts|Şort|Szorty|Shorts|Шорты|短裤
No products match these filters.|No products match these filters.|Bu filtrelere uygun ürün yok.|Brak produktów dla tych filtrów.|Keine passenden Produkte.|Нет подходящих товаров.|没有符合筛选条件的商品。
Coming soon|Coming soon|Yakında|Wkrótce|Demnächst|Скоро|即将推出
Open menu|Open menu|Menüyü aç|Otwórz menu|Menü öffnen|Открыть меню|打开菜单
Close menu|Close menu|Menüyü kapat|Zamknij menu|Menü schließen|Закрыть меню|关闭菜单
Previous photo|Previous photo|Önceki fotoğraf|Poprzednie zdjęcie|Vorheriges Foto|Предыдущее фото|上一张照片
Next photo|Next photo|Sonraki fotoğraf|Następne zdjęcie|Nächstes Foto|Следующее фото|下一张照片
Front|Front|Ön|Przód|Vorderseite|Спереди|正面
Back|Back|Arka|Tył|Rückseite|Сзади|背面
Product photos|Product photos|Ürün fotoğrafları|Zdjęcia produktu|Produktfotos|Фото товара|商品照片
FREE SHIPPING ON ORDERS OVER $50|FREE SHIPPING ON ORDERS OVER $50|50 $ ÜZERİ SİPARİŞLERDE ÜCRETSİZ KARGO|DARMOWA DOSTAWA OD 50 USD|KOSTENLOSER VERSAND AB 50 $|БЕСПЛАТНАЯ ДОСТАВКА ОТ 50 $|订单满50美元免运费
New Arrivals|New Arrivals|Yeni Ürünler|Nowości|Neuheiten|Новинки|新品
Havaya Göre Giyin|Dress for the weather|Havaya Göre Giyin|Ubierz się do pogody|Passend zum Wetter|Одежда по погоде|按天气穿搭
Our Story|Our Story|Hikâyemiz|Nasza historia|Unsere Geschichte|О нас|品牌故事
Contact|Contact|İletişim|Kontakt|Kontakt|Контакты|联系我们
CONTACT|CONTACT|İLETİŞİM|KONTAKT|KONTAKT|КОНТАКТЫ|联系我们
SEARCH|SEARCH|ARA|SZUKAJ|SUCHE|ПОИСК|搜索
CART|CART|SEPET|KOSZYK|WARENKORB|КОРЗИНА|购物车
Don't Fit In.|Don't Fit In.|Kalıplara Sığma.|Nie wtapiaј się w tłum.|Pass dich nicht an.|Не сливайся с толпой.|不随波逐流。
Stand Out.|Stand Out.|Farkını Göster.|Wyróżnij się.|Stich heraus.|Выделяйся.|展现自我。
Different. Confident. Mysterious. Desirable. Discover the new DCMD streetwear collection.|Different. Confident. Mysterious. Desirable. Discover the new DCMD streetwear collection.|Farklı. Özgüvenli. Gizemli. Çekici. Yeni DCMD sokak giyimi koleksiyonunu keşfet.|Inny. Pewny siebie. Tajemniczy. Pożądany. Odkryj nową kolekcję DCMD.|Anders. Selbstbewusst. Geheimnisvoll. Begehrenswert. Entdecke die neue DCMD-Kollektion.|Необычный. Уверенный. Загадочный. Желанный. Открой новую коллекцию DCMD.|独特。自信。神秘。迷人。探索DCMD全新街头服饰系列。
Shop The collection & Feel special.|Shop the collection & feel special.|Koleksiyonu keşfet, özel hisset.|Odkryj kolekcję i poczuj się wyjątkowo.|Entdecke die Kollektion.|Открой коллекцию и почувствуй себя особенным.|探索系列，感受独特。
⌖ Haritadan havana göre kombin bul ↗|⌖ Find your weather outfit on the map ↗|⌖ Haritadan havana göre kombin bul ↗|⌖ Znajdź stylizację na mapie ↗|⌖ Wetter-Outfit auf der Karte finden ↗|⌖ Подбери одежду по погоде на карте ↗|⌖ 在地图上查找天气穿搭 ↗
NEW COLLECTION|NEW COLLECTION|YENİ KOLEKSİYON|NOWA KOLEKCJA|NEUE KOLLEKTION|НОВАЯ КОЛЛЕКЦИЯ|全新系列
LIMITED EDITION|LIMITED EDITION|SINIRLI SAYIDA|EDYCJA LIMITOWANA|LIMITIERTE AUFLAGE|ЛИМИТИРОВАННАЯ СЕРИЯ|限量款
DON'T FIT IN. STAND OUT.|DON'T FIT IN. STAND OUT.|KALIPLARA SIĞMA. FARKINI GÖSTER.|NIE WTOP SIĘ W TŁUM. WYRÓŻNIJ SIĘ.|PASS DICH NICHT AN. STICH HERAUS.|НЕ СЛИВАЙСЯ С ТОЛПОЙ. ВЫДЕЛЯЙСЯ.|不随波逐流，展现自我。
Latest collection|Latest collection|Son koleksiyon|Najnowsza kolekcja|Aktuelle Kollektion|Новая коллекция|最新系列
Discover the latest DCMD pieces designed for people who choose to stand out.|Discover the latest DCMD pieces designed for people who choose to stand out.|Farkını göstermeyi seçenler için tasarlanan en yeni DCMD parçalarını keşfet.|Odkryj najnowsze modele DCMD dla tych, którzy lubią się wyróżniać.|Entdecke neue DCMD-Styles für alle, die auffallen möchten.|Открой новинки DCMD для тех, кто выбирает выделяться.|探索为追求个性的人打造的DCMD新品。
Refine|Refine|Filtrele|Filtruj|Filtern|Фильтры|筛选
CLEAR|CLEAR|TEMİZLE|WYCZYŚĆ|ZURÜCKSETZEN|СБРОСИТЬ|清除
Category|Category|Kategori|Kategoria|Kategorie|Категория|类别
All pieces|All pieces|Tüm ürünler|Wszystkie produkty|Alle Artikel|Все товары|全部商品
T-shirts|T-shirts|Tişörtler|Koszulki|T-Shirts|Футболки|T恤
T-shirt|T-shirt|Tişört|Koszulka|T-Shirt|Футболка|T恤
Hoodies|Hoodies|Kapüşonlular|Bluzy z kapturem|Hoodies|Худи|连帽衫
Hoodie|Hoodie|Kapüşonlu|Bluza z kapturem|Hoodie|Худи|连帽衫
Pants|Pants|Pantolonlar|Spodnie|Hosen|Брюки|长裤
Price|Price|Fiyat|Cena|Preis|Цена|价格
All prices|All prices|Tüm fiyatlar|Wszystkie ceny|Alle Preise|Все цены|全部价格
Under $60|Under $60|60 $ altı|Poniżej 60 USD|Unter 60 $|До 60 $|低于60美元
ADD TO CART|ADD TO CART|SEPETE EKLE|DO KOSZYKA|IN DEN WARENKORB|В КОРЗИНУ|加入购物车
Sepete ekle|Add to cart|Sepete ekle|Do koszyka|In den Warenkorb|В корзину|加入购物车
Hava değişir.|Weather changes.|Hava değişir.|Pogoda się zmienia.|Das Wetter ändert sich.|Погода меняется.|天气在变。
Tarzın seninle.|Your style stays with you.|Tarzın seninle.|Twój styl zostaje.|Dein Stil bleibt.|Твой стиль с тобой.|风格始终如你。
Şehrini seç. Şu anın havasını keşfet.|Choose your city. Check the weather now.|Şehrini seç. Şu anın havasını keşfet.|Wybierz miasto. Sprawdź pogodę.|Wähle deine Stadt. Entdecke das aktuelle Wetter.|Выбери город. Узнай погоду сейчас.|选择城市，查看当前天气。
Bugünün kombinini birlikte bulalım.|Let's find today's outfit.|Bugünün kombinini birlikte bulalım.|Znajdźmy stylizację na dziś.|Finden wir dein Outfit für heute.|Подберём образ на сегодня.|一起找到今天的穿搭。
TÜRKİYE + AVRUPA|TÜRKİYE + EUROPE|TÜRKİYE + AVRUPA|TURCJA + EUROPA|TÜRKEI + EUROPA|ТУРЦИЯ + ЕВРОПА|土耳其 + 欧洲
Avrupa'ya dön ↗|Back to Europe ↗|Avrupa'ya dön ↗|Wróć do Europy ↗|Zurück zu Europa ↗|Вернуться к Европе ↗|返回欧洲 ↗
Haritayı büyüt ⤢|Expand map ⤢|Haritayı büyüt ⤢|Powiększ mapę ⤢|Karte vergrößern ⤢|Увеличить карту ⤢|展开地图 ⤢
Haritayı küçült ⤡|Collapse map ⤡|Haritayı küçült ⤡|Zmniejsz mapę ⤡|Karte verkleinern ⤡|Уменьшить карту ⤡|收起地图 ⤡
Haritadaki ülke noktalarına dokun veya listeden ülkeni seç.|Tap a country marker or choose your country below.|Haritadaki ülke noktalarına dokun veya listeden ülkeni seç.|Dotknij kraju na mapie lub wybierz go z listy.|Tippe auf eine Ländermarkierung oder wähle dein Land.|Нажми на отметку страны или выбери её из списка.|点击地图上的国家标记或从列表中选择。
Ülke|Country|Ülke|Kraj|Land|Страна|国家
İl|Province|İl|Prowincja|Provinz|Провинция|省
İlçe|District|İlçe|Dzielnica / powiat|Bezirk|Район|区县
İller yükleniyor…|Loading provinces…|İller yükleniyor…|Ładowanie prowincji…|Provinzen werden geladen…|Загрузка провинций…|正在加载省份…
İlini seç|Choose a province|İlini seç|Wybierz prowincję|Provinz auswählen|Выбери провинцию|选择省份
Önce il seç|Choose a province first|Önce il seç|Najpierw wybierz prowincję|Zuerst Provinz wählen|Сначала выбери провинцию|请先选择省份
İl merkezi|City centre|İl merkezi|Centrum miasta|Stadtzentrum|Центр города|市中心
Şehir / bölge / posta kodu|City / region / postal code|Şehir / bölge / posta kodu|Miasto / region / kod pocztowy|Stadt / Region / Postleitzahl|Город / регион / индекс|城市 / 地区 / 邮编
Ara|Search|Ara|Szukaj|Suchen|Поиск|搜索
Bulunan konum|Search results|Bulunan konum|Znalezione miejsca|Gefundene Orte|Найденные места|搜索结果
Önce şehir ara|Search for a city first|Önce şehir ara|Najpierw wyszukaj miasto|Zuerst eine Stadt suchen|Сначала найди город|请先搜索城市
Konumunu seç|Choose your location|Konumunu seç|Wybierz lokalizację|Ort auswählen|Выбери место|选择地点
Arama sonuçlarından seç|Choose from the results|Arama sonuçlarından seç|Wybierz z wyników|Aus Ergebnissen wählen|Выбери из результатов|从结果中选择
Konumlar aranıyor…|Searching locations…|Konumlar aranıyor…|Szukanie lokalizacji…|Orte werden gesucht…|Поиск мест…|正在搜索地点…
Kombinimi bul|Find my outfit|Kombinimi bul|Znajdź stylizację|Mein Outfit finden|Подобрать образ|查找穿搭
ŞU ANIN HAVASI|WEATHER NOW|ŞU ANIN HAVASI|POGODA TERAZ|WETTER JETZT|ПОГОДА СЕЙЧАС|当前天气
Ülkeni ve bulunduğun yeri seçerek başlayabilirsin.|Start by choosing your country and location.|Ülkeni ve bulunduğun yeri seçerek başlayabilirsin.|Wybierz kraj i lokalizację.|Wähle zuerst Land und Ort.|Сначала выбери страну и место.|请先选择国家和地点。
Sen neredesin,|Wherever you are,|Sen neredesin,|Gdziekolwiek jesteś,|Wo du auch bist,|Где бы ты ни был,|无论身在何处，
tarzın orada.|your style follows.|tarzın orada.|twój styl jest z tobą.|dein Stil ist dabei.|твой стиль с тобой.|风格与你同在。
Sana uygun parçaları bulmak için|To find the right pieces,|Sana uygun parçaları bulmak için|Aby znaleźć odpowiednie ubrania,|Für passende Styles|Чтобы подобрать одежду,|为了找到适合你的单品，
önce bulunduğun yeri seç.|choose your location first.|önce bulunduğun yeri seç.|najpierw wybierz lokalizację.|wähle zuerst deinen Ort.|сначала выбери место.|请先选择所在地点。
Hissedilen|Feels like|Hissedilen|Odczuwalna|Gefühlt|Ощущается|体感温度
Rüzgâr|Wind|Rüzgâr|Wiatr|Wind|Ветер|风速
Yağış|Precipitation|Yağış|Opady|Niederschlag|Осадки|降水量
ŞİMDİ NE GİYSEM?|WHAT TO WEAR NOW?|ŞİMDİ NE GİYSEM?|CO TERAZ ZAŁOŻYĆ?|WAS ZIEHE ICH AN?|ЧТО НАДЕТЬ СЕЙЧАС?|现在穿什么？
Gündüz|Daytime|Gündüz|Dzień|Tag|День|白天
Gece|Night|Gece|Noc|Nacht|Ночь|夜晚
Açık ve güneşli|Clear and sunny|Açık ve güneşli|Słonecznie|Sonnig|Ясно и солнечно|晴朗
Açık gökyüzü|Clear skies|Açık gökyüzü|Bezchmurnie|Klarer Himmel|Ясное небо|晴空
Parçalı bulutlu|Partly cloudy|Parçalı bulutlu|Częściowe zachmurzenie|Teilweise bewölkt|Переменная облачность|局部多云
Bulutlu|Cloudy|Bulutlu|Pochmurno|Bewölkt|Облачно|多云
Sisli|Foggy|Sisli|Mgła|Neblig|Туман|有雾
Kar yağışlı|Snowing|Kar yağışlı|Śnieg|Schneefall|Снег|降雪
Gök gürültülü sağanak|Thunderstorms|Gök gürültülü sağanak|Burze|Gewitter|Гроза|雷阵雨
Yağışlı|Rainy|Yağışlı|Deszczowo|Regnerisch|Дождь|有雨
Hava durumu bilgisi|Weather information|Hava durumu bilgisi|Informacje pogodowe|Wetterinformationen|Информация о погоде|天气信息
Yerel saat için konum seç|Choose a location for local time|Yerel saat için konum seç|Wybierz miejsce, aby zobaczyć czas|Ort für die lokale Uhrzeit wählen|Выбери место для местного времени|选择地点以查看当地时间
Hazırlanıyor…|Loading…|Hazırlanıyor…|Ładowanie…|Wird geladen…|Загрузка…|加载中…
Yeniden güncelle|Refresh|Yeniden güncelle|Odśwież|Aktualisieren|Обновить|刷新
Konumun için güncel hava ve kombin hazırlanıyor…|Loading your weather and outfit…|Konumun için güncel hava ve kombin hazırlanıyor…|Ładowanie pogody i stylizacji…|Wetter und Outfit werden geladen…|Загружаем погоду и образ…|正在加载天气和穿搭…
Bulunduğun yer, şu anın havası, senin seçimin.|Your location. Current weather. Your choice.|Bulunduğun yer, şu anın havası, senin seçimin.|Twoje miejsce. Aktualna pogoda. Twój wybór.|Dein Ort. Dein Wetter. Deine Wahl.|Твоё место. Твоя погода. Твой выбор.|你的位置，当前天气，你的选择。
Katmanlarla sıcak kal.|Stay warm with layers.|Katmanlarla sıcak kal.|Ubierz się warstwowo.|Bleib mit Schichten warm.|Согрейся с многослойностью.|叠穿保暖。
Hafif bir katman, tam senlik.|A light layer, just for you.|Hafif bir katman, tam senlik.|Lekka warstwa w twoim stylu.|Eine leichte Schicht für dich.|Лёгкий слой в твоём стиле.|轻薄叠穿，恰到好处。
Sıcak havaya hafif bir seçim.|A light choice for warm weather.|Sıcak havaya hafif bir seçim.|Lekki wybór na upał.|Leicht gekleidet bei Hitze.|Лёгкий выбор для жары.|炎热天气的轻盈之选。
Tişört havası. Kendi tarzında.|T-shirt weather. Your way.|Tişört havası. Kendi tarzında.|Pogoda na koszulkę. Po twojemu.|T-Shirt-Wetter. Dein Stil.|Погода для футболки. В твоём стиле.|适合T恤的天气，穿出你的风格。
Hava soğuk. Hoodie ve pantolonu temel katman olarak kullan; dışarıda üzerine sıcak tutan bir mont ekle.|It's cold. Wear a hoodie and trousers as a base, and add a warm coat outdoors.|Hava soğuk. Hoodie ve pantolonu temel katman olarak kullan; dışarıda üzerine sıcak tutan bir mont ekle.|Jest zimno. Załóż bluzę i spodnie, a na zewnątrz ciepłą kurtkę.|Es ist kalt. Trage Hoodie und Hose und draußen einen warmen Mantel.|Холодно. Надень худи и брюки, а на улице добавь тёплую куртку.|天气寒冷。以连帽衫和长裤打底，外出加穿保暖外套。
Serin havada tişörtün üzerine bir hoodie al. Pantolonla kombinini tamamla.|In cool weather, layer a hoodie over a T-shirt and add trousers.|Serin havada tişörtün üzerine bir hoodie al. Pantolonla kombinini tamamla.|W chłodny dzień załóż bluzę na koszulkę i dobierz spodnie.|Trage bei kühlem Wetter einen Hoodie über dem T-Shirt und eine Hose.|В прохладу надень худи поверх футболки и дополни образ брюками.|天气凉爽，在T恤外加件连帽衫，搭配长裤。
Hissedilen sıcaklık yüksek. Koleksiyondan bir tişört seç; rahat ve hafif parçalarla tamamla.|It feels hot. Choose a T-shirt and pair it with light, comfortable pieces.|Hissedilen sıcaklık yüksek. Koleksiyondan bir tişört seç; rahat ve hafif parçalarla tamamla.|Jest gorąco. Wybierz koszulkę i lekkie, wygodne ubrania.|Es fühlt sich heiß an. Wähle ein T-Shirt und leichte, bequeme Kleidung.|Жарко. Выбери футболку и лёгкие удобные вещи.|体感温度较高。选择T恤，搭配轻盈舒适的单品。
Hava ılık. Bir tişört ve rahat kesimli pantolonla dışarı çıkabilirsin.|It's mild. A T-shirt and relaxed trousers work well.|Hava ılık. Bir tişört ve rahat kesimli pantolonla dışarı çıkabilirsin.|Jest ciepło. Wybierz koszulkę i luźne spodnie.|Es ist mild. T-Shirt und locker geschnittene Hose passen gut.|Тепло. Подойдут футболка и свободные брюки.|天气温暖，T恤搭配宽松长裤即可。
Yağış var; bu parçalar yağmurluk yerine geçmez. Su geçirmeyen bir dış katman veya şemsiye ekle.|It's raining; these pieces aren't rainwear. Add a waterproof layer or umbrella.|Yağış var; bu parçalar yağmurluk yerine geçmez. Su geçirmeyen bir dış katman veya şemsiye ekle.|Pada; te ubrania nie zastąpią kurtki przeciwdeszczowej. Weź wodoodporną warstwę lub parasol.|Es regnet. Diese Kleidung ersetzt keine Regenjacke. Nimm Regenschutz oder einen Schirm mit.|Идут осадки. Эта одежда не заменяет дождевик. Возьми водонепроницаемую куртку или зонт.|有降水，这些服装不能代替雨衣。请加穿防水外套或携带雨伞。
Rüzgâr kuvvetli; rüzgâr kesen bir dış katman da al.|It's windy; bring a windproof outer layer.|Rüzgâr kuvvetli; rüzgâr kesen bir dış katman da al.|Silny wiatr; weź kurtkę przeciwwiatrową.|Es ist windig. Nimm eine winddichte Jacke mit.|Сильный ветер; возьми ветрозащитную куртку.|风力较强，请带上防风外套。
Our mindset|Our mindset|Bakış açımız|Nasze podejście|Unsere Haltung|Наш подход|我们的理念
Made for those who stand out.|Made for those who stand out.|Farkını gösterenler için.|Dla tych, którzy się wyróżniają.|Für alle, die auffallen.|Для тех, кто выделяется.|为独具风格的你而造。
DCMD combines confidence, mystery and freedom with a sharp European streetwear identity.|DCMD combines confidence, mystery and freedom with a sharp European streetwear identity.|DCMD, özgüven, gizem ve özgürlüğü Avrupa sokak stiliyle birleştirir.|DCMD łączy pewność siebie, tajemnicę i wolność z europejskim streetwearem.|DCMD verbindet Selbstbewusstsein, Geheimnis und Freiheit mit europäischer Streetwear.|DCMD сочетает уверенность, загадочность и свободу с европейским уличным стилем.|DCMD将自信、神秘与自由融入欧洲街头风格。
CLOSE|CLOSE|KAPAT|ZAMKNIJ|SCHLIESSEN|ЗАКРЫТЬ|关闭
YOUR CART|YOUR CART|SEPETİN|TWÓJ KOSZYK|DEIN WARENKORB|ТВОЯ КОРЗИНА|你的购物车
Your cart is currently empty.|Your cart is currently empty.|Sepetin şu an boş.|Twój koszyk jest pusty.|Dein Warenkorb ist leer.|Корзина пока пуста.|购物车为空。
TOTAL|TOTAL|TOPLAM|SUMA|GESAMT|ИТОГО|合计
CHECKOUT|CHECKOUT|ÖDEMEYE GEÇ|DO KASY|ZUR KASSE|ОФОРМИТЬ ЗАКАЗ|结账
REMOVE|REMOVE|KALDIR|USUŃ|ENTFERNEN|УДАЛИТЬ|移除
Search the collection|Search the collection|Koleksiyonda ara|Szukaj w kolekcji|Kollektion durchsuchen|Поиск по коллекции|搜索系列
Type a product name...|Type a product name...|Ürün adı yaz...|Wpisz nazwę produktu...|Produktname eingeben...|Введи название товара...|输入商品名称…
PRIVACY POLICY|PRIVACY POLICY|GİZLİLİK POLİTİKASI|POLITYKA PRYWATNOŚCI|DATENSCHUTZ|КОНФИДЕНЦИАЛЬНОСТЬ|隐私政策
SHIPPING & RETURNS|SHIPPING & RETURNS|KARGO VE İADE|DOSTAWA I ZWROTY|VERSAND & RÜCKGABE|ДОСТАВКА И ВОЗВРАТ|配送与退货
TERMS & CONDITIONS|TERMS & CONDITIONS|ŞARTLAR VE KOŞULLAR|REGULAMIN|GESCHÄFTSBEDINGUNGEN|УСЛОВИЯ|条款与条件
FEEDBACK & COMPLAINTS|FEEDBACK & COMPLAINTS|ÖNERİ VE ŞİKÂYET|OPINIE I REKLAMACJE|FEEDBACK & BESCHWERDEN|ОТЗЫВЫ И ЖАЛОБЫ|反馈与投诉
Feedback|Feedback|Geri bildirim|Opinia|Feedback|Обратная связь|反馈
Your voice matters|Your voice matters|Fikrin değerli|Twój głos ma znaczenie|Deine Meinung zählt|Твоё мнение важно|你的声音很重要
You can write any complaints and suggestions. Your comments are valuable to us.|Share your suggestions or complaints. Your feedback matters.|Öneri ve şikâyetlerini paylaşabilirsin. Görüşlerin bizim için değerli.|Podziel się sugestiami lub reklamacjami. Twoja opinia jest ważna.|Teile Vorschläge oder Beschwerden. Deine Meinung ist uns wichtig.|Поделись предложениями или жалобами. Нам важно твоё мнение.|欢迎分享建议或投诉。我们重视你的反馈。
Message type|Message type|Mesaj türü|Typ wiadomości|Nachrichtentyp|Тип сообщения|消息类型
Suggestion|Suggestion|Öneri|Sugestia|Vorschlag|Предложение|建议
Complaint|Complaint|Şikâyet|Reklamacja|Beschwerde|Жалоба|投诉
Product|Product|Ürün|Produkt|Produkt|Товар|商品
Order & delivery|Order & delivery|Sipariş ve teslimat|Zamówienie i dostawa|Bestellung & Lieferung|Заказ и доставка|订单与配送
Returns|Returns|İade|Zwroty|Rückgabe|Возврат|退货
Website experience|Website experience|Site deneyimi|Korzystanie ze strony|Website-Erlebnis|Работа сайта|网站体验
Customer service|Customer service|Müşteri hizmetleri|Obsługa klienta|Kundenservice|Поддержка|客户服务
Other|Other|Diğer|Inne|Sonstiges|Другое|其他
Your message|Your message|Mesajın|Twoja wiadomość|Deine Nachricht|Сообщение|你的留言
Tell us how we can improve...|Tell us how we can improve...|Nasıl iyileştirebileceğimizi yaz...|Jak możemy się poprawić?|Wie können wir besser werden?|Как нам стать лучше?|告诉我们如何改进…
(optional)|(optional)|(isteğe bağlı)|(opcjonalnie)|(optional)|(необязательно)|（选填）
SEND FEEDBACK|SEND FEEDBACK|GÖNDER|WYŚLIJ|ABSENDEN|ОТПРАВИТЬ|发送反馈
Thank you. Your message has been saved.|Thank you. Your message has been saved.|Teşekkürler. Mesajın kaydedildi.|Dziękujemy. Wiadomość została zapisana.|Danke. Deine Nachricht wurde gespeichert.|Спасибо. Сообщение сохранено.|谢谢，留言已保存。
En az 2 karakter yaz.|Enter at least 2 characters.|En az 2 karakter yaz.|Wpisz co najmniej 2 znaki.|Mindestens 2 Zeichen eingeben.|Введи минимум 2 символа.|请输入至少两个字符。
Bu ülkede sonuç bulunamadı. Yerel şehir adını veya posta kodunu dene.|No results in this country. Try a local city name or postal code.|Bu ülkede sonuç bulunamadı. Yerel şehir adını veya posta kodunu dene.|Brak wyników. Spróbuj lokalnej nazwy lub kodu pocztowego.|Keine Ergebnisse. Versuche den lokalen Namen oder die Postleitzahl.|Ничего не найдено. Попробуй местное название или индекс.|该国家暂无结果，请尝试当地城市名称或邮编。
Bağlantı zaman aşımına uğradı. Tekrar dene.|Connection timed out. Try again.|Bağlantı zaman aşımına uğradı. Tekrar dene.|Upłynął limit czasu. Spróbuj ponownie.|Zeitüberschreitung. Versuche es erneut.|Время ожидания истекло. Повтори попытку.|连接超时，请重试。
Güncel hava durumu alınamadı. İnternet bağlantısını kontrol edip tekrar dene.|Weather unavailable. Check your connection and try again.|Güncel hava durumu alınamadı. İnternet bağlantısını kontrol edip tekrar dene.|Pogoda niedostępna. Sprawdź połączenie i spróbuj ponownie.|Wetter nicht verfügbar. Prüfe die Verbindung und versuche es erneut.|Погода недоступна. Проверь соединение и повтори попытку.|无法获取天气，请检查网络后重试。
Konum listesi yüklenemedi. Sayfayı yenile.|Locations could not load. Refresh the page.|Konum listesi yüklenemedi. Sayfayı yenile.|Nie można wczytać miejsc. Odśwież stronę.|Orte konnten nicht geladen werden. Lade die Seite neu.|Не удалось загрузить места. Обнови страницу.|地点加载失败，请刷新页面。
Harita görselleri yüklenemedi. Konum listesinden devam edebilirsin.|Map images could not load. You can still use the location list.|Harita görselleri yüklenemedi. Konum listesinden devam edebilirsin.|Mapa nie została wczytana. Użyj listy lokalizacji.|Kartenbilder nicht verfügbar. Nutze die Ortsliste.|Карта не загрузилась. Используй список мест.|地图加载失败，仍可使用地点列表。
Checkout will be available soon.|Checkout will be available soon.|Ödeme yakında kullanıma açılacak.|Płatności będą wkrótce dostępne.|Die Kasse ist bald verfügbar.|Оплата скоро появится.|结账功能即将开放。
Your cart is empty.|Your cart is empty.|Sepetin boş.|Koszyk jest pusty.|Dein Warenkorb ist leer.|Корзина пуста.|购物车为空。
Switch to light mode|Switch to light mode|Açık temaya geç|Włącz jasny motyw|Helles Design aktivieren|Светлая тема|切换浅色模式
Switch to night mode|Switch to dark mode|Koyu temaya geç|Włącz ciemny motyw|Dunkles Design aktivieren|Тёмная тема|切换深色模式
Night mode|Dark mode|Koyu tema|Ciemny motyw|Dunkles Design|Тёмная тема|深色模式
Day mode|Light mode|Açık tema|Jasny motyw|Helles Design|Светлая тема|浅色模式
Product filters|Product filters|Ürün filtreleri|Filtry produktów|Produktfilter|Фильтры товаров|商品筛选
Türkiye ve Avrupa ülke seçim haritası|Country map of Türkiye and Europe|Türkiye ve Avrupa ülke seçim haritası|Mapa Turcji i Europy|Länderkarte der Türkei und Europas|Карта Турции и Европы|土耳其与欧洲国家地图
Tişört seçeneği|T-shirt option|Tişört seçeneği|Opcja koszulki|T-Shirt-Option|Вариант футболки|T恤选项
Veri zamanı:|Data time:|Veri zamanı:|Czas danych:|Datenzeit:|Время данных:|数据时间：
Yerel saat|Local time|Yerel saat|Czas lokalny|Ortszeit|Местное время|当地时间
Hava:|Weather:|Hava:|Pogoda:|Wetter:|Погода:|天气：
· Konumlar:|· Locations:|· Konumlar:|· Lokalizacje:|· Orte:|· Места:|· 地点：
· Seçilen konumun güncel model verisi; 15 dakikada bir yenilenir. Öneriler hissedilen sıcaklık, yağış ve rüzgâra göre hazırlanır.|· Current model data, refreshed every 15 minutes. Outfits use feels-like temperature, rain and wind.|· Seçilen konumun güncel model verisi; 15 dakikada bir yenilenir. Öneriler hissedilen sıcaklık, yağış ve rüzgâra göre hazırlanır.|· Aktualne dane modelowe, odświeżane co 15 minut. Dobór według temperatury odczuwalnej, opadów i wiatru.|· Aktuelle Modelldaten, alle 15 Minuten aktualisiert. Outfits nach gefühlter Temperatur, Regen und Wind.|· Текущие модельные данные, обновление каждые 15 минут. Подбор по ощущаемой температуре, осадкам и ветру.|· 当前模型数据，每15分钟刷新。根据体感温度、降水和风速推荐穿搭。
© 2026 DCMD. All rights reserved.|© 2026 DCMD. All rights reserved.|© 2026 DCMD. Tüm hakları saklıdır.|© 2026 DCMD. Wszelkie prawa zastrzeżone.|© 2026 DCMD. Alle Rechte vorbehalten.|© 2026 DCMD. Все права защищены.|© 2026 DCMD。保留所有权利。
Zoom in|Zoom in|Yakınlaştır|Przybliż|Vergrößern|Приблизить|放大
Zoom out|Zoom out|Uzaklaştır|Oddal|Verkleinern|Отдалить|缩小
Email|Email|E-posta|E-mail|E-Mail|Эл. почта|电子邮箱
Müzik|Music|Müzik|Muzyka|Musik|Музыка|音乐
Müzik oynatıcıyı aç|Open music player|Müzik oynatıcıyı aç|Otwórz odtwarzacz|Musikplayer öffnen|Открыть плеер|打开播放器
Mini müzik oynatıcı|Mini music player|Mini müzik oynatıcı|Miniodtwarzacz|Mini-Musikplayer|Мини-плеер|迷你播放器
Oynat|Play|Oynat|Odtwórz|Abspielen|Воспроизвести|播放
Tarzının bir sesi var.|Your style has a sound.|Tarzının bir sesi var.|Twój styl ma swoje brzmienie.|Dein Stil hat einen Sound.|У твоего стиля есть звук.|你的风格，自有声音。
Hesabını bağla. Parçanı bul. Gezinmeye devam et.|Connect. Find a track. Keep exploring.|Hesabını bağla. Parçanı bul. Gezinmeye devam et.|Połącz konto. Znajdź utwór. Odkrywaj dalej.|Verbinden. Song finden. Weiter entdecken.|Подключись. Найди трек. Продолжай просмотр.|连接账号，找到歌曲，继续浏览。
Hesap bağlı değil|Not connected|Hesap bağlı değil|Nie połączono|Nicht verbunden|Нет подключения|未连接
Hesabını bağla ↗|Connect account ↗|Hesabını bağla ↗|Połącz konto ↗|Konto verbinden ↗|Подключить аккаунт ↗|连接账号 ↗
Bağlantıyı kes|Disconnect|Bağlantıyı kes|Rozłącz|Trennen|Отключить|断开连接
Şarkı veya sanatçı|Song or artist|Şarkı veya sanatçı|Utwór lub wykonawca|Song oder Künstler|Песня или исполнитель|歌曲或艺人
Spotify’da şarkı veya sanatçı ara|Search Spotify songs or artists|Spotify’da şarkı veya sanatçı ara|Szukaj w Spotify|Spotify durchsuchen|Поиск в Spotify|搜索Spotify歌曲或艺人
Sıradaki şarkı senin seçimin.|You choose the next track.|Sıradaki şarkı senin seçimin.|Ty wybierasz następny utwór.|Du wählst den nächsten Song.|Следующий трек выбираешь ты.|下一首由你选择。
Aramadan bir parça seç.|Choose a track from search.|Aramadan bir parça seç.|Wybierz utwór z wyszukiwania.|Wähle einen Song aus der Suche.|Выбери трек в поиске.|从搜索结果中选择歌曲。
Müzik bağlantısı hazırlanıyor…|Preparing music connection…|Müzik bağlantısı hazırlanıyor…|Przygotowanie połączenia…|Musikverbindung wird vorbereitet…|Подготовка подключения…|正在准备音乐连接…
Bu ilçenin konumu doğrulanamadı. İl merkezi seçeneğini deneyebilirsin.|This district could not be located. Try the city centre.|Bu ilçenin konumu doğrulanamadı. İl merkezi seçeneğini deneyebilirsin.|Nie znaleziono dzielnicy. Spróbuj centrum miasta.|Bezirk nicht gefunden. Versuche das Stadtzentrum.|Район не найден. Попробуй центр города.|无法确认该区县，请尝试市中心。
Güncel veri henüz gelmedi. Biraz sonra yeniden dene.|Current data is not available yet. Try again shortly.|Güncel veri henüz gelmedi. Biraz sonra yeniden dene.|Aktualne dane nie są dostępne. Spróbuj za chwilę.|Aktuelle Daten fehlen noch. Versuche es gleich erneut.|Свежие данные пока недоступны. Попробуй чуть позже.|最新数据暂不可用，请稍后重试。
Arama zaman aşımına uğradı. Tekrar dene.|Search timed out. Try again.|Arama zaman aşımına uğradı. Tekrar dene.|Wyszukiwanie przekroczyło limit czasu. Spróbuj ponownie.|Zeitüberschreitung bei der Suche. Versuche es erneut.|Время поиска истекло. Повтори попытку.|搜索超时，请重试。
Konumlar alınamadı.|Locations unavailable.|Konumlar alınamadı.|Lokalizacje niedostępne.|Orte nicht verfügbar.|Места недоступны.|无法获取地点。
Hava durumu alınamadı.|Weather unavailable.|Hava durumu alınamadı.|Pogoda niedostępna.|Wetter nicht verfügbar.|Погода недоступна.|无法获取天气。
Hava durumu için siteyi Python sunucusundan açmalısın.|Open the site through its preview server to view weather.|Hava durumu için siteyi Python sunucusundan açmalısın.|Otwórz stronę przez serwer podglądu, aby zobaczyć pogodę.|Öffne die Seite über den Vorschau-Server, um das Wetter zu sehen.|Открой сайт через сервер предпросмотра для просмотра погоды.|请通过预览服务器打开网站以查看天气。
Konum servisi kullanılamıyor. Python sunucusundan açmayı dene.|Location service unavailable. Open the preview link.|Konum servisi kullanılamıyor. Python sunucusundan açmayı dene.|Usługa lokalizacji niedostępna. Otwórz link podglądu.|Ortsdienst nicht verfügbar. Öffne den Vorschau-Link.|Сервис мест недоступен. Открой ссылку предпросмотра.|地点服务不可用，请打开预览链接。
Harita yüklenemedi. İl ve ilçe listesinden devam edebilirsin.|Map unavailable. You can use the province and district lists.|Harita yüklenemedi. İl ve ilçe listesinden devam edebilirsin.|Mapa niedostępna. Użyj list prowincji i dzielnic.|Karte nicht verfügbar. Nutze die Ortslisten.|Карта недоступна. Используй списки мест.|地图不可用，仍可使用省份和区县列表。
Bildirimler|Notifications|Bildirimler|Powiadomienia|Mitteilungen|Уведомления|通知
Yeni duyurular|New announcements|Yeni duyurular|Nowe ogłoszenia|Neue Mitteilungen|Новые объявления|新公告
Kapat|Close|Kapat|Zamknij|Schließen|Закрыть|关闭
Senden habersiz olmaz.|You're in the loop.|Senden habersiz olmaz.|Bądź na bieżąco.|Bleib auf dem Laufenden.|Будь в курсе.|精彩不错过。
Kampanyalar, yeni duraklar ve buluşmalar. DCMD'den haberler burada.|Offers, new destinations and events. Your DCMD updates are here.|Kampanyalar, yeni duraklar ve buluşmalar. DCMD'den haberler burada.|Promocje, nowe miejsca i spotkania. Tutaj znajdziesz wieści od DCMD.|Aktionen, neue Ziele und Events. Hier gibt es Neuigkeiten von DCMD.|Акции, новые направления и встречи. Все новости DCMD здесь.|优惠、新目的地与活动，DCMD最新消息尽在这里。
İLK ALIŞVERİŞE ÖZEL|FOR YOUR FIRST ORDER|İLK ALIŞVERİŞE ÖZEL|NA PIERWSZE ZAKUPY|FÜR DEINE ERSTE BESTELLUNG|ДЛЯ ПЕРВОЙ ПОКУПКИ|首单专享
İlk adımına bizden bir hediye.|A gift for your first step.|İlk adımına bizden bir hediye.|Prezent na pierwszy krok.|Ein Geschenk für deinen ersten Schritt.|Подарок за первый шаг.|初次相遇，赠你惊喜。
DCMD ile ilk alışverişini küçük bir sürprizle karşılıyoruz. Sınırlı süreli hediye kampanyamızın keyfini çıkar; tarzına yeni bir dokunuş kat.|We're welcoming your first DCMD order with a little surprise. Enjoy our limited-time gift offer and add a fresh touch to your style.|DCMD ile ilk alışverişini küçük bir sürprizle karşılıyoruz. Sınırlı süreli hediye kampanyamızın keyfini çıkar; tarzına yeni bir dokunuş kat.|Na twoje pierwsze zakupy w DCMD czeka mała niespodzianka. Skorzystaj z ograniczonej czasowo oferty prezentowej i odśwież swój styl.|Wir begrüßen deine erste DCMD-Bestellung mit einer kleinen Überraschung. Entdecke unsere zeitlich begrenzte Geschenkaktion und gib deinem Stil einen neuen Akzent.|Твою первую покупку в DCMD встретит небольшой сюрприз. Воспользуйся нашей временной подарочной акцией и добавь новый штрих к своему стилю.|首次在DCMD购物，我们为你准备了一份小惊喜。享受限时赠礼活动，为你的风格增添新意。
Koleksiyonu keşfet ↗|Explore the collection ↗|Koleksiyonu keşfet ↗|Odkryj kolekcję ↗|Kollektion entdecken ↗|Открой коллекцию ↗|探索系列 ↗
YENİ DURAKLARA DOĞRU|ON TO NEW DESTINATIONS|YENİ DURAKLARA DOĞRU|W STRONĘ NOWYCH MIEJSC|AUF ZU NEUEN ZIELEN|К НОВЫМ НАПРАВЛЕНИЯМ|迈向更多地方
Bugün burada. Yarın çok daha yakında.|Here today. Closer tomorrow.|Bugün burada. Yarın çok daha yakında.|Dziś tutaj. Jutro jeszcze bliżej.|Heute hier. Morgen noch näher.|Сегодня здесь. Завтра ещё ближе.|今天在此，明天更近。
Şu an Türkiye ve seçili Avrupa ülkelerindeyiz. Çok yakında bu özenle tasarladığımız deneyimi dünyanın dört bir yanına taşımayı, tarzınıza yeni dokunuşlar katmayı hedefliyoruz.|We're currently in Türkiye and selected European countries. Soon, we aim to bring this carefully crafted experience around the world, adding fresh touches to your style.|Şu an Türkiye ve seçili Avrupa ülkelerindeyiz. Çok yakında bu özenle tasarladığımız deneyimi dünyanın dört bir yanına taşımayı, tarzınıza yeni dokunuşlar katmayı hedefliyoruz.|Obecnie działamy w Turcji i wybranych krajach Europy. Wkrótce chcemy przenieść to starannie zaprojektowane doświadczenie na cały świat, dodając nowe akcenty do waszego stylu.|Derzeit sind wir in der Türkei und ausgewählten europäischen Ländern verfügbar. Bald möchten wir dieses sorgfältig gestaltete Erlebnis weltweit anbieten und eurem Stil neue Akzente geben.|Сейчас мы работаем в Турции и отдельных странах Европы. Вскоре мы стремимся подарить этот тщательно продуманный опыт всему миру и добавить новые штрихи к вашему стилю.|目前我们的服务覆盖土耳其及部分欧洲国家。我们希望不久后将这份精心打造的体验带到世界各地，为你的风格增添新意。
Etkinlikler|Events|Etkinlikler|Wydarzenia|Events|События|活动
Şu an duyurulmuş bir etkinliğimiz yok. Senin için yeni buluşmalar hazırlıyoruz. Haberleri burada takip et!|No events have been announced yet. We're preparing new experiences for you. Stay tuned here!|Şu an duyurulmuş bir etkinliğimiz yok. Senin için yeni buluşmalar hazırlıyoruz. Haberleri burada takip et!|Nie ogłosiliśmy jeszcze żadnych wydarzeń. Przygotowujemy dla ciebie nowe spotkania. Śledź wiadomości tutaj!|Aktuell sind keine Events angekündigt. Wir bereiten neue Erlebnisse für dich vor. Bleib hier auf dem Laufenden!|Пока нет объявленных событий. Мы готовим для тебя новые встречи. Следи за новостями здесь!|目前暂无已公布的活动。我们正在为你筹备新的体验，敬请关注这里！
Hesap bağlantıları henüz kullanıma açılmadı.|Account connections are not available yet.|Hesap bağlantıları henüz kullanıma açılmadı.|Połączenia z kontami nie są jeszcze dostępne.|Kontoverbindungen sind noch nicht verfügbar.|Подключение аккаунтов пока недоступно.|账号连接功能暂未开放。
`;
  const dictionary = new Map(rows.trim().split('\n').map(row=>{const [source,...values]=row.split('|'); return [source,values];}));
  const phrases=[...dictionary].filter(([original])=>original.length>12 || ['Veri zamanı:','Yerel saat'].includes(original)).sort((a,b)=>b[0].length-a[0].length);
  const normalize = text => text.replace(/\s+/g,' ').trim();
  const sources = new WeakMap();
  const attributes = new WeakMap();
  let countries = [];
  function country(code) {try{return new Intl.DisplayNames([locales[language]],{type:'region'}).of(code);}catch{return code;}}
  function t(source) {
    const key=normalize(source), direct=dictionary.get(key);
    if(direct) return direct[codes.indexOf(language)] || key;
    const found=countries.find(c=>c.name===key || c.name.toLocaleUpperCase('tr-TR')===key);
    if(found) return country(found.code);
    let m;
    const pick = values => values[codes.indexOf(language)];
    if ((m=key.match(/^(Alıcı:|Toplam:|Ödeme:|Önizleme:) (.*)$/))) return t(m[1]) + ' ' + t(m[2]);
    if ((m=key.match(/^Merhaba (.*),$/))) return t('Merhaba') + ' ' + m[1] + ',';
    if (key.endsWith(' — simülasyon')) return t(key.slice(0,-13)) + ' — ' + t('simülasyon');
    if ((m=key.match(/^Added to cart \((\d+)\)$/))) return t('Added to cart') + ' (' + m[1] + ')';
    if ((m=key.match(/^(.* \/ )(XS|Small|Medium|Large|X Large|Oversize)$/))) return m[1] + t(m[2]);
    if ((m=key.match(/^Son (\d+) üretim kontenjanı!$/))) return pick([`Only ${m[1]} production slots left!`,key,`Ostatnie ${m[1]} miejsca produkcji!`,`Nur noch ${m[1]} Produktionsplätze!`,`Осталось мест: ${m[1]}!`,`仅剩${m[1]}个生产名额！`]);
    if ((m=key.match(/^Üretime uygun · (\d+) test kontenjanı$/))) return pick([`Available · ${m[1]} demo slots`,key,`Dostępne · ${m[1]} miejsc demo`,`Verfügbar · ${m[1]} Demoplätze`,`Доступно · ${m[1]} демомест`,`可生产 · ${m[1]}个演示名额`]);
    if (key.endsWith(' — Beden / Size')) return key.replace('Beden / Size',t('Beden / Size'));
    if (key.startsWith('Remove ')) return pick(['Remove','Kaldır','Usuń','Entfernen','Удалить','移除']) + key.slice(6);
    if((m=key.match(/^CART \((\d+)\)$/))) return `${t('CART')} (${m[1]})`;
    if((m=key.match(/^(\d+) pieces?$/))) return [ `${m[1]} items`,`${m[1]} ürün`,`${m[1]} szt.`,`${m[1]} Artikel`,`${m[1]} товаров`,`${m[1]} 件商品` ][codes.indexOf(language)];
    if((m=key.match(/^(.*?) içinde şehir veya bölge ara…$/))) return [`Search a city in ${t(m[1])}…`,`${m[1]} içinde şehir veya bölge ara…`,`Szukaj miasta: ${t(m[1])}…`,`Stadt in ${t(m[1])} suchen…`,`Найти город: ${t(m[1])}…`,`搜索${t(m[1])}的城市…`][codes.indexOf(language)];
    if((m=key.match(/^(\d+) konum bulundu\. Listeden bulunduğun yeri seç\.$/))) return [`${m[1]} locations found. Choose one below.`,key,`Znaleziono ${m[1]} miejsc. Wybierz z listy.`,`${m[1]} Orte gefunden. Bitte auswählen.`,`Найдено мест: ${m[1]}. Выбери из списка.`,`找到${m[1]}个地点，请从列表中选择。`][codes.indexOf(language)];
    if(key==='Konumunu seçtikten sonra “Kombinimi bul”a dokun.') return [`Choose a location, then tap “Find my outfit”.`,key,'Wybierz miejsce i kliknij „Znajdź stylizację”.','Wähle einen Ort und dann „Mein Outfit finden“.','Выбери место и нажми «Подобрать образ».','选择地点后点击“查找穿搭”。'][codes.indexOf(language)];
    // Combined dynamic messages are composed from known complete phrases.
    let translated=key;
    for(const [original,values] of phrases) {
      if(translated.includes(original)) translated=translated.replaceAll(original,values[codes.indexOf(language)]);
    }
    if(language!=='tr') translated=translated.replace(/km\/sa\b/g,'km/h');
    return translated;
  }
  function translateText(node) {
    if(!node.parentElement || node.parentElement.closest('script,style,.language-switcher,[data-no-translate]')) return;
    const current=node.nodeValue, previous=sources.get(node);
    const original=previous && current===previous.rendered ? previous.original : current;
    const translated=node.parentElement.closest('pre') ? original.split('\n').map(line=>t(line)).join('\n') : t(original);
    const rendered=original.trim() ? original.replace(original.trim(),translated) : original;
    sources.set(node,{original,rendered});
    if(current!==rendered) node.nodeValue=rendered;
  }
  function translateAttributes(el) {
    if(el.closest('.language-switcher')) return;
    const saved=attributes.get(el)||{};
    for(const attr of ['placeholder','aria-label','title','alt']) {
      if(!el.hasAttribute(attr)) continue;
      const current=el.getAttribute(attr),old=saved[attr];
      const original=old && current===old.rendered ? old.original : current;
      const rendered=t(original);saved[attr]={original,rendered};
      if(current!==rendered)el.setAttribute(attr,rendered);
    }
    attributes.set(el,saved);
  }
  function translate(root=document.body) {
    if(root.nodeType===Node.TEXT_NODE){translateText(root);return;}
    if(root.nodeType!==Node.ELEMENT_NODE)return;
    translateAttributes(root);
    root.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach(translateAttributes);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode())translateText(walker.currentNode);
  }
  function apply(next,save=true) {
    if(!codes.includes(next))return;
    language=next;document.documentElement.lang=next==='zh'?'zh-CN':next;
    document.querySelectorAll('[lang]:not(html):not(.language-switcher button)').forEach(el=>el.lang=document.documentElement.lang);
    document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===next)));
    if(save)try{localStorage.setItem('dcmd-language',next);}catch{}
    translate();
    window.dispatchEvent(new Event('dcmd:languagechange'));
  }
  window.DCMDLanguage={t,country,get language(){return language;},get locale(){return locales[language];}};
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>apply(button.dataset.language)));
  const observer=new MutationObserver(records=>{
    for(const record of records) {
      if(record.type==='characterData')translateText(record.target);
      else if(record.type==='attributes')translateAttributes(record.target);
      else record.addedNodes.forEach(node=>translate(node));
    }
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt']});
  apply(language,false);
  fetch('data/countries.json').then(r=>r.json()).then(data=>{countries=data;translate();}).catch(()=>{});
})();
