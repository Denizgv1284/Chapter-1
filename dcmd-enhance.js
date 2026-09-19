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
    // Background containers stay visible. Only foreground content moves.
    document.querySelectorAll('header.hero, section, footer#contact, .grid').forEach(el => {
      el.setAttribute('data-reveal', el.matches('.grid') ? 'stagger' : '');
      el.classList.add('is-revealed');
    });
    const active = new Set();
    function reveal(el, delay = 0) {
      if (reduceMotion.matches || document.hidden || typeof el.animate !== 'function') return;
      const animation = el.animate([
        {opacity:0.45, transform:'translateY(12px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:420, delay, easing:'cubic-bezier(.2,.7,.3,1)'});
      active.add(animation);
      const done = () => active.delete(animation);
      animation.onfinish = done; animation.oncancel = done;
    }
    const stop = () => { active.forEach(animation => animation.cancel()); active.clear(); };
    reduceMotion.addEventListener('change', stop);
    document.addEventListener('visibilitychange', () => {if (document.hidden) stop();});
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        let index = 0;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          reveal(entry.target, Math.min(index++, 3) * 45);
          observer.unobserve(entry.target);
        });
      }, {threshold:0.01});
      document.querySelectorAll(
        '.hero-copy > *, .section-head > *, .product-info, .product-gallery, ' +
        '.model-window, .story h2, .story p, .weather-heading > *, footer > *'
      ).forEach(el => observer.observe(el));
    }
    // Opening a panel animates its content, not its backdrop.
    document.querySelectorAll('dialog, .cart, .search-panel, .feedback-modal').forEach(panel => {
      new MutationObserver(records => {
        const opened = panel.matches('dialog') ? panel.open : panel.classList.contains('open');
        if (!opened || !records.length) return;
        const content = panel.querySelector('.feedback-dialog, .search-box') || panel;
        [...content.children].filter(el => !el.hidden).slice(0, 7).forEach((el, i) => reveal(el, i * 25));
      }).observe(panel, {attributes:true, attributeFilter:['open','class']});
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
