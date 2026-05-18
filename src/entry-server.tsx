import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Structural type for react-helmet-async output. Avoids importing FilledContext
// which is unavailable in react-helmet-async@3.x (the version Lovable scaffolds).
type HelmetData = {
  title?: { toString(): string };
  meta?: { toString(): string };
  link?: { toString(): string };
  script?: { toString(): string };
  noscript?: { toString(): string };
};

export type RenderResult = {
  html: string;
  head: string;
  status: number;
};

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: HelmetData } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  const helmet = helmetContext.helmet;
  const head = [
    helmet?.title?.toString() ?? '',
    helmet?.meta?.toString() ?? '',
    helmet?.link?.toString() ?? '',
    helmet?.script?.toString() ?? '',
    helmet?.noscript?.toString() ?? '',
  ]
    .filter((s) => s.length > 0)
    .join('\n');
  return { html, head, status: 200 };
}
