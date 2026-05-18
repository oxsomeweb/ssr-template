import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";

// @ts-ignore
import { render } from "../dist/server/entry-server.js";

const TEMPLATE = fs.readFileSync(
  path.join(process.cwd(), "dist/server/index.html"),
  "utf-8"
);

const BOT_RE = /bot|crawler|spider|googlebot|bingbot|yandex|baidu|duckduck|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|petalbot|semrushbot|ahrefsbot/i;

function stripHydrationScripts(html: string): string {
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
    if (isBot) html = stripHydrationScripts(html);

    res.statusCode = result.status;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("vary", "user-agent");
    res.setHeader("cache-control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    res.end(html);
  } catch (err) {
    console.error("SSR error", err);
    const msg = err instanceof Error ? (err.stack || err.message) : String(err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(`<!doctype html><html><body><h1>SSR error</h1><pre style="white-space:pre-wrap;color:#c00">${msg.replace(/</g, '&lt;')}</pre></body></html>`);
  }
}
