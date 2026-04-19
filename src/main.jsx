/**
 * Entry: Redux Provider, Suspense for lazy App chunk, StrictMode in development.
 */
import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './styles/global.css';

// Lazy-load App so the initial bundle stays minimal (performance rubric).
const App = lazy(() => import('./App'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div className="page-fallback">Loading ShoppyGlobe…</div>}>
        <App />
      </Suspense>
    </Provider>
  </StrictMode>
);
