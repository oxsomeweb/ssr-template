import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

// Install browser-API shims BEFORE any SSR bundle code runs. Supabase, next-themes,
// and similar libs touch localStorage at module-init time and crash in Node SSR
// without these stubs. We use a dynamic import for the SSR bundle below to
// guarantee these shims are set up before its module-init code executes.
(() => {
  const g = globalThis as any;
  if (typeof g.localStorage === 'undefined') {
    const stub = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      get length() { return 0; },
    };
    g.localStorage = stub;
    g.sessionStorage = stub;
  }
})();

const TEMPLATE = fs.readFileSync(
  path.join(process.cwd(), 'dist/server/index.html'),
  'utf-8'
);

const BOT_RE = /bot|crawler|spider|googlebot|bingbot|yandex|baidu|duckduck|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|petalbot|semrushbot|ahrefsbot/i;

function stripHydrationScripts(html: string): string {
  return html
    .replace(/<script\s+type="module"[^>]*src="\/assets\/[^"]+\.js"[^>]*><\/script>/g, '')
    .replace(/<link\s+rel="modulepreload"[^>]*href="\/assets\/[^"]+\.js"[^>]*\/?>/g, '');
}

let cachedRender: ((url: string) => { html: string; head: string; status: number }) | null = null;
let loadPromise: Promise<typeof cachedRender> | null = null;
async function getRender() {
  if (cachedRender) return cachedRender;
  if (!loadPromise) {
    // @ts-ignore — built by vite SSR
    loadPromise = import('../dist/server/entry-server.js').then((m: any) => {
      cachedRender = m.render;
      return cachedRender;
    });
  }
  return loadPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || '/';
  const ua = (req.headers['user-agent'] || '') as string;
  const isBot = BOT_RE.test(ua);
  try {
    const render = await getRender();
    if (!render) throw new Error('SSR bundle loaded but render export missing');
    const result = render(url);
    let html = TEMPLATE.replace('<!--app-head-->', result.head).replace(
      '<!--app-html-->',
      result.html
    );
    if (isBot) html = stripHydrationScripts(html);
    res.statusCode = result.status;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('vary', 'user-agent');
    res.setHeader('cache-control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.end(html);
  } catch (err: any) {
    console.error('SSR error', err);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    const msg = err?.stack || err?.message || String(err);
    res.end('<!doctype html><html><body><h1>SSR error</h1><pre style="white-space:pre-wrap;color:#c00">' + msg.replace(/</g, '&lt;') + '</pre></body></html>');
  }
}
