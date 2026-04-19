import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import {
  getPriceDisplay,
  getProductReviewSummary,
  getProductSpecsLine,
} from '../utils/productCard';

/**
 * Single product card: image, title, price, specs, reviews, actions.
 */
function ProductItem({ product }) {
  const dispatch = useDispatch();
  const specs = getProductSpecsLine(product);
  const review = getProductReviewSummary(product);
  const { sale, list, hasDiscount } = getPriceDisplay(product);

  const handleAdd = () => {
    dispatch(addToCart(product));
  };

  return (
    <article className="product-card animate-rise">
      <Link to={`/product/${product.id}`} className="product-card__media">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="product-card__body">
        <Link to={`/product/${product.id}`}>
          <h2 className="product-card__title">{product.title}</h2>
        </Link>

        <div className="product-card__price-row">
          {hasDiscount && list != null && (
            <span className="product-card__price--list">${list.toFixed(2)}</span>
          )}
          <span className="product-card__price">${sale.toFixed(2)}</span>
          {hasDiscount && Number(product.discountPercentage) > 0 && (
            <span className="product-card__badge-save">
              −{Math.round(Number(product.discountPercentage))}%
            </span>
          )}
        </div>

        <p className="product-card__specs" title={specs}>
          <span className="product-card__label">Specs</span>
          {specs}
        </p>

        {review && (
          <div className="product-card__reviews" aria-label="Customer reviews summary">
            <span className="product-card__stars" aria-hidden="true">
              ★ {review.stars}
            </span>
            <span className="product-card__review-meta">{review.label}</span>
          </div>
        )}

        {product.brand && (
          <p className="product-card__brand">{product.brand}</p>
        )}

        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={handleAdd}>
            Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="btn btn--ghost">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    brand: PropTypes.string,
    category: PropTypes.string,
    sku: PropTypes.string,
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dimensions: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        depth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ]),
    description: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.array,
    discountPercentage: PropTypes.number,
  }).isRequired,
};

export default ProductItem;

// Note: Product item component remains decoupled from data fetches.
