import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

const tree = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

// In production (Vercel SSR), the root is filled with rendered element children → hydrate.
// In dev (vite dev / Lovable preview), the root has only the <!--app-html--> comment
// node — comments are childNodes but NOT children. Checking .children.length avoids
// the hydration-mismatch blank screen on dev.
if (root.children.length > 0) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
