import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface InjectedLink {
  id: string;
  anchor_text: string;
  href: string;
  insert_after_paragraph: number | null;
}

interface Props {
  pagePath: string;
  heading?: string;
}

export function SeoInjectedLinks({ pagePath, heading = "Related Services" }: Props) {
  const [links, setLinks] = useState<InjectedLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from("seo_injected_links")
        .select("*")
        .eq("page_path", pagePath)
        .eq("applied", false);
      if (data) setLinks(data as InjectedLink[]);
    };
    fetchLinks();
  }, [pagePath]);

  if (links.length === 0) return null;

  return (
    <nav className="mt-8 pt-6 border-t border-border" aria-label="Related pages">
      <h3 className="text-lg font-semibold mb-3 text-foreground">{heading}</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              to={link.href}
              className="block p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-primary hover:underline"
            >
              {link.anchor_text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
