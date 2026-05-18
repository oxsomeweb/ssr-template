# Path allowlist for Claude auto-fix commits

Claude may write to files matching the patterns below WITHOUT additional
human review. Anything outside the allowlist requires a human — Claude
should comment on the PR and stop, not edit.

## Allowed (globs)

- `src/data/**/*.ts`            — service pages, city pages, blog data
- `src/data/**/*.json`           — JSON-format data files
- `src/components/**/*.tsx`      — page templates and shared rendering components
- `src/pages/**/*.tsx`           — Dynamic*Page renderers, hub pages, static pages
- `vite-plugin-prerender.ts`     — prerender plugin (curated link lists, content generators)

## Denied (overrides everything above)

- `package.json`                 — dependency changes are a human decision
- `vite.config.ts`               — build config is a human decision
- `tsconfig*.json`               — TS config is a human decision
- `.github/workflows/**`         — CI changes are a human decision
- `.env*`                        — secrets, never
- `supabase/**`                  — backend, not Claude's lane
- `scripts/**`                   — build/deploy scripts are out of scope
- `src/integrations/**`          — third-party integration code

## Discovery — finding the right file at runtime

File names vary across client repos. Claude should never assume a fixed
path; instead discover the right file by:

1. **Read `AGENT_GUIDE.md`** — the per-repo source of truth for
   architecture. If it lists render templates, use that.
2. **Read `site-map.json`** if present — has `data_files` with paths.
3. **Grep for imports** when neither is available:
   - `import.*cityPages` → file that imports it is a city renderer
   - `import.*servicePages` → service renderer
   - `from "@/data/<filename>"` patterns
4. **Confirm by inspection** — the file should `.map()` over the data
   array AND have JSX returning markup.

## Rationale

Globs cover the directories where SEO content defects appear (data,
prerender, page templates, hub/nav components). Denies cover paths
where a wrong edit can break every PR going forward (CI/build config,
secrets, backend, scripts).

For render-path fixes, expanding the allowlist to `src/components/**`
and `src/pages/**` lets Claude clone existing rendering patterns from
sibling fields (e.g., copy how `sections` renders to handle a new
`caseStudies` field). The build-verification step at the end of every
review run catches mistakes.

If Claude needs to edit something outside this list, the right move is
to comment on the PR with the proposed change. A human picks it up.
