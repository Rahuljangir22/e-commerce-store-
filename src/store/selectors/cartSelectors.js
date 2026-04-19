import { createSelector } from '@reduxjs/toolkit';

/** All cart line items (Redux cart slice). */
export const selectCartItems = (state) => state.cart.items;

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((n, i) => n + i.quantity, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0)
);
