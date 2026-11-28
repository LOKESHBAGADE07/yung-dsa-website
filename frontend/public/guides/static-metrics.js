(() => {
  'use strict';
  const key = 'yungdsa:measurement:v1';
  const controls = document.querySelector('[data-measurement-controls]');
  const signal = () => navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1';
  let loaded = false;
  function preference() {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }
  function allowed() { return !signal() && preference() === 'allow'; }
  function pageOnly(event) {
    if (!allowed()) return null;
    if (!event.url) return event;
    const url = new URL(event.url, window.location.origin);
    return { ...event, url: url.origin + url.pathname };
  }
  function enable() {
    if (loaded || !allowed()) return;
    loaded = true;
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    window.va('beforeSend', pageOnly);
    window.si('beforeSend', pageOnly);
    for (const src of ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js']) {
      const script = document.createElement('script');
      script.defer = true; script.src = src; document.head.appendChild(script);
    }
  }
  function refresh() {
    if (controls) {
      controls.hidden = false;
      controls.querySelector('[data-measurement-status]').textContent = signal()
        ? 'Off. Your browser is sending a privacy signal.'
        : allowed() ? 'Optional measurement is on.' : 'Optional measurement is off.';
      for (const button of controls.querySelectorAll('button')) {
        button.disabled = signal();
        button.setAttribute('aria-pressed', String((button.dataset.measurementValue === 'allow') === allowed()));
      }
    }
    if (loaded && !allowed()) window.location.reload();
    else enable();
  }
  controls?.addEventListener('click', event => {
    const button = event.target.closest('button[data-measurement-value]');
    if (!button || signal()) return;
    try { window.localStorage.setItem(key, button.dataset.measurementValue); }
    catch {
      controls.querySelector('[data-measurement-status]').textContent = 'Browser storage is unavailable. Optional measurement is off.';
      return;
    }
    refresh();
  });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) refresh(); });
  window.addEventListener('pageshow', refresh);
  refresh();

  // These local controls also work when optional measurement is off.
  document.querySelector('[data-print-page]')?.addEventListener('click', () => window.print());
  const playerButton = document.querySelector('[data-load-player]');
  if (playerButton) {
    const template = document.querySelector('template[data-player]');
    playerButton.hidden = false;
    playerButton.addEventListener('click', () => {
      const frame = template.content.querySelector('iframe').cloneNode(true);
      playerButton.replaceWith(frame);
      frame.focus();
    }, { once: true });
  }
  const sources = {
    '/': 'home', '/style': 'gallery', '/style/fit-check': 'fit-check',
    '/style/goggles-sunglasses': 'sunglasses', '/style/baggy-lowers': 'lowers',
    '/style/hoodies-brand': 'hoodies'
  };
  const source = path => sources[path.replace(/\/$/, '') || '/'] || 'guide';
  function record(event, fields) {
    if (!allowed() || !window.crypto?.randomUUID) return;
    const body = JSON.stringify({ event, id: window.crypto.randomUUID(), measurement: 'allow', ...fields });
    const endpoint = '/api/fit_activity';
    try {
      const payload = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon?.(endpoint, payload)) return;
    } catch { /* Browsers may disallow beacon delivery. */ }
    if (typeof fetch === 'function') {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, credentials: 'omit', keepalive: true }).catch(() => {});
    }
  }
  if (window.location.pathname.replace(/\/$/, '') === '/wallpapers') {
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a[data-wallpaper-choice]');
      if (link) record('wallpaper_choice', { choice: link.dataset.wallpaperChoice });
    });
  }
  window.addEventListener('style:retailer-click', ({detail}) =>
    record('retailer_click', { product: detail.product_id, source: source(location.pathname) }));
  window.addEventListener('style:fit-complete', ({detail}) => record('fit_complete', detail));
  window.addEventListener('style:fit-open', ({detail}) => {
    let from = 'external-or-direct';
    if (document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.origin === location.origin) from = source(referrer.pathname);
    }
    record('fit_open', { source: detail.shared ? 'shared' : from });
  });
})();
