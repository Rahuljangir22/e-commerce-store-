import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';

/**
 * Single Redux store combining cart and product catalog slices.
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
});

// TODO: Preloaded state logic could be added here in the future.
