import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import { selectCartItems, selectCartSubtotal } from '../store/selectors/cartSelectors';

/**
 * Dummy checkout: form fields, cart summary, Place order clears cart and returns home.
 */
function Checkout({ summaryTitle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [completedLines, setCompletedLines] = useState([]);
  const [completedTotal, setCompletedTotal] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setCompletedLines(items.map((i) => ({ ...i })));
    setCompletedTotal(subtotal);
    setOrderPlaced(true);
    dispatch(clearCart());
    window.setTimeout(() => {
      navigate('/', { replace: true });
    }, 1600);
  };

  const summaryRows = orderPlaced ? completedLines : items;
  const summaryTotal = orderPlaced ? completedTotal : subtotal;

  return (
    <div className="checkout-grid">
      <form className="checkout-card" onSubmit={handlePlaceOrder}>
        <h2>Your details</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="form-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street, building, apt"
              autoComplete="street-address"
            />
          </div>
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              autoComplete="address-level2"
            />
          </div>
          <div className="form-field">
            <label htmlFor="notes">Order notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder="Delivery instructions"
            />
          </div>
        </div>

        {orderPlaced && (
          <p className="order-toast" role="status">
            Order placed
          </p>
        )}

        <button
          type="submit"
          className="btn btn--primary"
          style={{ marginTop: '1.25rem', width: '100%' }}
          disabled={items.length === 0 || orderPlaced}
        >
          Place Order
        </button>

        {items.length === 0 && !orderPlaced && (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Your cart is empty. <Link to="/">Add items</Link> before placing an order.
          </p>
        )}
      </form>

      <aside className="checkout-card">
        <h2>{summaryTitle}</h2>
        {summaryRows.length === 0 && !orderPlaced ? (
          <p style={{ color: 'var(--text-muted)' }}>No items in cart.</p>
        ) : (
          <>
            {summaryRows.map((item) => (
              <div key={item.id} className="checkout-line">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div
              className="checkout-line"
              style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--text)' }}
            >
              <span>Total</span>
              <span>${summaryTotal.toFixed(2)}</span>
            </div>
            {orderPlaced && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '1rem' }}>
                Cart cleared — redirecting to home…
              </p>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

Checkout.propTypes = {
  summaryTitle: PropTypes.string.isRequired,
};

export default Checkout;
