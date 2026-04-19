import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../store/slices/cartSlice';

/**
 * One cart row: line price math (qty × unit = line total), controls, remove.
 */
function CartItem({ item }) {
  const dispatch = useDispatch();
  const atMin = item.quantity <= 1;
  const unit = Number(item.price);
  const qty = item.quantity;
  const lineTotal = unit * qty;

  return (
    <li className="cart-row">
      <div className="cart-row__thumb">
        <img src={item.thumbnail} alt="" loading="lazy" decoding="async" />
      </div>
      <div>
        <p className="cart-row__title">{item.title}</p>
        <p className="cart-row__unit-price">
          ${unit.toFixed(2)} <span className="cart-row__per">each</span>
        </p>
        <p className="cart-row__math" aria-label="Line total calculation">
          {qty} × ${unit.toFixed(2)} = <strong>${lineTotal.toFixed(2)}</strong>
        </p>
        <div className="cart-row__controls">
          <div className="qty-control">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={atMin}
              onClick={() => dispatch(decrementQuantity(item.id))}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => dispatch(incrementQuantity(item.id))}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="btn btn--danger btn--small"
            onClick={() => dispatch(removeFromCart(item.id))}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="cart-row__line-total">
        ${lineTotal.toFixed(2)}
      </div>
    </li>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartItem;
