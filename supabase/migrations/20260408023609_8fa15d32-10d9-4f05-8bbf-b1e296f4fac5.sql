
-- 1. Log table for all received commands
CREATE TABLE IF NOT EXISTS public.agent_received_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  target_page text,
  payload jsonb DEFAULT '{}'::jsonb,
  result jsonb DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'received'
);
ALTER TABLE public.agent_received_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on agent_received_log" ON public.agent_received_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on agent_received_log" ON public.agent_received_log FOR SELECT USING (true);

-- 2. Page meta overrides
CREATE TABLE IF NOT EXISTS public.seo_page_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  title text,
  meta_description text,
  og_title text,
  og_description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_page_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_page_meta" ON public.seo_page_meta FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_page_meta" ON public.seo_page_meta FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_page_meta" ON public.seo_page_meta FOR UPDATE USING (true) WITH CHECK (true);

-- 3. JSON-LD schema markup storage
CREATE TABLE IF NOT EXISTS public.seo_schemas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL DEFAULT '/',
  schema_type text NOT NULL,
  schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(page_path, schema_type)
);
ALTER TABLE public.seo_schemas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_schemas" ON public.seo_schemas FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_schemas" ON public.seo_schemas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_schemas" ON public.seo_schemas FOR UPDATE USING (true) WITH CHECK (true);

-- 4. Internal link injection queue
CREATE TABLE IF NOT EXISTS public.seo_injected_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  anchor_text text NOT NULL,
  href text NOT NULL,
  insert_after_paragraph int,
  applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_injected_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_injected_links" ON public.seo_injected_links FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_injected_links" ON public.seo_injected_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_injected_links" ON public.seo_injected_links FOR UPDATE USING (true) WITH CHECK (true);

-- 5. Content update queue
CREATE TABLE IF NOT EXISTS public.seo_content_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  action_subtype text NOT NULL DEFAULT 'rewrite_section',
  target_section text,
  new_content text NOT NULL,
  reason text,
  applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_content_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_content_updates" ON public.seo_content_updates FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_content_updates" ON public.seo_content_updates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_content_updates" ON public.seo_content_updates FOR UPDATE USING (true) WITH CHECK (true);

-- 6. Blog posts from remote
CREATE TABLE IF NOT EXISTS public.seo_blog_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  meta_description text,
  featured_image_url text,
  tags text[] DEFAULT '{}',
  keywords text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_blog_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_blog_drafts" ON public.seo_blog_drafts FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_blog_drafts" ON public.seo_blog_drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_blog_drafts" ON public.seo_blog_drafts FOR UPDATE USING (true) WITH CHECK (true);

-- 7. Expert review blocks
CREATE TABLE IF NOT EXISTS public.seo_review_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  review_html text NOT NULL,
  author_schema_json jsonb,
  applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_review_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_review_blocks" ON public.seo_review_blocks FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_review_blocks" ON public.seo_review_blocks FOR INSERT WITH CHECK (true);

-- 8. LLMs.txt entries
CREATE TABLE IF NOT EXISTS public.seo_llmstxt_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL UNIQUE,
  entry text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_llmstxt_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_llmstxt_entries" ON public.seo_llmstxt_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_llmstxt_entries" ON public.seo_llmstxt_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_llmstxt_entries" ON public.seo_llmstxt_entries FOR UPDATE USING (true) WITH CHECK (true);

-- 9. Off-page SEO activity log
CREATE TABLE IF NOT EXISTS public.seo_offpage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'other',
  platform text,
  url text,
  notes text,
  source text NOT NULL DEFAULT 'agent',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_offpage_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_offpage_log" ON public.seo_offpage_log FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_offpage_log" ON public.seo_offpage_log FOR INSERT WITH CHECK (true);

-- 10. City pages
CREATE TABLE IF NOT EXISTS public.seo_city_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  title_tag text NOT NULL DEFAULT '',
  meta_description text DEFAULT '',
  h1 text DEFAULT '',
  intro_paragraph text DEFAULT '',
  body_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_text text DEFAULT '',
  local_schema jsonb,
  internal_link_suggestions jsonb DEFAULT '[]'::jsonb,
  city text DEFAULT '',
  city_slug text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_city_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_city_pages" ON public.seo_city_pages FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_city_pages" ON public.seo_city_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_city_pages" ON public.seo_city_pages FOR UPDATE USING (true) WITH CHECK (true);

-- 11. Service pages
CREATE TABLE IF NOT EXISTS public.seo_service_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  title_tag text NOT NULL DEFAULT '',
  meta_description text DEFAULT '',
  h1 text DEFAULT '',
  intro_paragraph text DEFAULT '',
  body_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_text text DEFAULT '',
  service_schema jsonb,
  internal_link_suggestions jsonb DEFAULT '[]'::jsonb,
  service text DEFAULT '',
  service_slug text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_service_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_service_pages" ON public.seo_service_pages FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_service_pages" ON public.seo_service_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_service_pages" ON public.seo_service_pages FOR UPDATE USING (true) WITH CHECK (true);

-- 12. Dynamic receiver config
CREATE TABLE IF NOT EXISTS public.seo_receiver_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL UNIQUE,
  handler_type text NOT NULL DEFAULT 'passthrough',
  target_table text NOT NULL DEFAULT 'seo_content_updates',
  field_mapping jsonb NOT NULL DEFAULT '{}'::jsonb,
  upsert_key text,
  meta_sync jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation jsonb NOT NULL DEFAULT '{}'::jsonb,
  version text NOT NULL DEFAULT '1.0.0',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_receiver_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_receiver_config" ON public.seo_receiver_config FOR SELECT USING (true);
CREATE POLICY "Allow public insert seo_receiver_config" ON public.seo_receiver_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update seo_receiver_config" ON public.seo_receiver_config FOR UPDATE USING (true) WITH CHECK (true);
