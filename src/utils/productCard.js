/**
 * Build a short specs line for home cards from DummyJSON fields (category, SKU, weight, dimensions).
 */
export function getProductSpecsLine(product) {
  const parts = [];
  if (product.category) {
    parts.push(product.category.replace(/-/g, ' '));
  }
  if (product.sku) {
    parts.push(`SKU ${product.sku}`);
  }
  if (product.weight != null && product.weight !== '') {
    parts.push(String(product.weight));
  }
  const d = product.dimensions;
  if (d && typeof d === 'object') {
    const w = d.width ?? d.depth;
    const h = d.height;
    if (w != null && h != null) {
      parts.push(`${w} × ${h}`);
    }
  } else if (typeof d === 'string' && d.trim()) {
    parts.push(d.trim());
  }
  if (parts.length) {
    return parts.slice(0, 4).join(' · ');
  }
  if (product.description) {
    const t = product.description.trim();
    return t.length > 90 ? `${t.slice(0, 87)}…` : t;
  }
  return 'Specifications available on detail page';
}

/**
 * Rating + review count when the API provides them (list/detail shapes vary).
 */
export function getProductReviewSummary(product) {
  const rating = product.rating;
  if (rating == null || Number.isNaN(Number(rating))) {
    return null;
  }
  const n = Array.isArray(product.reviews) ? product.reviews.length : null;
  const stars = Number(rating).toFixed(1);
  if (n != null && n > 0) {
    return { stars, count: n, label: `${stars} out of 5 · ${n} review${n === 1 ? '' : 's'}` };
  }
  return { stars, count: 0, label: `${stars} out of 5 (average rating)` };
}

/**
 * Optional list / strike price from discountPercentage when present.
 */
export function getPriceDisplay(product) {
  const price = Number(product.price);
  const disc = Number(product.discountPercentage);
  if (disc > 0 && disc < 100) {
    const list = price / (1 - disc / 100);
    return {
      sale: price,
      list: Math.round(list * 100) / 100,
      hasDiscount: true,
    };
  }
  return { sale: price, list: null, hasDiscount: false };
}
