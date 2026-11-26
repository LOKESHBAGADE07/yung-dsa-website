(() => {
  'use strict';
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  for (const src of ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js']) {
    const script = document.createElement('script');
    script.defer = true; script.src = src; document.head.appendChild(script);
  }
  const sources = {
    '/': 'home', '/style': 'gallery', '/style/fit-check': 'fit-check',
    '/style/goggles-sunglasses': 'sunglasses', '/style/baggy-lowers': 'lowers'
  };
  const source = path => sources[path.replace(/\/$/, '') || '/'] || 'guide';
  function record(event, fields) {
    if (!window.crypto?.randomUUID) return;
    const body = JSON.stringify({ event, id: crypto.randomUUID(), ...fields });
    const endpoint = '/api/fit_activity';
    try {
      const payload = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon?.(endpoint, payload)) return;
    } catch { /* Browsers may disallow beacon delivery. */ }
    if (typeof fetch === 'function') {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, credentials: 'omit', keepalive: true }).catch(() => {});
    }
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
