import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";

// @ts-expect-error — produced by `vite build --ssr` before this function is bundled
import { render } from "../dist/server/entry-server.js";

// Template read once at cold start. <!--app-head--> and <!--app-html--> get
// replaced per request with the SSR output.
const TEMPLATE = fs.readFileSync(
  path.join(process.cwd(), "dist/client/index.html"),
  "utf-8"
);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  try {
    const result = render(url);
    const html = TEMPLATE.replace("<!--app-head-->", result.head).replace(
      "<!--app-html-->",
      result.html
    );
    res.statusCode = result.status;
    res.setHeader("content-type", "text/html; charset=utf-8");
    // Vercel CDN edge cache: most Googlebot crawls hit cache, not the function.
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
