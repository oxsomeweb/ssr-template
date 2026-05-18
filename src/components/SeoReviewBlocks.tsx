import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  pagePath: string;
}

export function SeoReviewBlocks({ pagePath }: Props) {
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const { data } = await supabase
        .from("seo_review_blocks")
        .select("*")
        .eq("applied", false);

      if (data) {
        const matching = data.filter((b: any) => {
          if (b.page_path === pagePath) return true;
          if (b.page_path.endsWith("/*")) {
            return pagePath.startsWith(b.page_path.replace("/*", ""));
          }
          return false;
        });
        setBlocks(matching);
      }
    };
    fetchBlocks();
  }, [pagePath]);

  if (blocks.length === 0) return null;

  return (
    <aside className="mt-8 space-y-4">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="p-6 rounded-lg border border-border bg-card shadow-sm"
        >
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: block.review_html }}
          />
          {block.author_schema_json && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(block.author_schema_json) }}
            />
          )}
        </div>
      ))}
    </aside>
  );
}
