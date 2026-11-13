(function () {
  "use strict";
  var privacyOptOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
  if (!privacyOptOut) {
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    var analytics = document.createElement("script");
    analytics.defer = true;
    analytics.src = "/_vercel/insights/script.js";
    document.head.appendChild(analytics);
  }
  var filter = document.querySelector("[data-style-filter]");
  if (filter && window.StyleFinder) {
    var grid = document.querySelector("[data-product-grid]");
    var cards = Array.from(grid.querySelectorAll("[data-product-id]")).map(function(node) {
      return { id:node.dataset.productId, category:node.dataset.category, price:Number(node.dataset.price), node:node };
    });
    var count = document.querySelector("[data-result-count]");
    var empty = document.querySelector("[data-empty]");
    function update() {
      var selected = window.StyleFinder.select(cards, {
        category:filter.elements.category.value,
        budget:filter.elements.budget.value,
        sort:filter.elements.sort.value
      });
      cards.forEach(function(card) { card.node.hidden = true; });
      selected.forEach(function(card) { card.node.hidden = false; grid.appendChild(card.node); });
      count.textContent = selected.length + (selected.length === 1 ? " option" : " options") + " shown";
      empty.hidden = selected.length !== 0;
    }
    filter.hidden = false;
    filter.addEventListener("change", update);
    filter.addEventListener("submit", function(event){ event.preventDefault(); update(); });
    document.querySelector("[data-reset]").addEventListener("click", function(){
      filter.reset(); update(); filter.elements.category.focus();
    });
    update();
  }
  document.addEventListener("click", function(event) {
    var link = event.target.closest && event.target.closest("a[data-retailer-id]");
    if (!link || privacyOptOut) return;
    // Local integration hook. No order or revenue is inferred from a click.
    // Connect to a confirmed analytics account before claiming outbound reports.
    window.dispatchEvent(new CustomEvent("style:retailer-click", { detail: {
      product_id:link.dataset.retailerId,
      merchant:link.dataset.merchant,
      page:window.location.pathname
    }}));
  });
})();
