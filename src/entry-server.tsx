import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type FilledContext } from "react-helmet-async";
import App from "./App";

export type RenderResult = {
  html: string;
  head: string;
  status: number;
};

export function render(url: string): RenderResult {
  const helmetContext: Record<string, unknown> = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = helmetContext as FilledContext;
  const head = [
    helmet?.title?.toString() ?? "",
    helmet?.meta?.toString() ?? "",
    helmet?.link?.toString() ?? "",
    helmet?.script?.toString() ?? "",
    helmet?.noscript?.toString() ?? "",
  ]
    .filter((s) => s.length > 0)
    .join("\n");
  return { html, head, status: 200 };
}
