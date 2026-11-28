'use strict';

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const money = amount => '₹' + amount.toLocaleString('en-IN');
const route = '/style/fit-check/';
const title = '06 Fit Check — Build a Yung DSA Inspired Streetwear Pair';
const description = 'Choose sunglasses and baggy lowers, compare the pair to your budget and share your Pune 06 streetwear edit with a friend.';

function productChoices(label, name, products) {
  return `<fieldset class="choice-group"><legend>${label}</legend><div class="choice-grid">
    ${products.map((p, index) => `<label class="piece-choice">
      <input type="radio" name="${name}" value="${escape(p.id)}" ${index === 0 ? 'checked' : ''}>
      <span class="tile"><span class="tile-image"><img src="${escape(p.image)}" width="${p.imageWidth}" height="${p.imageHeight}" alt="" loading="lazy" decoding="async"></span>
      <span class="selection-mark" aria-hidden="true">✓</span>
      <span class="tile-name">${escape(p.name)}</span><span class="tile-price">${money(p.price)}</span></span>
    </label>`).join('')}
  </div></fieldset>`;
}

function productFigure(product, slot) {
  return `<figure class="hero-piece ${slot}"><div class="product-photo"><img data-photo="${slot}" src="${escape(product.image)}" alt="${escape(product.name)}" width="${product.imageWidth}" height="${product.imageHeight}" fetchpriority="high"></div>
    <figcaption><span>${slot === 'frames' ? 'Sunglasses' : 'Lowers'}</span><strong data-name="${slot}">${escape(product.name)}</strong></figcaption></figure>`;
}

module.exports = function fitCheckPage(catalogue) {
  const frames = catalogue.products.filter(product => product.category === 'eyewear');
  const lowers = catalogue.products.filter(product => product.category === 'lowers');
  const first = frames[0], second = lowers[0];
  const total = first.price + second.price;
  const date = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(catalogue.updatedAt + 'T00:00:00Z'));
  const url = 'https://yungdsa.com' + route;
  const crumbs = ['Home', 'Style Finder', '06 Fit Check'].map((name, i) => ({
    '@type': 'ListItem', position: i + 1, name, item: ['https://yungdsa.com/', 'https://yungdsa.com/style/', url][i]
  }));
  const data = catalogue.products.map(({id, name, price, merchant, category, image, url, tone}) => ({id, name, price, merchant, category, image, url, tone}));
  const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${url}">
<meta property="og:title" content="06 Fit Check · Yung DSA"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:type" content="website">
<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/style/fit-check/fit.css">
<script type="application/ld+json">${json({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs})}</script>
<script src="/guides/static-metrics.js" defer></script><script src="/style/style.js" defer></script><script src="/style/fit-check/card.js" defer></script><script src="/style/fit-check/fit.js" defer></script>
</head><body><a class="skip" href="#main">Skip to fit check</a>
<header><div class="topline"><a class="brand" href="/" aria-label="Yung DSA home">YUNG<span>DSA</span></a><a class="back" href="/style/">← Style Finder</a></div></header>
<main id="main"><div class="intro"><h1>06 <em>Fit Check</em></h1><p>Pair sunglasses with baggy lowers. Pick your budget and share the combination.</p></div>
<div class="workspace">
<section class="look-sheet" aria-label="Your selected pair">
  <div class="diptych">${productFigure(first, 'frames')}${productFigure(second, 'lowers')}</div>
  <div class="receipt" aria-live="polite" aria-atomic="true"><div><span>Pair total</span><strong data-total>${money(total)}</strong></div><p data-balance>${money(Math.abs(2500-total))} ${total > 2500 ? 'over' : 'under'} budget</p></div>
  <p class="fine">Similar-style picks · Prices checked <time datetime="${escape(catalogue.updatedAt)}">${date}</time>. Delivery and stock depend on the retailer.</p>
</section>
<div class="work-controls">
<p data-status role="status" class="status"></p>
<form data-builder hidden>
  <fieldset class="budget"><legend>Your budget</legend><div class="segments">
    ${[2500,3500].map((value,i)=>`<label><input type="radio" name="budget" value="${value}" ${i===0?'checked':''}><span>${money(value)}</span></label>`).join('')}
  </div></fieldset>
  ${productChoices('Sunglasses', 'frames', frames)}
  ${productChoices('Lowers', 'lowers', lowers)}
  <button class="primary" type="submit">Reveal my fit <span aria-hidden="true">↗</span></button>
</form>
<section class="result" data-result hidden aria-labelledby="result-title">
  <h2 id="result-title" tabindex="-1">Your fit is ready.</h2><p>Send this pair to a friend or save a portrait card.</p>
  <button class="primary" type="button" data-share>Share this fit <span aria-hidden="true">↗</span></button>
  <div class="secondary-actions"><button type="button" data-save>Save card</button><button type="button" data-edit>Edit this fit</button></div>
  <div data-link-box hidden><label for="fit-link">Link to this fit</label><input id="fit-link" type="url" readonly></div>
  <p data-share-status role="status" class="status"></p>
  <div class="retailers"><h3>Find the pieces</h3><a data-shop="frames" href="${escape(first.url)}" rel="noopener noreferrer" target="_blank">Sunglasses at ${escape(first.merchant)} ↗</a><a data-shop="lowers" href="${escape(second.url)}" rel="noopener noreferrer" target="_blank">Lowers at ${escape(second.merchant)} ↗</a></div>
</section>
<noscript><section><h2>Explore the pieces</h2><p>Enable JavaScript to build and share a pair, or browse the retailer listings.</p><ul>${data.map(p => `<li><a href="${escape(p.url)}" rel="noopener noreferrer" target="_blank">${escape(p.name)} · ${money(p.price)}</a></li>`).join('')}</ul></section></noscript>
</div></div>
<nav class="fit-guides" aria-label="Fit and clothing guides">
  <a href="/style/goggles-sunglasses/">Compare frame measurements</a>
  <a href="/style/baggy-lowers/">Check how the lowers fit</a>
  <a href="/style/hoodies-brand/#company">See the clothing credits</a>
</nav>
</main><footer><span>Independent fan guide by <a href="https://www.linkedin.com/in/lokeshbagade/" target="_blank" rel="noopener noreferrer">Lokesh Bagade</a>.</span><span>Retailer links earn no commission. <a href="/style/about/#privacy">Privacy &amp; analytics</a></span></footer>
<script id="fit-data" type="application/json">${json({products:data,date})}</script></body></html>\n`;
};
