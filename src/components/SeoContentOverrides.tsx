import { useContentOverrides } from "@/hooks/useContentOverrides";
import { useEffect, useRef } from "react";

interface Props {
  pagePath: string;
}

function findTargetElement(sectionKey: string): Element | null {
  if (!sectionKey) return null;

  // 1. Try as a real CSS selector
  try {
    const el = document.querySelector(sectionKey);
    if (el) return el;
  } catch { /* not a valid selector */ }

  // 2. Try as a data-seo attribute
  try {
    const el = document.querySelector(`[data-seo="${sectionKey}"]`);
    if (el) return el;
  } catch { /* skip */ }

  // 3. Try to match slugified heading text
  const headingMatch = sectionKey.match(/^(h[1-6]|p|div|section|span)-(?:font-)?(.+)$/i);
  if (headingMatch) {
    const tag = headingMatch[1].toLowerCase();
    const slugText = headingMatch[2].replace(/-/g, " ").toLowerCase();
    const candidates = document.querySelectorAll(tag);
    for (const el of candidates) {
      const elText = (el.textContent || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
      if (elText.includes(slugText) || slugText.includes(elText.slice(0, 30))) {
        return el.closest("section") || el.closest("[class*='section']") || el.parentElement || el;
      }
    }
  }

  // 4. Try fuzzy
  const cleaned = sectionKey.replace(/[^\w\-\.#\s>:\[\]()="']/g, "").trim();
  if (cleaned && cleaned !== sectionKey) {
    try {
      const el = document.querySelector(cleaned);
      if (el) return el;
    } catch { /* skip */ }
  }

  return null;
}

export function SeoContentOverrides({ pagePath }: Props) {
  const { allOverrides, loading, markApplied } = useContentOverrides(pagePath);
  const appliedRef = useRef(false);

  useEffect(() => {
    if (loading || allOverrides.length === 0 || appliedRef.current) return;
    appliedRef.current = true;

    const appliedIds: string[] = [];
    const unmatchedKeys: string[] = [];

    for (const override of allOverrides) {
      const target = findTargetElement(override.target_section);

      if (target) {
        if (override.action_subtype === "add_faq") {
          try {
            const faqs = JSON.parse(override.new_content);
            const faqHtml = faqs.map((f: any) =>
              `<details class="border-b border-border py-3">
                <summary class="font-semibold cursor-pointer hover:text-primary">${f.question}</summary>
                <p class="mt-2 text-muted-foreground">${f.answer}</p>
              </details>`
            ).join("\n");
            target.innerHTML = faqHtml;
          } catch {
            target.innerHTML = override.new_content;
          }
        } else {
          let html = override.new_content
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
            .replace(/\n\n/g, '</p><p class="mt-3">')
            .replace(/^/, '<p class="mt-3">')
            .replace(/$/, '</p>');
          target.innerHTML = html;
        }
        target.setAttribute("data-seo-override", override.id);
        appliedIds.push(override.id);
      } else {
        unmatchedKeys.push(override.target_section || "(no key)");
      }
    }

    if (allOverrides.length > 0) {
      markApplied(allOverrides.map(o => o.id));
    }

    if (unmatchedKeys.length > 0) {
      console.warn(`[SEO] ${unmatchedKeys.length} overrides could not be matched:`, unmatchedKeys);
    }
    console.log(`[SEO] Applied ${appliedIds.length}/${allOverrides.length} overrides`);
  }, [allOverrides, loading]);

  return null;
}
