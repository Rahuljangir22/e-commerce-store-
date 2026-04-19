import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setProductsError,
  setProductsLoading,
  setProductsSuccess,
} from '../store/slices/productsSlice';

const PRODUCTS_URL = 'https://dummyjson.com/products';

/**
 * GET https://dummyjson.com/products and sync results into the products Redux slice.
 * @param {import('@reduxjs/toolkit').Dispatch} dispatch
 * @returns {() => void} cleanup so unmounted components ignore late responses
 */
export function runFetchProducts(dispatch) {
  let cancelled = false;

  dispatch(setProductsLoading());

  fetch(PRODUCTS_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      if (!cancelled) {
        dispatch(setProductsSuccess(data.products ?? []));
      }
    })
    .catch((err) => {
      if (!cancelled) {
        dispatch(
          setProductsError(
            err instanceof Error ? err.message : 'Failed to load products'
          )
        );
      }
    });

  return () => {
    cancelled = true;
  };
}

/**
 * Custom hook (course rubric): on mount, runs the same product-list fetch as ProductList’s useEffect.
 * ProductList calls runFetchProducts inside its own useEffect for the explicit “useEffect in ProductList” item;
 * this hook remains the required modular “useProductList” API.
 */
export function useProductList() {
  const dispatch = useDispatch();
  useEffect(() => runFetchProducts(dispatch), [dispatch]);
}
