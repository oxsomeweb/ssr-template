import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContentOverride {
  id: string;
  target_section: string;
  new_content: string;
  reason: string | null;
  action_subtype: string;
}

export function useContentOverrides(pagePath: string) {
  const [overrides, setOverrides] = useState<Record<string, ContentOverride>>({});
  const [allOverrides, setAllOverrides] = useState<ContentOverride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pagePath) return;

    const fetchOverrides = async () => {
      const { data, error } = await supabase
        .from("seo_content_updates")
        .select("*")
        .eq("page_path", pagePath)
        .eq("applied", false)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const keyed: Record<string, ContentOverride> = {};
        for (const row of data) {
          if (row.target_section && !keyed[row.target_section]) {
            keyed[row.target_section] = row as ContentOverride;
          }
        }
        setOverrides(keyed);
        setAllOverrides(data as ContentOverride[]);
      }
      setLoading(false);
    };

    fetchOverrides();
  }, [pagePath]);

  const markApplied = async (ids: string[]) => {
    await supabase
      .from("seo_content_updates")
      .update({ applied: true })
      .in("id", ids);
  };

  return { overrides, allOverrides, loading, markApplied };
}
