import { createSelector } from '@reduxjs/toolkit';

/** Product array returned from DummyJSON (stored after successful list fetch). */
export const selectProducts = (state) => state.products.items;

/** Current search string; ProductList filters using this value. */
export const selectSearchQuery = (state) => state.products.searchQuery;

export const selectProductsStatus = (state) => state.products.status;

export const selectProductsError = (state) => state.products.error;

/**
 * Memoized list of products filtered by Redux searchQuery (case-insensitive).
 */
export const selectFilteredProducts = createSelector(
  [selectProducts, selectSearchQuery],
  (products, searchQuery) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        String(p.brand || '')
          .toLowerCase()
          .includes(q)
    );
  }
);
