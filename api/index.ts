import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";

// @ts-expect-error — produced by `vite build --ssr` before this function is bundled
import { render } from "../dist/server/entry-server.js";

// Template read once at cold start. <!--app-head--> and <!--app-html--> get
// replaced per request with the SSR output. <script type="module"> tags
// pointing at /assets/*.js are stripped for bot user-agents (dynamic rendering
// per https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering).
const TEMPLATE = fs.readFileSync(
  path.join(process.cwd(), "dist/client/index.html"),
  "utf-8"
);

const BOT_RE = /bot|crawler|spider|googlebot|bingbot|yandex|baidu|duckduck|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|petalbot|semrushbot|ahrefsbot/i;

function stripHydrationScripts(html: string): string {
  // Remove the vite-injected module script that loads the React bundle, plus
  // any /assets/*.js preload links. Leaves everything else (analytics, etc.) intact.
  return html
    .replace(/<script\s+type="module"[^>]*src="\/assets\/[^"]+\.js"[^>]*><\/script>/g, "")
    .replace(/<link\s+rel="modulepreload"[^>]*href="\/assets\/[^"]+\.js"[^>]*\/?>/g, "");
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  const ua = (req.headers["user-agent"] || "") as string;
  const isBot = BOT_RE.test(ua);

  try {
    const result = render(url);
    let html = TEMPLATE.replace("<!--app-head-->", result.head).replace(
      "<!--app-html-->",
      result.html
    );
    if (isBot) {
      html = stripHydrationScripts(html);
    }
    res.statusCode = result.status;
    res.setHeader("content-type", "text/html; charset=utf-8");
    // Vary on user-agent so the CDN doesn't serve bot-stripped HTML to users (and vice versa).
    res.setHeader("vary", "user-agent");
    res.setHeader(
      "cache-control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.end(html);
  } catch (err) {
    console.error("SSR error", err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end("<!doctype html><html><body><h1>Server error</h1></body></html>");
  }
}
