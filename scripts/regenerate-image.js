#!/usr/bin/env node
/**
 * scripts/regenerate-image.js
 *
 * Self-contained hero image regenerator for the Claude SEO review agent.
 * Generates a fresh hero image via Gemini, uploads to Supabase Storage,
 * prints the public URL on stdout.
 *
 * No npm dependencies — uses built-in fetch (Node 18+).
 *
 * Usage:
 *   node scripts/regenerate-image.js \
 *     --slug=plumbing-aurora \
 *     --service="Drain Cleaning" \
 *     --city="Aurora, CO"
 *
 * Optional flags:
 *   --repo=<repo-name>    auto-detected from `git remote get-url origin` if omitted
 *   --kind=service|city   used to tune the prompt; default "service"
 *
 * Required env vars (passed by claude-review.yml workflow):
 *   GEMINI_API_KEY
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 *
 * Output:
 *   stdout: the public URL of the uploaded image (single line)
 *   stderr: progress + errors
 */

import { execSync } from 'child_process';

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, ...v] = a.slice(2).split('=');
      return [k, v.join('=')];
    })
);

const slug    = args.slug;
const service = args.service ?? '';
const city    = args.city ?? '';
const kind    = args.kind ?? 'service';
let   repo    = args.repo;

if (!slug) {
  console.error('regenerate-image: --slug is required');
  process.exit(1);
}

// Auto-detect repo name from git remote if not passed.
if (!repo) {
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const m = remote.match(/[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (m) repo = m[2];
  } catch {
    // ignore — will fail below if still unset
  }
}
if (!repo) {
  console.error('regenerate-image: could not detect repo name; pass --repo=<name>');
  process.exit(1);
}

const GEMINI_KEY    = process.env.GEMINI_API_KEY;
const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY;
const missing = [
  !GEMINI_KEY   && 'GEMINI_API_KEY',
  !SUPABASE_URL && 'SUPABASE_URL',
  !SUPABASE_KEY && 'SUPABASE_SERVICE_KEY',
].filter(Boolean);
if (missing.length) {
  console.error(`regenerate-image: missing env vars: ${missing.join(', ')}`);
  process.exit(1);
}

// ── Build prompt ─────────────────────────────────────────────────────────────
// Mirrors the style guidance used by the site-builder pipeline so visual
// register stays consistent across initial-build and reviewer-regenerated
// images.
const subject = [service, city].filter(Boolean).join(' in ') || slug.replace(/-/g, ' ');
const sceneHint = kind === 'city'
  ? 'A wide establishing shot suggesting the local service area — recognisable streetscape or neighborhood character, no people identifiable.'
  : 'In-progress, real work scene — tools, hands, or just-finished detail. Daylight or balanced indoor light, professional but unposed.';

const prompt = [
  `Photorealistic hero image for a local service business website.`,
  `Subject: ${subject}.`,
  sceneHint,
  `Wide 16:9 aspect, suitable for a 1920×1080 hero banner with overlay text.`,
  `Clean composition. No text overlays, no watermarks, no logos, no stock-photo feel,`,
  `no people facing the camera (no recognisable identifiable faces).`,
].join(' ');

// ── 1. Call Gemini ───────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

console.error(`[regenerate-image] requesting Gemini for "${subject}"…`);
const geminiRes = await fetch(geminiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
  }),
});

if (!geminiRes.ok) {
  const text = await geminiRes.text();
  console.error(`[regenerate-image] Gemini ${geminiRes.status}: ${text.slice(0, 400)}`);
  process.exit(1);
}

const data = await geminiRes.json();
const parts = data.candidates?.[0]?.content?.parts || [];
// Gemini REST returns base64 in inlineData.data (or inline_data.data — both casings appear).
const imagePart = parts.find((p) => {
  const d = p.inlineData || p.inline_data;
  return d && (d.mimeType || d.mime_type)?.startsWith('image/');
});
if (!imagePart) {
  console.error('[regenerate-image] Gemini returned no image part. Full response keys:', Object.keys(data));
  process.exit(1);
}

const imageData = imagePart.inlineData || imagePart.inline_data;
const buffer    = Buffer.from(imageData.data, 'base64');
const mimeType  = imageData.mimeType || imageData.mime_type || 'image/jpeg';
const ext       = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
console.error(`[regenerate-image] Gemini returned ${buffer.length} bytes (${mimeType})`);

// ── 2. Upload to Supabase Storage (REST, no SDK) ─────────────────────────────
const bucket = 'hero-images';
const path   = `${repo}/${slug}.${ext}`;
const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

console.error(`[regenerate-image] uploading to ${bucket}/${path}…`);
const uploadRes = await fetch(uploadUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': mimeType,
    'x-upsert': 'true',
  },
  body: buffer,
});

if (!uploadRes.ok) {
  const text = await uploadRes.text();
  console.error(`[regenerate-image] Supabase upload ${uploadRes.status}: ${text.slice(0, 400)}`);
  process.exit(1);
}

// ── 3. Print public URL on stdout ────────────────────────────────────────────
const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
console.error(`[regenerate-image] ✅ uploaded`);
console.log(publicUrl);
