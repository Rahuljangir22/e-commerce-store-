import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy routes and layout — code splitting for every major UI chunk.
const RootLayout = lazy(() => import('./layouts/RootLayout'));
const ProductList = lazy(() => import('./components/ProductList'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const NotFound = lazy(() => import('./components/NotFound'));

/**
 * Application routes: Home, product detail (dynamic id), cart, checkout, 404.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProductList heroTitle="Discover products" />,
      },
      {
        path: 'product/:id',
        element: (
          <ProductDetail addToCartLabel="Add to Cart" viewCartLabel="View cart" />
        ),
      },
      {
        path: 'cart',
        element: (
          <Cart
            heading="Your cart"
            emptyMessage="Your bag is empty — explore the catalog and add something you love."
          />
        ),
      },
      {
        path: 'checkout',
        element: <Checkout summaryTitle="Order summary" />,
      },
      {
        path: '*',
        element: (
          <NotFound
            errorCode={404}
            title="Page not found"
            detail="The URL you requested does not match any route in ShoppyGlobe. Check the address or return to the storefront."
          />
        ),
      },
    ],
  },
]);
