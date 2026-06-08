/* LIBA — Lingener Baumaschinen | v3 */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* Year auto-fill */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* Page-enter class */
  document.body.classList.add('page-enter');

  /* Sticky nav scroll state */
  const nav = $('.nav');
  if (nav && !nav.classList.contains('is-solid')) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Scroll progress bar */
  if (!reduceMotion) {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progress);
    const bar = progress.firstElementChild;
    const updateBar = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  /* Grain overlay */
  if (!reduceMotion) {
    const grain = document.createElement('div');
    grain.className = 'grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  }

  /* Mobile nav */
  const toggle = $('.nav-toggle');
  const drawer = $('.mobile-nav');
  if (toggle && drawer) {
    const close = () => {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    /* Schließen bei Link-Klick (außer tel/mailto) */
    $$('a', drawer)
      .filter(a => !a.href.startsWith('tel:') && !a.href.startsWith('mailto:'))
      .forEach(a => a.addEventListener('click', close));
  }

  /* Convert headlines with [data-split-lines] into line-masked spans */
  $$('[data-split-lines]').forEach(el => {
    if (el.dataset.split === '1') return;
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map((line, idx) =>
      `<span class="mask-line mask-line-${idx + 1}"><span>${line.trim()}</span></span>`
    ).join('');
    el.dataset.split = '1';
  });

  /* IntersectionObserver for reveals + line masks */
  const observed = $$('.reveal, .mask-line, .clip-reveal');
  if ('IntersectionObserver' in window && observed.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    observed.forEach(el => io.observe(el));
  } else {
    observed.forEach(el => el.classList.add('is-visible'));
  }

  /* Hero slider */
  const slides = $$('.hero-media img');
  const dots = $$('.hero-dot');
  if (slides.length > 1) {
    let i = 0, timer = null;
    const setActive = (n) => {
      slides.forEach((s, idx) => s.classList.toggle('is-active', idx === n));
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === n));
      i = n;
    };
    const next = () => setActive((i + 1) % slides.length);
    setActive(0);
    if (!reduceMotion) timer = setInterval(next, 6500);
    dots.forEach((d, idx) => d.addEventListener('click', () => {
      setActive(idx);
      if (timer) { clearInterval(timer); timer = setInterval(next, 6500); }
    }));
  } else if (slides.length === 1) slides[0].classList.add('is-active');

  /* Counter animation */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const duration = 1800;
        const start = performance.now();
        const fmt = (v) => decimals ? v.toFixed(decimals) : Math.floor(v).toLocaleString('de-DE');
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(target * eased);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('de-DE');
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(c => {
      const v = parseFloat(c.dataset.count);
      const d = (c.dataset.count.split('.')[1] || '').length;
      c.textContent = d ? v.toFixed(d) : v.toLocaleString('de-DE');
    });
  }

  /* Marquee — seamless duplication */
  $$('.marquee-track').forEach(track => {
    const items = Array.from(track.children);
    items.forEach(item => track.appendChild(item.cloneNode(true)));
  });

  /* Form: Formspree submission */
  $$('form[data-form]').forEach(form => {
    const endpoint = form.dataset.form;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = $('[data-form-status]', form);
      const btn = form.querySelector('[type="submit"]');
      const origHTML = btn ? btn.innerHTML : null;
      if (btn) { btn.disabled = true; btn.innerHTML = 'Wird gesendet&nbsp;…'; }

      /* If no real endpoint is configured yet, show fallback */
      if (!endpoint || endpoint.includes('YOUR_')) {
        if (status) { status.hidden = false; status.textContent = 'Vielen Dank — Ihre Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden.'; }
        form.reset();
        if (btn) { btn.disabled = false; btn.innerHTML = origHTML; }
        return;
      }

      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (resp.ok) {
          if (status) { status.hidden = false; status.textContent = 'Vielen Dank — Ihre Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden.'; }
          form.reset();
        } else {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || 'Serverfehler');
        }
      } catch {
        if (status) {
          status.hidden = false;
          status.style.color = '#dc2626';
          status.textContent = 'Fehler beim Senden. Bitte rufen Sie uns an oder schreiben Sie eine E-Mail.';
        }
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = origHTML; }
      }
    });
  });

  /* Hero parallax (cheap, scroll-driven) */
  const heroMedia = $('.hero-media');
  if (heroMedia && !reduceMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.3, 160);
        heroMedia.style.transform = `translate3d(0, ${y}px, 0)`;
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Magnetic effect on primary buttons */
  if (!isCoarse && !reduceMotion) {
    $$('[data-magnetic], .btn-brand.is-lg, .btn-accent.is-lg').forEach(el => {
      let ex = 0, ey = 0, mRaf = null;
      el.addEventListener('mousemove', (e) => {
        ex = e.clientX; ey = e.clientY;
        if (!mRaf) mRaf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const x = ex - (r.left + r.width / 2);
          const y = ey - (r.top + r.height / 2);
          el.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
          mRaf = null;
        });
      });
      el.addEventListener('mouseleave', () => {
        if (mRaf) { cancelAnimationFrame(mRaf); mRaf = null; }
        el.style.transform = '';
      });
    });
  }

  /* Tilt effect on showcase cards */
  if (!isCoarse && !reduceMotion) {
    $$('[data-tilt], .show-card.is-feature, .show-card.is-side').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform .5s var(--ease)';
      let ex = 0, ey = 0, tRaf = null;
      card.addEventListener('mousemove', (e) => {
        ex = e.clientX; ey = e.clientY;
        if (!tRaf) tRaf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const cx = (ex - r.left) / r.width - 0.5;
          const cy = (ey - r.top) / r.height - 0.5;
          card.style.transform = `perspective(1000px) rotateY(${cx * 4}deg) rotateX(${-cy * 3}deg)`;
          tRaf = null;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (tRaf) { cancelAnimationFrame(tRaf); tRaf = null; }
        card.style.transform = '';
      });
    });
  }
  /* URL param → Kontaktformular vorausfüllen */
  (function () {
    var p = new URLSearchParams(window.location.search).get('modell');
    if (!p) return;
    var msg = document.getElementById('k-nachricht');
    var subj = document.getElementById('k-betreff');
    if (msg && !msg.value) msg.value = 'Ich interessiere mich für: ' + decodeURIComponent(p) + '\n\nBitte senden Sie mir ein Angebot.';
    if (subj) { for (var i = 0; i < subj.options.length; i++) { if (subj.options[i].value === 'Kaufanfrage' || subj.options[i].text === 'Kaufanfrage') { subj.selectedIndex = i; break; } } }
  })();

  /* Maschinenberater-Wizard */
  (function () {
    var wiz = document.getElementById('maschinenwizard');
    if (!wiz) return;

    var viewport = document.getElementById('wizard-viewport');
    var track    = document.getElementById('wizard-track');
    var panes    = [
      document.getElementById('wstep-1'),
      document.getElementById('wstep-2'),
      document.getElementById('wizard-result')
    ];
    var cards = document.getElementById('wizard-cards');
    var dots  = $$('.wizard-pdot', wiz);
    var sel   = {};
    var cur   = 0;
    var busy  = false;
    var noAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var DB = {
      bagger: {
        s: [{ tag:'Baggeranbau', name:'GM 140 H', desc:'Bis 900 mm Frästiefe, ab 6 t Bagger. Ideal für Erdkabel und kommunalen Tiefbau.', modell:'GM+140+H' },
            { tag:'Baggeranbau', name:'GM 140 AFH-500', desc:'Bis 500 mm, Träger ab 8 t. Rohrleitungs- und Kabelbau.', modell:'GM+140+AFH-500' }],
        m: [{ tag:'Baggeranbau', name:'GM 140 AFH-500', desc:'Bis 500 mm Frästiefe, Träger ab 8 t.', modell:'GM+140+AFH-500' },
            { tag:'Baggeranbau', name:'GM 140 AFH-600', desc:'Bis 600 mm, Pipeline DN 100–200, Träger ab 12 t.', modell:'GM+140+AFH-600' }],
        d: [{ tag:'Baggeranbau', name:'GM 140 AFH-600', desc:'Bis 600 mm für Pipeline-Verlegung DN 100–200, Träger ab 12 t.', modell:'GM+140+AFH-600' },
            { tag:'Beratung', name:'Sonderanfertigung', desc:'Für Frästiefen > 600 mm am Bagger sprechen Sie uns direkt an.', modell:'Baggeranbau-Tiefenfr%C3%A4se' }],
        x: [{ tag:'Tiefenfräse', name:'GM 300 H / GM 300 HF', desc:'Bis 2.000 mm Frästiefe für Sondertiefbau und Fernwärme.', modell:'GM+300+H' },
            { tag:'Tiefenfräse', name:'GM 450 H', desc:'Maximale Frästiefe bis 3.000 mm — für anspruchsvollsten Sondertiefbau.', modell:'GM+450+H' }]
      },
      traktor: {
        s: [{ tag:'Schlepperanbau', name:'GM 1 AF / GM 1 AS', desc:'Kompakt für Erdkabel und Schmalgräben, bis 400 mm Frästiefe.', modell:'GM+1+AF' },
            { tag:'Schlepperanbau', name:'GM 140 AF / GM 140 AS', desc:'Mittlere Klasse, Frästiefe bis 1.200 mm, Drainage und Kabelbau.', modell:'GM+140+AF' }],
        m: [{ tag:'Schlepperanbau', name:'GM 160 AF / GM 160 AS', desc:'Bis 1.200 mm Frästiefe, Fräsbreite bis 300 mm.', modell:'GM+160+AF' },
            { tag:'Schlepperanbau', name:'GM 180 AF', desc:'High-Performance bis 1.800 mm, Pipeline DN 300 und Backbone-Glasfaser.', modell:'GM+180+AF' }],
        d: [{ tag:'Schlepperanbau', name:'GM 180 AF', desc:'Bis 1.800 mm Frästiefe — das leistungsstärkste Schleppergerät im Portfolio.', modell:'GM+180+AF' },
            { tag:'Schlepperanbau', name:'GM 600 R', desc:'Bis 1.800 mm, speziell für Rohrleitungs- und Pipeline-Projekte.', modell:'GM+600+R' }],
        x: [{ tag:'Tiefenfräse', name:'GM 300 H / GM 450 H', desc:'Über 2.000 mm Frästiefe — Unimog-Adaptionen und Sonderanbauten auf Anfrage.', modell:'Tiefenf%C3%A4se' }]
      },
      self: {
        s: [{ tag:'Selbstfahrer', name:'GM 4 Raupe', desc:'Bis 650 mm, Tagesleistung bis 1.000 m — ideal für FTTH-Glasfaser.', modell:'GM+4+Raupe' },
            { tag:'Selbstfahrer', name:'GM 4 Allrad', desc:'Allrad für Drainage, Solarpark und Sportplatz. Minimale Geländeschäden.', modell:'GM+4+Allrad' }],
        m: [{ tag:'Selbstfahrer', name:'GM 6 ASR', desc:'Felsfräse bis 800 mm in Hartgestein. Wo Bagger und Trennsäge nicht wirtschaftlich sind.', modell:'GM+6+ASR' }],
        d: [{ tag:'Selbstfahrer', name:'GM 6 ASR', desc:'Bis 800 mm in Kalkstein und Schiefer — das stärkste Selbstfahrer-Modell.', modell:'GM+6+ASR' }],
        x: [{ tag:'Beratung', name:'Individuelle Lösung', desc:'Für Tiefen über 2.000 mm ohne Trägergerät beraten wir Sie direkt.', modell:'Selbstfahrer-Tiefenbau' }]
      },
      tiefe: {
        s: [{ tag:'Tiefenfräse', name:'GM 250 H / GM 300 H', desc:'Frästiefen bis 2.000 mm für Sondertiefbau und Fernwärme.', modell:'GM+300+H' }],
        m: [{ tag:'Tiefenfräse', name:'GM 300 H / GM 300 HF', desc:'Bis 2.000 mm Frästiefe, Fräsbreite bis 350 mm für Fernwärme.', modell:'GM+300+HF' }],
        d: [{ tag:'Tiefenfräse', name:'GM 300 HF / GM 450 H', desc:'Bis 2.500 mm — Fernwärme, Entwässerungssysteme, Sonderprojekte.', modell:'GM+450+H' }],
        x: [{ tag:'Tiefenfräse', name:'GM 450 H', desc:'Maximale Frästiefe bis 3.000 mm — das tiefste Gerät im LIBA-Portfolio.', modell:'GM+450+H' }]
      }
    };

    function showDots(active, done) {
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === active);
        d.classList.toggle('is-done',   i < done);
      });
    }

    function slideTo(idx) {
      if (busy) return;
      busy = true;
      var prevIdx = cur;
      var fromH   = viewport.offsetHeight;
      var toH     = panes[idx].offsetHeight || fromH;
      cur = idx;

      if (noAnim) {
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        viewport.style.height = toH + 'px';
        busy = false;
        return;
      }

      /* Arriving pane starts invisible so it can fade in as it enters */
      panes[idx].style.opacity = '0';

      /* Snapshot current height — no transition */
      viewport.style.transition = 'none';
      viewport.style.height     = fromH + 'px';
      /* Flush layout: commits all "from" states before animating */
      void viewport.offsetHeight;

      /* ① Slide track + animate height */
      track.style.transform     = 'translateX(-' + (idx * 100) + '%)';
      viewport.style.transition = 'height 400ms cubic-bezier(.4,0,.2,1)';
      viewport.style.height     = toH + 'px';

      /* ② Fade out departing pane */
      panes[prevIdx].style.transition = 'opacity 200ms ease';
      panes[prevIdx].style.opacity    = '0';

      /* ③ Fade in arriving pane — delayed so it enters mid-slide */
      setTimeout(function () {
        panes[idx].style.transition = 'opacity 260ms ease';
        panes[idx].style.opacity    = '1';
      }, 180);

      /* Cleanup inline styles after animation */
      setTimeout(function () {
        panes[prevIdx].style.transition = '';
        panes[prevIdx].style.opacity    = '';
        panes[idx].style.transition     = '';
        panes[idx].style.opacity        = '';
        busy = false;
      }, 500);
    }

    /* Keep viewport height in sync after window resize / orientation change */
    var resizeRaf;
    window.addEventListener('resize', function () {
      if (busy) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () {
        viewport.style.transition = 'none';
        viewport.style.height = panes[cur].offsetHeight + 'px';
      });
    }, { passive: true });

    /* Set initial viewport height — wait for fonts so measurement is accurate */
    function setInitH() {
      if (!busy) viewport.style.height = panes[0].offsetHeight + 'px';
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { requestAnimationFrame(setInitH); });
    } else {
      requestAnimationFrame(setInitH);
    }

    function buildCards(key1, key2) {
      var recs = (DB[key1] && DB[key1][key2]) || [];
      cards.innerHTML = recs.map(function (r) {
        return '<div class="wizard-rcard">'
          + '<span class="wizard-rcard-tag">' + r.tag + '</span>'
          + '<div class="wizard-rcard-name">' + r.name + '</div>'
          + '<div class="wizard-rcard-desc">' + r.desc + '</div>'
          + '<a href="kontakt.html?modell=' + r.modell + '" class="wizard-rcard-cta">Angebot anfragen'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>'
          + '</div>';
      }).join('');
    }

    $$('.wizard-opt', panes[0]).forEach(function (btn) {
      btn.addEventListener('click', function () {
        sel.key1 = btn.dataset.key;
        if (sel.key1 === 'tiefe') {
          buildCards('tiefe', 'm');
          slideTo(2); showDots(-1, 2);
        } else {
          slideTo(1); showDots(1, 1);
        }
      });
    });

    $$('.wizard-opt', panes[1]).forEach(function (btn) {
      btn.addEventListener('click', function () {
        sel.key2 = btn.dataset.key;
        buildCards(sel.key1, sel.key2);
        slideTo(2); showDots(-1, 2);
      });
    });

    var backBtn = document.getElementById('wizard-back');
    if (backBtn) backBtn.addEventListener('click', function () {
      slideTo(0); showDots(0, 0);
    });

    var backResult = document.getElementById('wizard-back-result');
    if (backResult) backResult.addEventListener('click', function () {
      if (sel.key1 === 'tiefe') { slideTo(0); showDots(0, 0); }
      else                      { slideTo(1); showDots(1, 1); }
    });

    var restartBtn = document.querySelector('#maschinenwizard .wizard-restart');
    if (restartBtn) restartBtn.addEventListener('click', function () {
      slideTo(0); showDots(0, 0);
    });
  })();

  /* ROI Rechner */
  (function () {
    var slider  = document.getElementById('roi-days');
    var selMach = document.getElementById('roi-machine');
    var daysVal = document.getElementById('roi-days-val');
    var rentAmt = document.getElementById('roi-rent-amount');
    var ownAmt  = document.getElementById('roi-own-amount');
    var rentSub = document.getElementById('roi-rent-sub');
    var verdict = document.getElementById('roi-verdict');
    if (!slider || !selMach) return;

    var MAINT = 4000;
    var LIFE  = 15;
    var isEN  = document.documentElement.lang === 'en';

    function fmt(n) {
      return isEN ? '€' + n.toLocaleString('en-GB') : n.toLocaleString('de-DE') + ' €';
    }

    function calc() {
      var days  = +slider.value;
      var parts = selMach.value.split(',');
      var price = +parts[0];
      var rate  = +parts[1];

      var rentYear  = days * rate;
      var ownYear   = Math.round(price / LIFE + MAINT);
      var breakEven = Math.ceil((price / LIFE + MAINT) / rate);

      if (isEN) {
        daysVal.textContent = days + ' days / year';
        rentSub.textContent = days + ' days × €' + rate.toLocaleString('en-GB') + '/day';
      } else {
        daysVal.textContent = days + ' Tage / Jahr';
        rentSub.textContent = days + ' Tage × ' + rate.toLocaleString('de-DE') + ' €/Tag';
      }

      rentAmt.textContent = fmt(rentYear);
      ownAmt.textContent  = fmt(ownYear);

      var rentWins = rentYear < ownYear;
      rentAmt.classList.toggle('is-winner', rentWins);
      ownAmt.classList.toggle('is-winner', !rentWins);

      var machLabel = selMach.options[selMach.selectedIndex].text.split(' — ')[0].trim();

      if (isEN) {
        if (rentWins) {
          verdict.className = 'roi-verdict is-rent';
          verdict.innerHTML = '<span class="roi-verdict-msg">At <strong>' + days + ' operating days/year</strong>, hiring is currently cheaper. Buying pays off from <strong>' + breakEven + ' days/year</strong>.</span>'
            + '<a href="#mietanfrage" class="btn btn-ghost is-sm">Request a hire quote</a>';
        } else {
          verdict.className = 'roi-verdict is-buy';
          verdict.innerHTML = '<span class="roi-verdict-msg">At <strong>' + days + ' operating days/year</strong>, <strong>buying already makes sense today</strong> — you save ' + fmt(rentYear - ownYear) + ' annually.</span>'
            + '<a href="/en/kontakt.html?modell=' + encodeURIComponent(machLabel) + '#anfrage" class="btn btn-primary is-sm">Request a purchase quote</a>';
        }
      } else {
        if (rentWins) {
          verdict.className = 'roi-verdict is-rent';
          verdict.innerHTML = '<span class="roi-verdict-msg">Bei <strong>' + days + ' Einsatztagen/Jahr</strong> ist Mieten aktuell günstiger. Ab <strong>' + breakEven + ' Tagen/Jahr</strong> rechnet sich der Kauf.</span>'
            + '<a href="#mietanfrage" class="btn btn-ghost is-sm">Mietangebot anfragen</a>';
        } else {
          verdict.className = 'roi-verdict is-buy';
          verdict.innerHTML = '<span class="roi-verdict-msg">Bei <strong>' + days + ' Einsatztagen/Jahr</strong> lohnt sich der <strong>Kauf bereits heute</strong> — Sie sparen ' + fmt(rentYear - ownYear) + ' jährlich.</span>'
            + '<a href="/kontakt.html?modell=' + encodeURIComponent(machLabel) + '#anfrage" class="btn btn-primary is-sm">Kaufangebot anfragen</a>';
        }
      }
    }
    slider.addEventListener('input', calc);
    selMach.addEventListener('change', calc);
    calc();
  })();

  /* Cookie Consent + GA4 Consent Mode v2 */
  var CONSENT_KEY = 'liba_consent_v1';
  function syncGA4(granted) {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }
  var savedChoice = localStorage.getItem(CONSENT_KEY);
  if (savedChoice === 'granted') {
    syncGA4(true);
  } else if (!savedChoice) {
    var cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        cookieBanner.classList.add('is-visible');
      }); });
      var btnAccept = document.getElementById('cookie-accept');
      var btnDecline = document.getElementById('cookie-decline');
      var hideBanner = function () { cookieBanner.classList.remove('is-visible'); };
      if (btnAccept) btnAccept.addEventListener('click', function () {
        localStorage.setItem(CONSENT_KEY, 'granted');
        syncGA4(true);
        hideBanner();
      });
      if (btnDecline) btnDecline.addEventListener('click', function () {
        localStorage.setItem(CONSENT_KEY, 'declined');
        hideBanner();
      });
    }
  }
  $$('[data-reset-consent]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem(CONSENT_KEY);
      location.reload();
    });
  });

  /* Floating Action Button — Kontakt */
  const fab    = document.getElementById('fab');
  const fabBtn = document.getElementById('fab-btn');
  const fabMenu = document.getElementById('fab-menu');
  if (fab && fabBtn) {
    const openFab = () => {
      fab.classList.add('is-open');
      fabBtn.setAttribute('aria-expanded', 'true');
      if (fabMenu) fabMenu.removeAttribute('aria-hidden');
    };
    const closeFab = () => {
      fab.classList.remove('is-open');
      fabBtn.setAttribute('aria-expanded', 'false');
      if (fabMenu) fabMenu.setAttribute('aria-hidden', 'true');
    };
    fabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fab.classList.contains('is-open') ? closeFab() : openFab();
    });
    document.addEventListener('click', (e) => {
      if (fab.classList.contains('is-open') && !fab.contains(e.target)) closeFab();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fab.classList.contains('is-open')) { closeFab(); fabBtn.focus(); }
    });
  }

  /* Scroll-to-top button */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 300);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
