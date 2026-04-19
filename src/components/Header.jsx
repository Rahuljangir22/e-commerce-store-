import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../store/selectors/cartSelectors';

/**
 * SVG mark: globe + bag motif, black on white (light theme — no purple).
 */
function LogoMark() {
  return (
    <svg
      className="site-logo__svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="38" height="38" rx="12" fill="#fff" stroke="#0a0a0a" strokeWidth="2" />
      <circle cx="20" cy="19" r="7.5" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
      <path
        d="M12.5 19h15M20 11.5c-2 2.2-2 13.8 0 16M20 11.5c2 2.2 2 13.8 0 16"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 25h6l1 8H23l1-8z"
        stroke="#0a0a0a"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="#f5f5f5"
      />
      <path d="M25 25v-2a3 3 0 016 0v2" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * Top navigation: brand, main links, cart shortcut with live badge count.
 */
function Header({ brandName }) {
  const cartCount = useSelector(selectCartItemCount);

  return (
    <header className="site-header animate-rise">
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo">
          <LogoMark />
          <span className="site-logo__wordmark">
            <span className="site-logo__name">{brandName}</span>
            <span className="site-logo__tag">Global shopping</span>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
        </nav>

        <NavLink to="/cart" className="cart-link" aria-label="Open shopping cart">
          <span aria-hidden="true" className="cart-link__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1" fill="currentColor" stroke="none" />
              <path d="M6 6L5 3H2" strokeLinecap="round" />
            </svg>
          </span>
          {cartCount > 0 && (
            <span className="cart-link__badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </NavLink>
      </div>
    </header>
  );
}

Header.propTypes = {
  brandName: PropTypes.string.isRequired,
};

export default Header;
