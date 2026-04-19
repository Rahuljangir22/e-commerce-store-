import PropTypes from 'prop-types';
import { lazy, Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCartItems, selectCartSubtotal } from '../store/selectors/cartSelectors';

const CartItem = lazy(() => import('./CartItem'));

/**
 * Cart page: line items with per-line math; subtotal = sum of (price × qty).
 */
function Cart({ emptyMessage, heading }) {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const breakdown = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        title: i.title,
        qty: i.quantity,
        unit: Number(i.price),
        line: Number(i.price) * i.quantity,
      })),
    [items]
  );

  const computedSum = useMemo(
    () => breakdown.reduce((s, row) => s + row.line, 0),
    [breakdown]
  );

  return (
    <div className="cart-page">
      <h1>{heading}</h1>

      {items.length === 0 ? (
        <div className="empty-state animate-pop">
          <p>{emptyMessage}</p>
          <Link to="/" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <Suspense fallback={<p className="page-fallback">Loading cart…</p>}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </Suspense>
          </ul>

          <section className="cart-calc card-panel animate-rise" aria-labelledby="cart-calc-heading">
            <h2 id="cart-calc-heading" className="cart-calc__title">
              Price calculation
            </h2>
            <ul className="cart-calc__list">
              {breakdown.map((row) => (
                <li key={row.id} className="cart-calc__row">
                  <span className="cart-calc__label">{row.title}</span>
                  <span className="cart-calc__formula">
                    {row.qty} × ${row.unit.toFixed(2)} = ${row.line.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="cart-calc__verify" role="note">
              <span>Sum of lines</span>
              <strong>${computedSum.toFixed(2)}</strong>
            </div>
          </section>

          <div className="cart-summary animate-rise">
            <div className="cart-summary__row">
              <span className="cart-summary__label">Cart subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <p className="cart-summary__hint">
              Subtotal is the sum of each line: unit price × quantity.
            </p>
            <Link to="/checkout" className="btn btn--primary">
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

Cart.propTypes = {
  emptyMessage: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
};

export default Cart;
