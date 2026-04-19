import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux slice for catalog data and search query used by ProductList filtering.
 */
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchQuery: '',
  },
  reducers: {
    setProductsLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setProductsSuccess(state, action) {
      state.status = 'succeeded';
      state.items = action.payload;
    },
    setProductsError(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setProductsLoading,
  setProductsSuccess,
  setProductsError,
  setSearchQuery,
} = productsSlice.actions;

export default productsSlice.reducer;
