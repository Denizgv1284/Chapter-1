// ==========================================================================
// DCMD — enhance layer (additive, non-breaking)
// Bu dosya script.js'e HİÇBİR ŞEKİLDE dokunmaz, sadece onun yanında,
// ondan SONRA yüklenir ve kendi işini yapar.
// ==========================================================================
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ------------------------------------------------------------------
  // 1) Scroll reveal — her ana bölüme (hero, section, footer) ve
  //    ürün/koleksiyon gridlerine giriş animasyonu.
  // ------------------------------------------------------------------
  function initScrollReveal() {
    if (reduceMotion.matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    // Ana bölümler: hero, her <section>, footer
    document.querySelectorAll('header.hero, section, footer#contact').forEach((el) => {
      el.setAttribute('data-reveal', '');
      observer.observe(el);
    });

    // Ürün / koleksiyon gridleri: kartlar teker teker, hafif gecikmeli
    document.querySelectorAll('.grid').forEach((grid) => {
      [...grid.children].forEach((card, i) => {
        card.style.setProperty('--i', Math.min(i, 8));
        card.setAttribute('data-reveal-item', '');
      });
      grid.setAttribute('data-reveal', 'stagger');
      observer.observe(grid);
    });
  }

  // ------------------------------------------------------------------
  // 2) Capital Collection — ülke bayrağı renk aksanları
  //    Yeni bir başkent/ülke eklerken:
  //      a) index.html'deki <article class="product-card" data-collection="capital" ...>
  //         etiketine data-country="xx" ekle (ISO 2 harf kodu, örn. "de")
  //      b) aşağıdaki FLAG_COLORS tablosuna o kodu ekle
  //    Başka hiçbir şeye dokunman gerekmez.
  // ------------------------------------------------------------------
  const FLAG_COLORS = {
    fr: ['#0055A4', '#FFFFFF', '#EF4135'], // Fransa (Paris)
    pl: ['#DC143C', '#FFFFFF', '#DC143C'], // Polonya (Varşova)
    tr: ['#E30A17', '#FFFFFF', '#E30A17'], // Türkiye (Ankara)
    de: ['#000000', '#DD0000', '#FFCE00'], // Almanya (Berlin)
    it: ['#009246', '#FFFFFF', '#CE2B37'], // İtalya (Roma)
    es: ['#AA151B', '#F1BF00', '#AA151B'], // İspanya (Madrid)
    pt: ['#046A38', '#DA291C', '#FFE900'], // Portekiz (Lizbon)
    nl: ['#21468B', '#FFFFFF', '#AE1C28'], // Hollanda
    gb: ['#00247D', '#FFFFFF', '#CF142B'], // Birleşik Krallık
  };

  function initCapitalFlags() {
    document.querySelectorAll('.product-card[data-country]').forEach((card) => {
      const code = (card.dataset.country || '').toLowerCase();
      const colors = FLAG_COLORS[code];
      if (!colors) return;

      card.style.setProperty('--flag-a', colors[0]);
      card.style.setProperty('--flag-b', colors[1]);
      card.style.setProperty('--flag-c', colors[2]);

      const gallery = card.querySelector('.product-gallery');
      if (gallery && !gallery.querySelector('.capital-flag-badge')) {
        const badge = document.createElement('span');
        badge.className = 'capital-flag-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.innerHTML = `<span class="flag-dot"></span>${code.toUpperCase()}`;
        gallery.appendChild(badge);
      }
    });
  }

  function init() {
    initScrollReveal();
    initCapitalFlags();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
