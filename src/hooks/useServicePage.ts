import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ServicePage {
  id: string;
  page_path: string;
  title_tag: string;
  meta_description: string;
  h1: string;
  intro_paragraph: string;
  body_sections: { heading: string; content: string }[];
  faq: { question: string; answer: string }[];
  cta_text: string;
  service_schema: any;
  service: string;
  service_slug: string;
  relatedLinks?: { href: string; text: string }[];
  status: string;
}

export function useServicePage(pagePath: string) {
  const [page, setPage] = useState<ServicePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pagePath) return;
    const fetchPage = async () => {
      const { data } = await supabase
        .from("seo_service_pages")
        .select("*")
        .eq("page_path", pagePath)
        .maybeSingle();
      if (data) setPage(data as unknown as ServicePage);
      setLoading(false);
    };
    fetchPage();
  }, [pagePath]);

  return { page, loading };
}
