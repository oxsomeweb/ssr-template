import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CityPage {
  id: string;
  page_path: string;
  title_tag: string;
  meta_description: string;
  h1: string;
  intro_paragraph: string;
  body_sections: { heading: string; content: string }[];
  faq: { question: string; answer: string }[];
  cta_text: string;
  local_schema: any;
  city: string;
  city_slug: string;
  relatedLinks?: { href: string; text: string }[];
  status: string;
}

export function useCityPage(pagePath: string) {
  const [page, setPage] = useState<CityPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pagePath) return;
    const fetchPage = async () => {
      const { data } = await supabase
        .from("seo_city_pages")
        .select("*")
        .eq("page_path", pagePath)
        .maybeSingle();
      if (data) setPage(data as unknown as CityPage);
      setLoading(false);
    };
    fetchPage();
  }, [pagePath]);

  return { page, loading };
}
