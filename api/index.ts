import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || '/';
  const steps: string[] = [];
  try {
    steps.push('cwd=' + process.cwd());
    steps.push('__dirname=' + (typeof __dirname !== 'undefined' ? __dirname : 'undefined'));
    // List files at cwd and likely template locations
    try {
      const root = fs.readdirSync(process.cwd());
      steps.push('cwd contents: ' + JSON.stringify(root.slice(0, 30)));
    } catch (e: any) { steps.push('readdir cwd failed: ' + e.message); }

    for (const p of ['dist/server', 'dist/client', './dist/server', '/var/task/dist/server']) {
      try {
        const list = fs.readdirSync(p);
        steps.push(p + ' exists: ' + JSON.stringify(list.slice(0, 20)));
      } catch (e: any) {
        steps.push(p + ' missing: ' + e.message);
      }
    }

    // Now try the dynamic import
    let render: any;
    try {
      const mod = await import('../dist/server/entry-server.js' as any);
      render = mod.render;
      steps.push('imported entry-server.js OK, keys: ' + Object.keys(mod).join(','));
    } catch (e: any) {
      steps.push('IMPORT FAILED: ' + (e?.stack || e?.message || String(e)));
      throw e;
    }

    // Try the render
    let result;
    try {
      result = render(url);
      steps.push('render() OK, html=' + result.html.length + ' chars, head=' + result.head.length);
    } catch (e: any) {
      steps.push('RENDER FAILED: ' + (e?.stack || e?.message || String(e)));
      throw e;
    }

    res.statusCode = 200;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end('<pre style="white-space:pre-wrap;font-family:monospace">' + steps.join('\n').replace(/</g, '&lt;') + '\n\n--- RENDERED HEAD ---\n' + result.head.replace(/</g, '&lt;') + '\n\n--- RENDERED HTML (first 2000) ---\n' + result.html.slice(0, 2000).replace(/</g, '&lt;') + '</pre>');
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end('<pre style="white-space:pre-wrap;font-family:monospace;color:#c00">DEBUG TRACE\n\n' + steps.join('\n').replace(/</g, '&lt;') + '\n\nFINAL ERROR:\n' + ((err?.stack || err?.message || String(err)).replace(/</g, '&lt;')) + '</pre>');
  }
}
