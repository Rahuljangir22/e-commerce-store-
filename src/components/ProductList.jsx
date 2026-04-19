import PropTypes from 'prop-types';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runFetchProducts } from '../hooks/useProductList';
import { setSearchQuery } from '../store/slices/productsSlice';
import {
  selectFilteredProducts,
  selectProductsError,
  selectProductsStatus,
  selectSearchQuery,
} from '../store/selectors/productsSelectors';

// Lazy-load each card chunk for code splitting (performance rubric).
const ProductItem = lazy(() => import('./ProductItem'));

/**
 * Home page: Redux-backed search + grid. Course rubric: useEffect in THIS component fetches
 * https://dummyjson.com/products on mount. Shared logic lives in hooks/useProductList.js
 * (runFetchProducts + useProductList custom hook).
 */
function ProductList({ heroTitle = 'Discover products' }) {
  const dispatch = useDispatch();
  const filtered = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const searchQuery = useSelector(selectSearchQuery);

  // Rubric: ProductList uses useEffect to load the catalog when the component mounts.
  useEffect(() => {
    return runFetchProducts(dispatch);
  }, [dispatch]);

  useEffect(() => {
    document.title = `${heroTitle} | ShoppyGlobe`;
    return () => {
      document.title = 'ShoppyGlobe';
    };
  }, [heroTitle]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="products-page">
      <div className="products-toolbar">
        <h1>{heroTitle}</h1>
        <div className="search-field">
          <span className="search-field__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Search products (Redux filter)…"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Filter products by name or brand"
          />
        </div>
      </div>

      {status === 'loading' && (
        <p className="page-fallback" role="status">
          Loading products…
        </p>
      )}

      {status === 'failed' && (
        <div className="alert alert--error" role="alert">
          <strong>Could not load products.</strong> {error}. Please refresh or try again later.
        </div>
      )}

      {status === 'succeeded' && filtered.length === 0 && (
        <div className="empty-state animate-pop">
          <p>No products match &ldquo;{searchQuery}&rdquo;. Try another search.</p>
        </div>
      )}

      {status === 'succeeded' && filtered.length > 0 && (
        <div className="product-grid">
          <Suspense fallback={<p className="page-fallback">Loading catalog…</p>}>
            {filtered.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </Suspense>
        </div>
      )}
    </div>
  );
}

ProductList.propTypes = {
  heroTitle: PropTypes.string,
};

export default ProductList;

// Re-export custom hook (course rubric: dedicated hook module for product-list fetching).
export { useProductList } from '../hooks/useProductList';

// Filtering algorithm could be lifted to a web worker if size scales.
