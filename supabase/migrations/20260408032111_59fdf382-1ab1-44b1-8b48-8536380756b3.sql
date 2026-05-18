CREATE TABLE public.seo_page_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  page_path text NOT NULL,
  page_title text NOT NULL DEFAULT '',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  component_file text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(site_id, page_path)
);

ALTER TABLE public.seo_page_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read seo_page_map" ON public.seo_page_map FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert seo_page_map" ON public.seo_page_map FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update seo_page_map" ON public.seo_page_map FOR UPDATE TO public USING (true) WITH CHECK (true);