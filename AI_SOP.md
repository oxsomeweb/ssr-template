# AI_SOP — Drippy Suds Agent Operating Manual

This document is the **only** procedure an external agent may follow when
modifying this repository. It is paired with `site-map.json` (the data contract)
and `scripts/validate-structure.js` (the gatekeeper).

---

## The Five-Step Sequence

### Step 1 — Read `site-map.json`

`site-map.json` is the only source of truth for file paths, anchor names, slug
formats, field shapes, route patterns, and capability flags. **Never** infer any
of these from the codebase. If a value you need is not in `site-map.json`, stop
and report — do not guess.

### Step 2 — Pick the operation type

| Operation | Allowed when | Files touched |
|---|---|---|
| Add city landing page | `capabilities.city_expansion === true` | `src/data/cityData.ts`, `src/App.tsx`, `vite-plugin-prerender.ts` |
| Enrich existing city entry | city slug already exists in `cityData` | `src/data/cityData.ts` (and mirror in `vite-plugin-prerender.ts` `CITY_CONTENT` if SEO copy fields changed) |
| Edit a static page region | file appears in `editable_regions` | only the region's file |
| Add new static page | template + router anchor exist | `src/pages/<New>.tsx`, `src/App.tsx`, `site-map.json` |
| Add service page | `capabilities.service_pages === true` | n/a — currently disabled |
| Add blog post | `capabilities.blog_posts === true` | n/a — currently disabled |

If `capabilities.<flag>` is `false`, the operation is forbidden — refuse it.

### Step 3 — Generate the change

#### A) Data file operations (cities)

1. Build a JSON object that exactly matches `data_files.cities.entry_template`.
2. Populate **every** field in `data_files.cities.required_fields`.
3. Respect every rule in `data_files.cities.field_constraints`
   (char limits, enum values, faqs min_items, faq item field names).
4. Confirm the slug matches `slug_format.regex`, is unique within the file,
   and is ≤ `slug_format.max_length`.
5. Resolve the public URL by reading `routes.dynamic` for the entry whose
   `data_file === "src/data/cityData.ts"` and substituting the slug into its
   `path`. For this project that yields `/mobile-detailing-<slug>`.

> **CRITICAL — `entry_template` is a TYPE SCHEMA, not a copy-paste template.**
> Every value inside `entry_template` is a description string of the form
> `"string — e.g. '...'"` describing what you must **generate**. Replace each
> description string with a real value of the stated type. An entry that still
> contains `"string — e.g."` text after generation is invalid and must not be
> committed.

**To add a city:**

1. Insert the new TypeScript object literal into `src/data/cityData.ts`
   immediately above the `// AI_CITY_ANCHOR` comment.
2. Insert a new `<Route path="/mobile-detailing-<slug>" element={<CityLanding />} />`
   line in `src/App.tsx` immediately above `{/* AI_ROUTE_ANCHOR */}`.
3. Mirror the new city into the `CITY_CONTENT` array and the `SERVICE_AREAS`
   array inside `vite-plugin-prerender.ts`. This is required because
   `prerender_registration.method` is `duplicated_inline_array` — the prerender
   plugin does NOT import from `src/data/cityData.ts`. Failing to mirror means
   the new page will not be prerendered.

**To enrich an existing city:**

- Locate the entry by its `slug` field, replace only that object literal,
  leave every other entry byte-identical.
- If you change any of `metaTitle`, `metaDescription`, `h1`, `subtitle`,
  `introParagraph`, `accordionContent`, `climateHook`, `featuredService`,
  `featuredServiceDesc`, `localAnchor1`, `localAnchor2`, or `faqs`, mirror
  the same change into the matching `CITY_CONTENT` entry inside
  `vite-plugin-prerender.ts` (look up by `slug`).

#### B) Prerender registration

This project's `prerender_registration.method` is `duplicated_inline_array` —
**not** `direct_import`. There is no separate slug-array file to maintain, but
the prerender plugin keeps its own copy of city content. Read
`prerender_registration.note` in `site-map.json` before any city edit.

#### C) Static page region operations

1. Look up the file in `editable_regions`.
2. Locate the `AI_START_<SUFFIX>` / `AI_END_<SUFFIX>` pair.
3. Replace **only** the content strictly between the two comment tags.
4. Respect `content_type` and `max_chars` from the region definition.
5. **Never** edit, rename, move, or remove the AI tags themselves.
6. Preserve any JSX wrapper structure noted in the region's `description`
   (e.g. an `<h1>` with a `<br>` and inner `<span>` must be kept intact).

