/* LIBA — Lingener Baumaschinen | v3 */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* Year auto-fill */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* Page-enter: Einblend-Animation auf <main>, NICHT auf <body>.
     Eine (per fill-mode dauerhaft aktive) Animation auf dem body bricht in
     WebKit/iOS-Safari position:fixed aller Body-Kinder (Scroll-Progress, FAB,
     Cookie-Banner, Drawer) — die Elemente hängen dann mitten im Viewport. */
  const pageMain = document.getElementById('main');
  if (pageMain) pageMain.classList.add('page-enter');

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
    }, { threshold: 0, rootMargin: '0px 0px -4% 0px' });
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

  /* Form: Netlify Forms submission (AJAX POST to "/").
     Standard: URL-encoded. Formulare mit Datei-Upload (enctype=multipart, z. B.
     Bewerbung) senden FormData direkt — der Browser setzt den multipart-Header. */
  $$('form[data-form]').forEach(form => {
    const okMsg = form.dataset.success || 'Vielen Dank — Ihre Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden.';
    const errMsg = form.dataset.error || 'Senden fehlgeschlagen. Bitte rufen Sie uns an oder schreiben Sie eine E-Mail.';
    const sendingMsg = form.dataset.sending || 'Wird gesendet …';
    const fileErrMsg = form.dataset.fileError || 'Bitte laden Sie die Datei als PDF hoch (max. 8 MB).';
    const isMultipart = form.enctype === 'multipart/form-data';
    const MAX_FILE_BYTES = 8 * 1024 * 1024; // Netlify-Forms-Limit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = $('[data-form-status]', form);
      const btn = form.querySelector('[type="submit"]');
      const origHTML = btn ? btn.innerHTML : null;

      // Datei-Validierung vor dem Senden (nur PDF, max. 8 MB)
      if (isMultipart) {
        const fileInput = form.querySelector('input[type="file"]');
        const file = fileInput && fileInput.files[0];
        if (file && (file.size > MAX_FILE_BYTES || (file.type && file.type !== 'application/pdf'))) {
          if (status) { status.hidden = false; status.style.color = '#dc2626'; status.textContent = fileErrMsg; }
          return;
        }
      }

      if (btn) { btn.disabled = true; btn.innerHTML = sendingMsg; }

      try {
        const resp = await (isMultipart
          ? fetch('/', { method: 'POST', body: new FormData(form) })
          : fetch('/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams(new FormData(form)).toString()
            }));
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        if (status) { status.hidden = false; status.style.color = ''; status.textContent = okMsg; }
        form.reset();
      } catch {
        if (status) { status.hidden = false; status.style.color = '#dc2626'; status.textContent = errMsg; }
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
    if (subj) { for (var i = 0; i < subj.options.length; i++) { if (subj.options[i].value === 'Kauf') { subj.selectedIndex = i; break; } } }
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
    var isEN        = document.documentElement.lang === 'en';
    var _wiz        = document.getElementById('maschinenwizard');
    var kontaktBase = (_wiz && _wiz.dataset.kontakt) || (isEN ? '/en/kontakt.html' : '/kontakt.html');
    var maschBase   = (_wiz && _wiz.dataset.masch)   || (isEN ? '/en/maschinen/'   : '/maschinen/');

    var DB = {
      /* ─── BAGGER ────────────────────────────────────────────────────────
         Alle Baggeranbau-Geräte haben max. 1.500 mm Frästiefe.
         Beschreibungen zeigen den jeweils passenden Einsatzbereich. ──── */
      bagger: {
        /* ≤ 600 mm — enge Kabelschlitze und Glasfaser-Trassen */
        s: [
          { tag:'Baggeranbau', tagEN:'Excavator-Mounted', name:'GM 140 AFH-500', slug:'gm-140-afh-500',
            desc:'Fräsbreite 80–500 mm, Frästiefe bis 1.500 mm. Für enge Kabelschlitze und Glasfasertechnik.',
            descEN:'Cutting width 80–500 mm, cutting depth up to 1,500 mm. For narrow cable slots and fibre optic work.', modell:'gm-140-afh-500' },
          { tag:'Baggeranbau', tagEN:'Excavator-Mounted', name:'GM 140 H', slug:'gm-140-h',
            desc:'Frästiefe bis 1.500 mm, ab 17 t Bagger. Breites Einsatzspektrum von flach bis tief.',
            descEN:'Cutting depth up to 1,500 mm, excavator from 17 t. Wide application range from shallow to deep.', modell:'gm-140-h' },
          { tag:'Baggeranbau · Vorführmaschine', tagEN:'Excavator-Mounted · Demo', name:'GM 140 H', slug:'gm-140-h-2009',
            desc:'Vorführmaschine Bj. 2009, max. 1.500 mm — gleiche Specs zum günstigeren Einstiegspreis.',
            descEN:'Demo machine 2009, max. 1,500 mm — same specs at a lower entry price.', modell:'gm-140-h-2009' },
          { tag:'Baggeranbau · Gebraucht', tagEN:'Excavator-Mounted · Used', name:'GM 140 AFH 500', slug:'gm-140-afh-500-2011',
            desc:'Gebrauchtmaschine Bj. 2011, max. 1.500 mm — geprüft und einsatzbereit.',
            descEN:'Used machine 2011, max. 1,500 mm — inspected and ready for use.', modell:'gm-140-afh-500-2011' }
        ],
        /* ≤ 1.200 mm — Kabel, Rohrleitung, mittlere Tiefen */
        m: [
          { tag:'Baggeranbau', tagEN:'Excavator-Mounted', name:'GM 140 AFH-500', slug:'gm-140-afh-500',
            desc:'Fräsbreite 80–500 mm, max. 1.500 mm Frästiefe. Ideal für Kabelbau bis 1.200 mm.',
            descEN:'Cutting width 80–500 mm, max. 1,500 mm cutting depth. Ideal for cable work up to 1,200 mm.', modell:'gm-140-afh-500' },
          { tag:'Baggeranbau', tagEN:'Excavator-Mounted', name:'GM 140 AFH-600', slug:'gm-140-afh-600',
            desc:'Fräsbreite bis 600 mm, max. 1.500 mm. Für Pipeline DN 100–200, Träger ab 17 t.',
            descEN:'Cutting width up to 600 mm, max. 1,500 mm. For pipeline DN 100–200, carrier from 17 t.', modell:'gm-140-afh-600' },
          { tag:'Baggeranbau · Gebraucht', tagEN:'Excavator-Mounted · Used', name:'GM 140 AFH 500', slug:'gm-140-afh-500-2011',
            desc:'Gebrauchtmaschine Bj. 2011, max. 1.500 mm — wirtschaftliche Alternative.',
            descEN:'Used machine 2011, max. 1,500 mm — economical alternative.', modell:'gm-140-afh-500-2011' }
        ],
        /* ≤ 2.000 mm — Hinweis: Bagger-Anbau max. 1.500 mm */
        d: [
          { tag:'Baggeranbau', tagEN:'Excavator-Mounted', name:'GM 140 AFH-600', slug:'gm-140-afh-600',
            desc:'Maximale Baggeranbau-Frästiefe: 1.500 mm. Für Tiefen bis 2.000 mm am Bagger — Beratung erforderlich.',
            descEN:'Maximum excavator attachment depth: 1,500 mm. For depths up to 2,000 mm on an excavator — consultation required.', modell:'gm-140-afh-600' },
          { tag:'Beratung', tagEN:'Consultation', name:'Sonderlösung > 1.500 mm', nameEN:'Custom solution > 1,500 mm', slug:null,
            desc:'Für Frästiefen über 1.500 mm am Bagger sprechen Sie uns direkt an — wir finden die optimale Lösung.',
            descEN:'For cutting depths over 1,500 mm on an excavator, contact us directly — we will find the optimal solution.', modell:'Baggeranbau-Sonderlösung' }
        ],
        /* > 2.000 mm — Tiefengeräte, alternativ am schweren Träger */
        x: [
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 300 H', slug:'gm-300-h',
            desc:'Bis 3.000 mm Frästiefe — für schwere Trägergeräte und Sondertiefbau.',
            descEN:'Up to 3,000 mm cutting depth — for heavy carrier machines and special deep construction.', modell:'gm-300-h' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 450 H', slug:'gm-450-h',
            desc:'Bis 4.500 mm — maximale Frästiefe im LIBA-Portfolio für anspruchsvollsten Sondertiefbau.',
            descEN:'Up to 4,500 mm — maximum cutting depth in the LIBA portfolio for the most demanding deep construction.', modell:'gm-450-h' }
        ]
      },
      /* ─── TRAKTOR ───────────────────────────────────────────────────────
         Maschinen sind nach ihrer tatsächlichen Max-Frästiefe zugeordnet. */
      traktor: {
        /* ≤ 600 mm — nur Geräte mit max. ≤ 800 mm Frästiefe/Verlegetiefe */
        s: [
          { tag:'Schlepperanbau · Fräsrad', tagEN:'Tractor-Mounted · Milling Wheel', name:'Fräsrad GM 600 R', nameEN:'GM 600 R Cutter Wheel', slug:'gm-600-r',
            desc:'Max. 600 mm Frästiefe, Fräsbreite 80–200 mm. Ideal für Erdkabel und Leitungsbau ab 190 PS.',
            descEN:'Max. 600 mm cutting depth, cutting width 80–200 mm. Ideal for earth cables and utility installation from 190 hp.', modell:'gm-600-r' },
          { tag:'Schlepperanbau · Pflug', tagEN:'Tractor-Mounted · Plough', name:'GMV 100', slug:'gmv-100',
            desc:'Max. 800 mm Verlegetiefe — Anbaupflug ohne offenen Graben, hohe Tagesleistung.',
            descEN:'Max. 800 mm installation depth — attachment plough without open trench, high daily output.', modell:'gmv-100' }
        ],
        /* ≤ 1.200 mm — Geräte mit max. 1.200–1.600 mm */
        m: [
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 1 AF', slug:'gm-1-af',
            desc:'Max. 1.200 mm Frästiefe, ab 60 PS. Kompakte Schlepperanbau-Fräse für Erdkabel und Schmalgräben.',
            descEN:'Max. 1,200 mm cutting depth, from 60 hp. Compact tractor-mounted cutter for earth cables and narrow trenches.', modell:'gm-1-af' },
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 1 AS', slug:'gm-1-as',
            desc:'Max. 1.200 mm, ab 60 PS. Für schnelle Erdkabelverlegung mit hoher Tagesleistung.',
            descEN:'Max. 1,200 mm, from 60 hp. For fast earth cable installation with high daily output.', modell:'gm-1-as' },
          { tag:'Schlepperanbau · Pflug', tagEN:'Tractor-Mounted · Plough', name:'GMV 130', slug:'gmv-130',
            desc:'Max. 1.300 mm Verlegetiefe — Vibrationskabelpflug ohne Aushub, ab 90 PS.',
            descEN:'Max. 1,300 mm installation depth — vibrating cable plough without excavation, from 90 hp.', modell:'gmv-130' },
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 140 AF', slug:'gm-140-af',
            desc:'Max. 1.500 mm Frästiefe, ab 70 PS. Universell für Drainage, Kabel und Glasfaser.',
            descEN:'Max. 1,500 mm cutting depth, from 70 hp. Versatile for drainage, cable and fibre optic work.', modell:'gm-140-af' },
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 160 AF', slug:'gm-160-af',
            desc:'Max. 1.600 mm Frästiefe, ab 160 PS. Flexibel für Schlepper und Unimog.',
            descEN:'Max. 1,600 mm cutting depth, from 160 hp. Flexible for tractors and Unimog.', modell:'gm-160-af' },
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 160 AS', slug:'gm-160-as',
            desc:'Max. 1.600 mm, mit 2 Schnecken. Für effiziente Drainage-Projekte ab 160 PS.',
            descEN:'Max. 1,600 mm, with 2 augers. For efficient drainage projects from 160 hp.', modell:'gm-160-as' },
          { tag:'Schlepperanbau · Unimog', tagEN:'Tractor-Mounted · Unimog', name:'Unimogfräse', nameEN:'Unimog cutter', slug:'unimogfraese',
            desc:'Speziell für Mercedes-Benz Unimog, max. 1.600 mm Frästiefe ab 160 PS.',
            descEN:'Specifically for Mercedes-Benz Unimog, max. 1,600 mm cutting depth from 160 hp.', modell:'unimogfraese' },
          { tag:'Schlepperanbau · Gebraucht', tagEN:'Tractor-Mounted · Used', name:'GM 140 AF', slug:'gm-140-af-2011',
            desc:'Gebraucht Bj. 2011, max. 1.500 mm — geprüfte Traktorfräse, sofort einsatzbereit.',
            descEN:'Used 2011, max. 1,500 mm — inspected tractor cutter, immediately ready for use.', modell:'gm-140-af-2011' },
          { tag:'Schlepperanbau · Gebraucht', tagEN:'Tractor-Mounted · Used', name:'GM 160 AS', slug:'gm-160-as-2014',
            desc:'Gebraucht Bj. 2014, max. 1.600 mm, 300 mm Messerbestückung.',
            descEN:'Used 2014, max. 1,600 mm, 300 mm blade tooling.', modell:'gm-160-as-2014' },
          { tag:'Schlepperanbau · Gebraucht', tagEN:'Tractor-Mounted · Used', name:'GMV 130', slug:'gmv-130-2020',
            desc:'Gebraucht Bj. 2020, max. 1.300 mm Verlegetiefe — Vibrationspflug in gutem Zustand.',
            descEN:'Used 2020, max. 1,300 mm installation depth — vibrating plough in good condition.', modell:'gmv-130-2020' }
        ],
        /* ≤ 2.000 mm — Geräte mit max. 1.500–2.000 mm */
        d: [
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 180 AF', slug:'gm-180-af',
            desc:'Max. 1.800 mm Frästiefe — das leistungsstärkste Schlepperanbaugerät im Portfolio.',
            descEN:'Max. 1,800 mm cutting depth — the most powerful tractor-mounted machine in the portfolio.', modell:'gm-180-af' },
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 140 AF 600 H', slug:'gm-140-af-600-h',
            desc:'Max. 1.500 mm, flexibles 1- oder 2-Balken-System. Ab Schlepper 10 t.',
            descEN:'Max. 1,500 mm, flexible 1- or 2-bar system. Tractor from 10 t.', modell:'gm-140-af-600-h' },
          { tag:'Schlepperanbau', tagEN:'Tractor-Mounted', name:'GM 160 AF', slug:'gm-160-af',
            desc:'Max. 1.600 mm, Zapfwelle oder Hydraulikmotor — flexibel für Schlepper und Unimog.',
            descEN:'Max. 1,600 mm, PTO shaft or hydraulic motor — flexible for tractors and Unimog.', modell:'gm-160-af' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 300 HF', slug:'gm-300-hf',
            desc:'Max. 2.000 mm Frästiefe mit eigenem Turbodiesel 195 PS. Für Fernwärme und Sondertiefbau.',
            descEN:'Max. 2,000 mm cutting depth with its own 195 hp turbodiesel engine. For district heating and special deep construction.', modell:'gm-300-hf' }
        ],
        /* > 2.000 mm — Tiefenfräsen */
        x: [
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 250 H', slug:'gm-250-h',
            desc:'Max. 2.500 mm Frästiefe, 70–450 mm Schnittbreite. Für Sondertiefbau und Fernwärme.',
            descEN:'Max. 2,500 mm cutting depth, 70–450 mm cutting width. For special deep construction and district heating.', modell:'gm-250-h' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 300 H', slug:'gm-300-h',
            desc:'Max. 3.000 mm, 150–400 mm Schnittbreite. Für Großprojekte und tiefe Drainagen.',
            descEN:'Max. 3,000 mm, 150–400 mm cutting width. For major projects and deep drainage.', modell:'gm-300-h' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 300 HF', slug:'gm-300-hf',
            desc:'Max. 2.000 mm mit eigenem Turbodiesel. Kompakte Tiefenfräse für anspruchsvolle Einsätze.',
            descEN:'Max. 2,000 mm with its own turbodiesel engine. Compact deep-cut machine for demanding applications.', modell:'gm-300-hf' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 450 H', slug:'gm-450-h',
            desc:'Max. 4.500 mm — größte Frästiefe im LIBA-Portfolio. Für anspruchsvollste Sonderprojekte.',
            descEN:'Max. 4,500 mm — greatest cutting depth in the LIBA portfolio. For the most demanding special projects.', modell:'gm-450-h' }
        ]
      },
      /* ─── SELBSTFAHRER ──────────────────────────────────────────────────
         GM 4-Serie max. 1.500 mm, GM 6 ASR max. 1.700 mm, GM 1800 P 1.800 mm */
      self: {
        /* ≤ 600 mm — GM 4-Serie: kein Trägergerät nötig, ab kleiner Tiefe */
        s: [
          { tag:'Selbstfahrer', tagEN:'Self-Propelled', name:'GM 4 Raupe', nameEN:'GM 4 Crawler', slug:'gm-4-raupe',
            desc:'Max. 1.500 mm Frästiefe. Ideal für FTTH und flache Kabeltrassen — kein Trägergerät nötig.',
            descEN:'Max. 1,500 mm cutting depth. Ideal for FTTH and shallow cable routes — no carrier machine needed.', modell:'gm-4-raupe' },
          { tag:'Selbstfahrer', tagEN:'Self-Propelled', name:'GM 4 Allrad', nameEN:'GM 4 All-Wheel', slug:'gm-4-allrad',
            desc:'Max. 1.500 mm, Allradantrieb. Für Solarparks, Drainage und empfindliche Rasenflächen.',
            descEN:'Max. 1,500 mm, all-wheel drive. For solar parks, drainage and sensitive grass surfaces.', modell:'gm-4-allrad' },
          { tag:'Selbstfahrer · Vorführmaschine', tagEN:'Self-Propelled · Demo', name:'GM 4 Raupe', nameEN:'GM 4 Crawler', slug:'gm-4-raupe-2023',
            desc:'Vorführmaschine Bj. 2023, max. 1.500 mm — top Zustand, direkt verfügbar.',
            descEN:'Demo machine 2023, max. 1,500 mm — excellent condition, immediately available.', modell:'gm-4-raupe-2023' },
          { tag:'Selbstfahrer · Vorführmaschine', tagEN:'Self-Propelled · Demo', name:'GM 4 Rad', nameEN:'GM 4 Wheeled', slug:'gm-4-rad-2024',
            desc:'Vorführmaschine Bj. 2024, max. 1.500 mm, Allradantrieb — nahezu neuwertig.',
            descEN:'Demo machine 2024, max. 1,500 mm, all-wheel drive — near-new condition.', modell:'gm-4-rad-2024' }
        ],
        /* ≤ 1.200 mm — GM 4-Serie + GM 6 ASR für Hartgestein */
        m: [
          { tag:'Selbstfahrer', tagEN:'Self-Propelled', name:'GM 4 Raupe', nameEN:'GM 4 Crawler', slug:'gm-4-raupe',
            desc:'Max. 1.500 mm, autark ohne Trägergerät. Tagesleistung bis 1.000 m im Lockerboden.',
            descEN:'Max. 1,500 mm, autonomous without carrier machine. Daily output up to 1,000 m in loose ground.', modell:'gm-4-raupe' },
          { tag:'Selbstfahrer', tagEN:'Self-Propelled', name:'GM 4 Allrad', nameEN:'GM 4 All-Wheel', slug:'gm-4-allrad',
            desc:'Max. 1.500 mm, Allrad für empfindliche Flächen und Sportplatzdrainage.',
            descEN:'Max. 1,500 mm, all-wheel drive for sensitive surfaces and sports field drainage.', modell:'gm-4-allrad' },
          { tag:'Selbstfahrer', tagEN:'Self-Propelled', name:'GM 6 ASR', slug:'gm-6-asr',
            desc:'Max. 1.700 mm in Hartgestein FK IV — Felsfräse für Bereiche wo Bagger nicht wirtschaftlich sind.',
            descEN:'Max. 1,700 mm in hard rock class IV — rock cutter for areas where excavators are not economical.', modell:'gm-6-asr' }
        ],
        /* ≤ 2.000 mm — GM 6 ASR und GM 1800 P */
        d: [
          { tag:'Selbstfahrer', tagEN:'Self-Propelled', name:'GM 6 ASR', slug:'gm-6-asr',
            desc:'Max. 1.700 mm in Kalkstein und Schiefer — das stärkste Selbstfahrer-Fräsmodell.',
            descEN:'Max. 1,700 mm in limestone and slate — the most powerful self-propelled cutting model.', modell:'gm-6-asr' },
          { tag:'Selbstfahrer', tagEN:'Self-Propelled', name:'GM 1800 P', slug:'gm-1800-p',
            desc:'Max. 1.800 mm, Drainrohr bis Ø 160 mm. Für großflächige Drainage- und Landschaftsbauprojekte.',
            descEN:'Max. 1,800 mm, drain pipe up to Ø 160 mm. For large-scale drainage and landscaping projects.', modell:'gm-1800-p' },
          { tag:'Selbstfahrer · Gebraucht', tagEN:'Self-Propelled · Used', name:'GM 6 ASR', slug:'gm-6-asr-2015',
            desc:'Gebraucht Bj. 2015, max. 1.700 mm, 370 Bh — starke Alternative für Hartbodeneinsatz.',
            descEN:'Used 2015, max. 1,700 mm, 370 operating hours — strong alternative for hard ground applications.', modell:'gm-6-asr-2015' }
        ],
        /* > 2.000 mm */
        x: [
          { tag:'Beratung', tagEN:'Consultation', name:'Individuelle Lösung', slug:null,
            desc:'Für Frästiefen über 2.000 mm ohne Trägergerät beraten wir Sie direkt.',
            descEN:'For cutting depths over 2,000 mm without a carrier machine, contact us directly.', modell:'Selbstfahrer-Sonderlösung' }
        ]
      },
      /* ─── TIEFENFRÄSE ───────────────────────────────────────────────────
         Schritt 2 wird übersprungen — alle 4 Tiefenfräsen werden direkt gezeigt */
      tiefe: {
        m: [
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 250 H', slug:'gm-250-h',
            desc:'Max. 2.500 mm Frästiefe, 70–450 mm Schnittbreite. Schlepperanbau ab 300 PS.',
            descEN:'Max. 2,500 mm cutting depth, 70–450 mm cutting width. Tractor-mounted from 300 hp.', modell:'gm-250-h' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 300 H', slug:'gm-300-h',
            desc:'Max. 3.000 mm, 150–400 mm Schnittbreite. Für Fernwärme und Sondertiefbau.',
            descEN:'Max. 3,000 mm, 150–400 mm cutting width. For district heating and special deep construction.', modell:'gm-300-h' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 300 HF', slug:'gm-300-hf',
            desc:'Max. 2.000 mm mit eigenem Turbodiesel 195 PS. Kompakt und leistungsstark.',
            descEN:'Max. 2,000 mm with its own 195 hp turbodiesel engine. Compact and powerful.', modell:'gm-300-hf' },
          { tag:'Tiefenfräse', tagEN:'Deep-Cut Machine', name:'GM 450 H', slug:'gm-450-h',
            desc:'Max. 4.500 mm — größte Frästiefe im LIBA-Portfolio. Für anspruchsvollste Sonderprojekte.',
            descEN:'Max. 4,500 mm — greatest cutting depth in the LIBA portfolio. For the most demanding special projects.', modell:'gm-450-h' }
        ]
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
      var ctaLabel    = isEN ? 'Request a quote'  : 'Angebot anfragen';
      var detailLabel = isEN ? 'View machine'      : 'Zur Maschine';
      var arrowSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12" style="margin-left:.3em;flex-shrink:0"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
      cards.innerHTML = recs.map(function (r) {
        var tag  = (isEN && r.tagEN)  ? r.tagEN  : r.tag;
        var desc = (isEN && r.descEN) ? r.descEN : r.desc;
        var name = (isEN && r.nameEN) ? r.nameEN : r.name;
        return '<div class="wizard-rcard">'
          + '<span class="wizard-rcard-tag">' + tag + '</span>'
          + '<div class="wizard-rcard-name">' + name + '</div>'
          + '<div class="wizard-rcard-desc">' + desc + '</div>'
          + (r.slug
            ? '<a href="' + maschBase + r.slug + '.html" class="wizard-rcard-link">' + detailLabel + arrowSvg + '</a>'
            : '')
          + '<a href="' + kontaktBase + '?modell=' + encodeURIComponent(r.modell) + '" class="wizard-rcard-cta">' + ctaLabel
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

      var contactUrl = verdict.getAttribute('data-contact-url') || (isEN ? '/en/kontakt.html' : '/kontakt.html');
      if (isEN) {
        if (rentWins) {
          verdict.className = 'roi-verdict is-rent';
          verdict.innerHTML = '<span class="roi-verdict-msg">At <strong>' + days + ' operating days/year</strong>, hiring is currently cheaper. Buying pays off from <strong>' + breakEven + ' days/year</strong>.</span>'
            + '<a href="#mietanfrage" class="btn btn-ghost is-sm">Request a hire quote</a>';
        } else {
          verdict.className = 'roi-verdict is-buy';
          verdict.innerHTML = '<span class="roi-verdict-msg">At <strong>' + days + ' operating days/year</strong>, <strong>buying already makes sense today</strong> — you save ' + fmt(rentYear - ownYear) + ' annually.</span>'
            + '<a href="' + contactUrl + '?modell=' + encodeURIComponent(machLabel) + '#anfrage" class="btn btn-primary is-sm">Request a purchase quote</a>';
        }
      } else {
        if (rentWins) {
          verdict.className = 'roi-verdict is-rent';
          verdict.innerHTML = '<span class="roi-verdict-msg">Bei <strong>' + days + ' Einsatztagen/Jahr</strong> ist Mieten aktuell günstiger. Ab <strong>' + breakEven + ' Tagen/Jahr</strong> rechnet sich der Kauf.</span>'
            + '<a href="#mietanfrage" class="btn btn-ghost is-sm">Mietangebot anfragen</a>';
        } else {
          verdict.className = 'roi-verdict is-buy';
          verdict.innerHTML = '<span class="roi-verdict-msg">Bei <strong>' + days + ' Einsatztagen/Jahr</strong> lohnt sich der <strong>Kauf bereits heute</strong> — Sie sparen ' + fmt(rentYear - ownYear) + ' jährlich.</span>'
            + '<a href="' + contactUrl + '?modell=' + encodeURIComponent(machLabel) + '#anfrage" class="btn btn-primary is-sm">Kaufangebot anfragen</a>';
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

  /* Maschinen-Übersicht: Kategorie-Tab-Filter (ausgelagert aus maschinen.njk, CSP) */
  const mfTabs = $$('#mf-tabs .mf-tab');
  if (mfTabs.length) {
    const mfCards = $$('#maschinen-grid .maschine-card');
    mfTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        mfTabs.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-pressed', 'false'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-pressed', 'true');
        mfCards.forEach((card) => {
          card.classList.toggle('is-hidden', !(filter === 'all' || card.dataset.category === filter));
        });
      });
    });
  }

  /* Leistungs-Kalkulator auf der Maschinen-Übersicht (ausgelagert aus maschinen.njk, CSP) */
  const kalkulator = document.getElementById('kalkulator');
  if (kalkulator) {
    const boden   = document.getElementById('k-boden');
    const modell  = document.getElementById('k-modell');
    const dayEl   = document.getElementById('k-day');
    const weekEl  = document.getElementById('k-week');
    const monthEl = document.getElementById('k-month');
    const barD    = document.getElementById('k-bar-day');
    const barW    = document.getElementById('k-bar-week');
    const barM    = document.getElementById('k-bar-month');
    const MAX     = 1000;
    let cur       = { d: 0, w: 0, m: 0 };
    let raf       = null;
    const locale  = document.documentElement.lang === 'en' ? 'en' : 'de';

    const calcDay = () => {
      const raw = parseInt(boden.value) * parseFloat(modell.value);
      if (raw >= 100) return Math.round(raw / 50) * 50;
      if (raw >= 20)  return Math.round(raw / 10) * 10;
      return Math.max(Math.round(raw / 5) * 5, 5);
    };

    const animateTo = (target) => {
      const from = { d: cur.d, w: cur.w, m: cur.m };
      const dur  = 650;
      let t0     = null;
      if (raf) cancelAnimationFrame(raf);
      (function step(ts) {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        dayEl.textContent   = Math.round(from.d + (target.d - from.d) * e).toLocaleString(locale);
        weekEl.textContent  = Math.round(from.w + (target.w - from.w) * e).toLocaleString(locale);
        monthEl.textContent = Math.round(from.m + (target.m - from.m) * e).toLocaleString(locale);
        if (p < 1) { raf = requestAnimationFrame(step); }
        else {
          dayEl.textContent   = target.d.toLocaleString(locale);
          weekEl.textContent  = target.w.toLocaleString(locale);
          monthEl.textContent = target.m.toLocaleString(locale);
          cur = { d: target.d, w: target.w, m: target.m };
          raf = null;
        }
      })(performance.now());
      const pct = Math.max(target.d / MAX * 100, 2).toFixed(1);
      barD.style.width = pct + '%';
      barW.style.width = pct + '%';
      barM.style.width = pct + '%';
    };

    const update = () => { const d = calcDay(); animateTo({ d: d, w: d * 5, m: d * 20 }); };

    boden.addEventListener('change', update);
    modell.addEventListener('change', update);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { update(); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(kalkulator);
    } else { update(); }
  }

  /* Calendly: Klick-zum-Laden (Consent-Gate) — Widget erst nach ausdrücklichem Klick.
     Ausgelagert aus kontakt.njk, damit die CSP ohne 'unsafe-inline' auskommt. */
  const calendlyBtn = $('#calendly-load');
  if (calendlyBtn) {
    calendlyBtn.addEventListener('click', () => {
      const w = $('.calendly-inline-widget');
      if (w) { w.setAttribute('data-url', w.getAttribute('data-calendly-url')); w.style.display = ''; }
      const c = $('#calendly-consent'); if (c) c.style.display = 'none';
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js'; s.async = true;
      document.body.appendChild(s);
    });
  }

})();
