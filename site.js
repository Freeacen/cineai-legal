/* FilmCortex shared site script: language dropdown + footer/link translation */
(function () {
  var KEY = 'filmcortex_lang';
  var LANGS = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'tr', label: '🇹🇷 Türkçe' }
  ];
  var FOOTER_LINKS = {
    'privacy.html': { tr: '🔒 Gizlilik Politikası', en: '🔒 Privacy Policy' },
    'terms.html': { tr: '📜 Kullanım Koşulları', en: '📜 Terms of Service' },
    'delete-account.html': { tr: '🗑️ Hesap Silme Talebi', en: '🗑️ Account Deletion' },
    'index.html': { tr: '🏠 FilmCortex Ana Sayfa', en: '🏠 FilmCortex Home' }
  };
  var COPYRIGHT = {
    tr: '© 2026 FilmCortex. Tüm hakları saklıdır. Bu ürün TMDB API\'sini kullanmaktadır ancak TMDB tarafından onaylanmamıştır.',
    en: '© 2026 FilmCortex. All rights reserved. This product uses the TMDB API but is not endorsed or certified by TMDB.'
  };

  function initialLang() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'tr' || saved === 'en') return saved;
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('tr') === 0 ? 'tr' : 'en';
  }

  function translateGeneric(lang) {
    document.querySelectorAll('[data-tr][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
    document.querySelectorAll('.footer').forEach(function (footer) {
      footer.querySelectorAll('a').forEach(function (a) {
        var map = FOOTER_LINKS[a.getAttribute('href')];
        if (map) a.textContent = map[lang];
      });
      if (!footer.querySelector('a')) {
        footer.textContent = COPYRIGHT[lang];
      } else {
        footer.querySelectorAll(':scope > div').forEach(function (d) {
          if (!d.querySelector('a')) d.textContent = COPYRIGHT[lang];
        });
      }
    });
    var t = document.documentElement.getAttribute('data-title-' + lang);
    if (t) document.title = t;
  }

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent =
      '.lang-toggle,.lang-switcher{display:none!important}' +
      '.container{position:relative}' +
      '.fc-lang{position:absolute;top:16px;right:16px;z-index:50;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}' +
      '.fc-lang-btn{display:flex;align-items:center;gap:8px;background:#14161f;color:#fff;border:1px solid #232738;border-radius:12px;padding:8px 12px;font-size:13.5px;font-weight:600;cursor:pointer}' +
      '.fc-lang-btn:hover{border-color:#e50914}' +
      '.fc-lang-arrow{font-size:10px;transition:transform .2s}' +
      '.fc-lang.open .fc-lang-arrow{transform:rotate(180deg)}' +
      '.fc-lang-menu{display:none;position:absolute;right:0;top:calc(100% + 6px);min-width:140px;background:#14161f;border:1px solid #232738;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.6)}' +
      '.fc-lang.open .fc-lang-menu{display:block}' +
      '.fc-lang-item{display:block;width:100%;text-align:left;background:none;border:0;color:#cfd3d8;padding:10px 14px;font-size:13.5px;cursor:pointer}' +
      '.fc-lang-item:hover{background:rgba(255,255,255,.07)}' +
      '.fc-lang-item.active{color:#fff;font-weight:700;background:rgba(229,9,20,.15)}';
    document.head.appendChild(s);
  }

  function buildDropdown() {
    var wrap = document.createElement('div');
    wrap.className = 'fc-lang';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fc-lang-btn';
    btn.innerHTML = '<span class="fc-lang-label"></span><span class="fc-lang-arrow">▼</span>';
    var menu = document.createElement('div');
    menu.className = 'fc-lang-menu';
    LANGS.forEach(function (l) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'fc-lang-item';
      item.setAttribute('data-code', l.code);
      item.textContent = l.label;
      item.addEventListener('click', function () {
        wrap.classList.remove('open');
        window.setLang(l.code);
      });
      menu.appendChild(item);
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', function () { wrap.classList.remove('open'); });
    wrap.appendChild(btn);
    wrap.appendChild(menu);
    (document.querySelector('.container') || document.body).appendChild(wrap);
    return wrap;
  }

  function updateDropdown(wrap, lang) {
    var cur = LANGS.filter(function (l) { return l.code === lang; })[0];
    wrap.querySelector('.fc-lang-label').textContent = '🌐 ' + cur.label;
    wrap.querySelectorAll('.fc-lang-item').forEach(function (i) {
      i.classList.toggle('active', i.getAttribute('data-code') === lang);
    });
  }

  function init() {
    injectStyles();
    var wrap = buildDropdown();
    var original = typeof window.setLang === 'function' ? window.setLang : null;
    window.setLang = function (lang) {
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      document.documentElement.lang = lang;
      if (original) original(lang);
      translateGeneric(lang);
      updateDropdown(wrap, lang);
    };
    window.setLang(initialLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
