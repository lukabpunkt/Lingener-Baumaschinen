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

  /* Custom cursor (desktop only) */
  if (!isCoarse && !reduceMotion) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);

    let mx = 0, my = 0, raf = null;
    const loop = () => {
      const t = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = t;
      dot.style.transform  = t;
      raf = null;
    };
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      document.body.classList.add('is-cursor-visible');
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener('mouseleave', () => document.body.classList.remove('is-cursor-visible'));

    const hoverSel = 'a, button, .show-card, .app, .news-card, .media-frame, [data-cursor-hover]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(hoverSel)) document.body.classList.add('is-cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(hoverSel)) document.body.classList.remove('is-cursor-hover');
    });
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
})();
