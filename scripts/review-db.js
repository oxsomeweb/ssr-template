#!/usr/bin/env node
/**
 * review-db.js — Supabase query CLI for the Claude SEO PR reviewer.
 *
 * Zero npm dependencies — uses Node.js built-in fetch (Node 18+).
 * Reads SUPABASE_URL and SUPABASE_SERVICE_KEY from env.
 * Auto-resolves client from GITHUB_REPOSITORY env var.
 *
 * Usage:
 *   node scripts/review-db.js client-id
 *   node scripts/review-db.js keywords --url=/services/foo
 *   node scripts/review-db.js paa --url=/services/foo
 *   node scripts/review-db.js gsc-history --url=/services/foo [--days=28]
 *   node scripts/review-db.js issues --url=/services/foo [--status=open]
 *   node scripts/review-db.js brief --url=/services/foo
 *   node scripts/review-db.js competitor-keywords --url=/services/foo [--limit=20]
 *
 * Always prints JSON to stdout. Errors print to stderr as JSON and exit 1.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GITHUB_REPO  = process.env.GITHUB_REPOSITORY; // "oxsomeweb/konsker-electric"

if (!SUPABASE_URL || !SUPABASE_KEY) {
  process.stderr.write(JSON.stringify({ error: 'SUPABASE_URL and SUPABASE_SERVICE_KEY must be set' }) + '\n');
  process.exit(1);
}

async function dbGet(table, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  if (!params.select) params.select = '*';
  if (!params.limit)  params.limit  = '200';
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status} — ${await res.text()}`);
  return res.json();
}

async function resolveClientId() {
  if (process.env.CLIENT_ID) return process.env.CLIENT_ID;
  if (!GITHUB_REPO) return null;
  const rows = await dbGet('clients', { github_repo: `eq.${GITHUB_REPO}`, select: 'id', limit: '1' });
  return rows[0]?.id ?? null;
}

// Parse CLI: cmd + --key=value args
const [,, cmd, ...rawArgs] = process.argv;
const args = Object.fromEntries(rawArgs.map(a => { const m = a.match(/^--([^=]+)=(.*)$/); return m ? [m[1], m[2]] : [a, true]; }));

async function main() {
  try {
    // ── client-id ──────────────────────────────────────────────────
    if (cmd === 'client-id') {
      const id = await resolveClientId();
      process.stdout.write(JSON.stringify({ client_id: id }) + '\n');
      return;
    }

    const clientId = await resolveClientId();
    if (!clientId) {
      process.stdout.write(JSON.stringify({ rows: [], note: `client not found for repo ${GITHUB_REPO}` }) + '\n');
      return;
    }
    const url = args.url ?? null;

    // ── keywords ───────────────────────────────────────────────────
    if (cmd === 'keywords') {
      if (!url) throw new Error('--url is required');
      // Try url-specific assignment first; fall back to top client keywords
      let rows = await dbGet('seo_keywords', {
        client_id: `eq.${clientId}`,
        assigned_url: `eq.${url}`,
        select: 'keyword,volume,difficulty,intent,current_position,assigned_url',
        order: 'volume.desc',
        limit: '50',
      });
      if (rows.length === 0) {
        rows = await dbGet('seo_keywords', {
          client_id: `eq.${clientId}`,
          select: 'keyword,volume,difficulty,intent',
          order: 'volume.desc',
          limit: '30',
        });
        process.stdout.write(JSON.stringify({ note: 'no url-specific assignments — top client keywords', rows }) + '\n');
        return;
      }
      process.stdout.write(JSON.stringify({ rows }) + '\n');
    }

    // ── paa ────────────────────────────────────────────────────────
    else if (cmd === 'paa') {
      if (!url) throw new Error('--url is required');
      const kwRows = await dbGet('seo_keywords', {
        client_id: `eq.${clientId}`,
        assigned_url: `eq.${url}`,
        select: 'id,keyword,volume',
        order: 'volume.desc',
        limit: '5',
      });
      if (kwRows.length === 0) {
        process.stdout.write(JSON.stringify({ paa_questions: [], note: 'no keywords assigned to URL' }) + '\n');
        return;
      }
      const ids = kwRows.map(r => r.id).join(',');
      const serpRows = await dbGet('seo_serp_features', {
        keyword_id: `in.(${ids})`,
        select: 'keyword_id,paa_questions',
        limit: '10',
      });
      const questions = serpRows.flatMap(r => {
        try {
          const q = typeof r.paa_questions === 'string' ? JSON.parse(r.paa_questions) : r.paa_questions;
          return Array.isArray(q) ? q : [];
        } catch { return []; }
      });
      process.stdout.write(JSON.stringify({ keywords: kwRows.map(r => r.keyword), paa_questions: [...new Set(questions)] }) + '\n');
    }

    // ── gsc-history ────────────────────────────────────────────────
    else if (cmd === 'gsc-history') {
      if (!url) throw new Error('--url is required');
      const days = parseInt(args.days ?? '28', 10);
      const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);
      const rows = await dbGet('seo_gsc_performance', {
        client_id: `eq.${clientId}`,
        page_url: `eq.${url}`,
        date: `gte.${since}`,
        select: 'query,clicks,impressions,ctr,position,date',
        order: 'date.desc',
        limit: '200',
      });
      if (rows.length === 0) {
        process.stdout.write(JSON.stringify({ url, days, avg_position: null, total_clicks: 0, total_impressions: 0, note: 'no GSC data' }) + '\n');
        return;
      }
      const clicks = rows.reduce((s, r) => s + (r.clicks || 0), 0);
      const impressions = rows.reduce((s, r) => s + (r.impressions || 0), 0);
      const avgPos = rows.reduce((s, r) => s + (r.position || 0), 0) / rows.length;
      process.stdout.write(JSON.stringify({
        url, days,
        avg_position: Math.round(avgPos * 10) / 10,
        total_clicks: clicks,
        total_impressions: impressions,
        avg_ctr: impressions > 0 ? (Math.round(clicks / impressions * 10000) / 100) + '%' : '0%',
        top_queries: rows.slice(0, 5).map(r => ({ query: r.query, clicks: r.clicks, position: r.position })),
      }) + '\n');
    }

    // ── issues ─────────────────────────────────────────────────────
    else if (cmd === 'issues') {
      if (!url) throw new Error('--url is required');
      const status = args.status ?? 'open';
      const rows = await dbGet('seo_issues', {
        client_id: `eq.${clientId}`,
        url: `eq.${url}`,
        status: `eq.${status}`,
        select: 'id,issue_type,description,severity,url,status',
        order: 'severity.desc',
        limit: '50',
      });
      process.stdout.write(JSON.stringify({ rows }) + '\n');
    }

    // ── brief ──────────────────────────────────────────────────────
    else if (cmd === 'brief') {
      if (!url) throw new Error('--url is required');
      const rows = await dbGet('content_briefs', {
        client_id: `eq.${clientId}`,
        target_page: `eq.${url}`,
        select: 'id,type,target_page,brief_json,priority,status,created_at',
        order: 'created_at.desc',
        limit: '5',
      });
      process.stdout.write(JSON.stringify({ rows }) + '\n');
    }

    // ── competitor-keywords ────────────────────────────────────────
    else if (cmd === 'competitor-keywords') {
      if (!url) throw new Error('--url is required');
      const limit = parseInt(args.limit ?? '20', 10);
      // Our keywords for this URL (topic signal)
      const ours = await dbGet('seo_keywords', {
        client_id: `eq.${clientId}`,
        assigned_url: `eq.${url}`,
        select: 'keyword',
        limit: '10',
      });
      // Top competitor keywords for client by volume
      const comp = await dbGet('seo_competitor_keywords', {
        client_id: `eq.${clientId}`,
        select: 'keyword,volume,competitor_domain,position',
        order: 'volume.desc',
        limit: String(limit * 4),
      });
      // Simple topic filter: any shared word (>3 chars) with our keywords
      const seeds = new Set(ours.flatMap(r => r.keyword.toLowerCase().split(/\s+/).filter(w => w.length > 3)));
      const relevant = comp.filter(r => r.keyword && r.keyword.toLowerCase().split(/\s+/).some(w => seeds.has(w))).slice(0, limit);
      process.stdout.write(JSON.stringify({ our_keywords: ours.map(r => r.keyword), competitor_gaps: relevant }) + '\n');
    }

    else {
      process.stderr.write(JSON.stringify({ error: `unknown command: ${cmd}`, commands: ['client-id', 'keywords', 'paa', 'gsc-history', 'issues', 'brief', 'competitor-keywords'] }) + '\n');
      process.exit(1);
    }
  } catch (err) {
    process.stderr.write(JSON.stringify({ error: err.message }) + '\n');
    process.exit(1);
  }
}

main();
