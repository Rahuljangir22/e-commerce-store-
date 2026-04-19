import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * Root component: router with Suspense for lazy route/layout chunks.
 */
function App() {
  return (
    <Suspense fallback={<div className="page-fallback">Loading experience…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
