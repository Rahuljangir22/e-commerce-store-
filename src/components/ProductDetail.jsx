import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';

/**
 * Detail view: loads one product by route param :id with useEffect + graceful errors.
 * Labels are passed from the router as props (parent → child) for reuse and PropTypes.
 */
function ProductDetail({
  addToCartLabel = 'Add to Cart',
  viewCartLabel = 'View cart',
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Product not found' : `Error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setStatus('succeeded');
          document.title = `${data.title} | ShoppyGlobe`;
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product');
          setStatus('failed');
        }
      });

    return () => {
      cancelled = true;
      document.title = 'ShoppyGlobe';
    };
  }, [id]);

  const handleAdd = () => {
    if (product) dispatch(addToCart(product));
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <p className="page-fallback" role="status">
        Loading product…
      </p>
    );
  }

  if (status === 'failed') {
    return (
      <div className="checkout-card animate-pop">
        <div className="alert alert--error" role="alert">
          <strong>Something went wrong.</strong> {error}
        </div>
        <Link to="/" className="text-link">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-layout">
      <div className="detail-gallery">
        <img
          src={product.images?.[0] || product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="detail-panel">
        <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>{product.brand}</p>
        <h1>{product.title}</h1>
        <div className="price">${Number(product.price).toFixed(2)}</div>
        <p className="description">{product.description}</p>
        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={handleAdd}>
            {addToCartLabel}
          </button>
          <Link to="/cart" className="btn btn--ghost">
            {viewCartLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

ProductDetail.propTypes = {
  addToCartLabel: PropTypes.string,
  viewCartLabel: PropTypes.string,
};

export default ProductDetail;
