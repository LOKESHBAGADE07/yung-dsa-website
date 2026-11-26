(() => {
  'use strict';
  const { products, date } = JSON.parse(document.getElementById('fit-data').textContent);
  const form = document.querySelector('[data-builder]');
  const result = document.querySelector('[data-result]');
  const status = document.querySelector('[data-status]');
  const shareStatus = document.querySelector('[data-share-status]');
  const linkBox = document.querySelector('[data-link-box]');
  const linkField = document.getElementById('fit-link');
  const byId = new Map(products.map(product => [product.id, product]));
  const money = amount => '₹' + amount.toLocaleString('en-IN');
  let lastCompleted = '';

  function selection() {
    const values = form.elements;
    const frames = byId.get(values.frames.value);
    const lowers = byId.get(values.lowers.value);
    return { budget: Number(values.budget.value), frames, lowers, total: frames.price + lowers.price, date };
  }

  function fitURL(fit) {
    const url = new URL(location.pathname, location.origin);
    url.search = new URLSearchParams({ budget: fit.budget, frames: fit.frames.id, lowers: fit.lowers.id });
    return url.href;
  }

  function paint() {
    const fit = selection();
    for (const [slot, item] of [['frames', fit.frames], ['lowers', fit.lowers]]) {
      const image = document.querySelector('[data-photo="' + slot + '"]');
      if (image.getAttribute('src') !== item.image) {
        image.hidden = false;
        image.src = item.image;
      }
      image.alt = item.name;
      document.querySelector('[data-name="' + slot + '"]').textContent = item.name;
      const shop = document.querySelector('[data-shop="' + slot + '"]');
      shop.href = item.url;
      shop.dataset.retailerId = item.id;
      shop.dataset.merchant = item.merchant;
      shop.textContent = (slot === 'frames' ? 'Sunglasses at ' : 'Lowers at ') + item.merchant + ' ↗';
    }
    const difference = fit.budget - fit.total;
    document.querySelector('[data-total]').textContent = money(fit.total);
    const balance = document.querySelector('[data-balance]');
    balance.textContent = difference === 0 ? 'Exactly on budget' :
      money(Math.abs(difference)) + (difference < 0 ? ' over budget' : ' under budget');
    balance.toggleAttribute('data-over', difference < 0);
    return fit;
  }

  function showResult(show, focus = false) {
    form.hidden = show;
    result.hidden = !show;
    linkBox.hidden = true;
    shareStatus.textContent = '';
    if (focus) {
      const target = show ? document.getElementById('result-title') : form.querySelector('input:checked');
      target.focus();
    }
  }

  function restore() {
    const params = new URLSearchParams(location.search);
    const requested = ['budget', 'frames', 'lowers'].some(key => params.has(key));
    const budget = params.get('budget');
    const frames = byId.get(params.get('frames'));
    const lowers = byId.get(params.get('lowers'));
    const valid = (budget === '2500' || budget === '3500') && frames?.category === 'eyewear' && lowers?.category === 'lowers';
    form.reset();
    status.textContent = '';
    if (valid) {
      form.elements.budget.value = budget;
      form.elements.frames.value = frames.id;
      form.elements.lowers.value = lowers.id;
    } else if (requested) {
      status.textContent = 'A piece or budget in this link is unavailable. Choose a new pair below.';
    }
    paint();
    showResult(Boolean(valid));
  }

  form.addEventListener('change', () => { status.textContent = ''; paint(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fit = paint();
    const url = fitURL(fit);
    if (url !== location.href) history.pushState(null, '', url);
    showResult(true, true);
    if (lastCompleted !== url) {
      lastCompleted = url;
      window.dispatchEvent(new CustomEvent('style:fit-complete', {
        detail: { frames: fit.frames.id, lowers: fit.lowers.id, budget: fit.budget }
      }));
    }
  });

  document.querySelector('[data-edit]').addEventListener('click', () => {
    history.pushState({ fitDraft: { budget: form.elements.budget.value, frames: form.elements.frames.value, lowers: form.elements.lowers.value } }, '', location.pathname);
    status.textContent = '';
    showResult(false, true);
  });

  function handleHistory() {
    restore();
    const draft = history.state?.fitDraft;
    if (result.hidden && draft && ['2500', '3500'].includes(draft.budget)
        && byId.get(draft.frames)?.category === 'eyewear' && byId.get(draft.lowers)?.category === 'lowers') {
      for (const key of ['budget', 'frames', 'lowers']) form.elements[key].value = draft[key];
      paint();
    }
  }
  window.addEventListener('popstate', handleHistory);
  document.querySelector('[data-share]').addEventListener('click', async () => {
    const fit = selection(), url = fitURL(fit);
    const data = { title: '06 Fit Check', text: fit.frames.name + ' + ' + fit.lowers.name + ' · ' + money(fit.total), url };
    shareStatus.textContent = '';
    if (typeof navigator.share === 'function') {
      try { await navigator.share(data); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    linkBox.hidden = false;
    linkField.value = url;
    try {
      await navigator.clipboard.writeText(url);
      shareStatus.textContent = 'Fit link copied.';
    } catch {
      linkField.focus();
      linkField.select();
      shareStatus.textContent = 'Copy the selected link to share your fit.';
    }
  });

  document.querySelector('[data-save]').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      const fit = selection();
      const blob = await window.renderFitCard(fit);
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url; link.download = '06-fit-' + fit.frames.id + '-' + fit.lowers.id + '.png';
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      shareStatus.textContent = 'Portrait card ready in your downloads.';
    } catch {
      shareStatus.textContent = 'The card could not be saved. You can still share your fit link.';
    } finally { button.disabled = false; }
  });
  handleHistory();
  window.dispatchEvent(new CustomEvent('style:fit-open', { detail: { shared: !result.hidden } }));
})();
