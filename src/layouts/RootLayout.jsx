import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// Header is lazy-loaded for code splitting (performance rubric).
const Header = lazy(() => import('../components/Header'));

/**
 * Shell layout: sticky header + main outlet for routed pages.
 */
function RootLayout() {
  return (
    <div className="app-shell">
      <Suspense fallback={<div className="page-fallback">Loading header…</div>}>
        <Header brandName="ShoppyGlobe" />
      </Suspense>
      <main className="app-main">
        <Suspense fallback={<div className="page-fallback">Loading page…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default RootLayout;