#### D) New static page

1. Copy `new_page_config.template_path` to a new file under `src/pages/`.
2. Replace every `TEMPLATE_*` identifier with a unique page identifier.
3. Insert `<Route path="/<new-url>" element={<NewPage />} />` immediately above
   `{/* AI_ROUTE_ANCHOR */}` in `new_page_config.router_anchor_file`.
4. Add the new page to `static_pages` in `site-map.json`.
5. Add a matching entry to `routes.static` in `site-map.json`.
6. Add the page's editable regions to `editable_regions` in `site-map.json` so
   the validator covers them.

### Step 4 — Validate

Run `node scripts/validate-structure.js`.

- If it exits 0 → continue to Step 5.
- If it exits non-zero → **do not commit**. Restore every file you touched
  (use `git checkout -- <files>`), report the validator's exact error output
  verbatim, and stop. **Never** modify `scripts/validate-structure.js` to
  silence an error — fix the change instead.

### Step 5 — Commit to the agent branch

The branch name, repository, and remote are provided by the agent's own
workflow configuration — do **not** hardcode any of them in this repo. Commit
only after Step 4 passes. Use one semantic change per commit.

---

## Hard Rules (numbered, non-negotiable)

1. **Never** modify a file not listed in `site-map.json`
   (paths under `data_files`, `static_pages`, `editable_regions`,
   `new_page_config.router_anchor_file`, `prerender_registration.file`).
2. **Never** guess a file path, slug format, anchor name, field name, or
   route pattern — read `site-map.json`.
3. **Never** rewrite an entire file — find the anchor or tag pair and make
   only the surgical change.
4. **Never** delete, rename, or move an anchor comment (`// AI_CITY_ANCHOR`,
   `{/* AI_ROUTE_ANCHOR */}`) or any `AI_START_*` / `AI_END_*` JSX tag.
5. **Never** commit if `scripts/validate-structure.js` reports any error.
6. **One semantic change per commit.**
7. **Never** invent business claims — use only facts that appear in existing
   `cityData` entries or are provided at runtime via the agent payload.
8. **Never** construct a URL by guessing the route pattern — always derive it
   from `routes.dynamic` (or `routes.static`) in `site-map.json`.
9. **Never** copy `entry_template` description strings (e.g. `"string — e.g. ..."`)
   into a real data entry — always replace them with actual generated values.

---

## Quick Reference

| You need to … | Do this |
|---|---|
| Add a new city landing page | Insert object above `// AI_CITY_ANCHOR` in `src/data/cityData.ts`; add `<Route path="/mobile-detailing-<slug>" …>` above `{/* AI_ROUTE_ANCHOR */}` in `src/App.tsx`; mirror into `CITY_CONTENT` and `SERVICE_AREAS` in `vite-plugin-prerender.ts`. |
| Improve a city's SEO copy | Edit the object literal matching the `slug` in `src/data/cityData.ts`; mirror SEO-affecting fields into the same-slug entry of `CITY_CONTENT` in `vite-plugin-prerender.ts`. |
| Resolve the URL of a city `<slug>` | `https://drippysuds.com/mobile-detailing-<slug>` (derived from `routes.dynamic[/mobile-detailing-:slug]`). |
| Edit the homepage hero headline | Replace text between `{/* AI_START_HERO_HEADLINE */}` and `{/* AI_END_HERO_HEADLINE */}` in `src/components/home/HeroSection.tsx`. Keep `<h1>`, `<br>`, and inner `<span class="text-primary">` intact. |
| Edit the About story copy | Replace text between `{/* AI_START_ABOUT_BODY */}` and `{/* AI_END_ABOUT_BODY */}` in `src/components/home/AboutSection.tsx`. Keep the wrapping `<div class="space-y-4 …">` and three `<p>` structure. |
| Add a new static route | Add `<Route …>` above `{/* AI_ROUTE_ANCHOR */}` in `src/App.tsx`, then update `static_pages`, `routes.static`, and (if applicable) `editable_regions` in `site-map.json`. |
| Add a service or blog page | Forbidden — `capabilities.service_pages` and `capabilities.blog_posts` are both `false`. Service and blog pages are sourced from Supabase tables at runtime, not from data files. |
| Validate before commit | `node scripts/validate-structure.js` (must exit 0). |
