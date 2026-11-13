/* Shared filtering logic; no network, storage or personal data. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.StyleFinder = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function select(items, options) {
    var category = options.category || "all";
    var budget = Number(options.budget) || Infinity;
    var result = items.filter(function (item) {
      return (category === "all" || item.category === category) && item.price <= budget;
    });
    if (options.sort === "price-asc") result.sort(function(a,b){return a.price-b.price;});
    if (options.sort === "price-desc") result.sort(function(a,b){return b.price-a.price;});
    return result;
  }
  return { select: select };
});
