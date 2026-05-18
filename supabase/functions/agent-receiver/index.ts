// ============================================================
// AGENT RECEIVER v2 - Hardened with Validation
// Deploy this to each client Lovable project
// ============================================================
// 1. Create: supabase/functions/agent-receiver/index.ts
// 2. Create: supabase/functions/_shared/receiver-validation.ts
//    (copy from the receiver-validation.ts template)
// 3. Add to config.toml:
//    [functions.agent-receiver]
//    verify_jwt = false
// 4. Set secrets:
//    AGENT_WEBHOOK_SECRET = (same value as agent_webhook_secret in hub site config)
// 5. Run the SQL migration from client-setup-guide.md to create all tables
// ============================================================

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  validateCommand,
  validateAction,
  sanitizePayload,
  checkSchemaDuplicate,
  checkReviewDuplicate,
  checkContentDuplicate,
  checkRateLimit,
} from "../_shared/receiver-validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-agent-signature",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifySignature(secret: string, payload: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  return expected === signature;
}

// ---- PATH NORMALIZATION ----

/** Strip full URLs to relative paths for consistent DB storage */
function normalizePath(url: string): string {
  if (!url) return "/";
  try {
    const parsed = new URL(url);
    return parsed.pathname || "/";
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

// ---- MODULAR HANDLERS ----

async function handleUpdateMeta(sb: any, targetPage: string, payload: any) {
  const { error } = await sb.from("seo_page_meta").upsert({
    page_path: targetPage,
    title: payload.title || null,
    meta_description: payload.meta_description || null,
    og_title: payload.og_title || null,
    og_description: payload.og_description || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_path" });
  if (error) throw error;
  return { success: true, action: "update_meta", target: targetPage, applied: payload };
}

async function handleInjectSchema(sb: any, targetPage: string, payload: any) {
  // Dedup: check if this schema type already exists — upsert handles it
  const { error } = await sb.from("seo_schemas").upsert({
    page_path: targetPage,
    schema_type: payload.schema_type,
    schema_json: payload.schema_json,
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_path,schema_type" });
  if (error) throw error;
  return { success: true, action: "inject_schema", schema_type: payload.schema_type };
}

async function handleAddLinks(sb: any, targetPage: string, payload: any) {
  const links = payload.links || [];
  const rows = links.map((link: any) => ({
    page_path: targetPage,
    anchor_text: link.anchor_text,
    href: link.href,
    insert_after_paragraph: link.insert_after_paragraph || null,
  }));
  if (rows.length > 0) {
    const { error } = await sb.from("seo_injected_links").insert(rows);
    if (error) throw error;
  }
  return { success: true, action: "add_links", target: targetPage, links_count: rows.length };
}

function parseContentSections(payload: any, targetPage: string): any[] {
  // Handle pre-parsed sections — filter out any that target a different page (cross-contamination guard)
  if (payload.sections) {
    return payload.sections.filter((s: any) => {
      if (!s.target_page) return true; // no target_page means it's for the current page
      const sectionPath = normalizePath(s.target_page);
      return sectionPath === targetPage;
    });
  }

  // Handle raw differential_copy from Content Similarity agent
  if (payload.differential_copy) {
    const diffCopy = payload.differential_copy as string;
    const page = payload.page || "A";
    const pageMarker = `PAGE_${page}_CHANGES:`;
    const otherMarker = `PAGE_${page === "A" ? "B" : "A"}_CHANGES:`;
    const strategyMarker = "UNIQUENESS_STRATEGY:";

    let block = diffCopy;
    const idx = diffCopy.indexOf(pageMarker);
    if (idx !== -1) {
      const endIdx = diffCopy.indexOf(otherMarker, idx);
      const stratIdx = diffCopy.indexOf(strategyMarker, idx);
      const end = endIdx !== -1 ? endIdx : (stratIdx !== -1 ? stratIdx : diffCopy.length);
      block = diffCopy.substring(idx + pageMarker.length, end);
    }

    const sectionMatches = [...block.matchAll(/- SECTION:\s*(.+)/gi)];
    const replaceMatches = [...block.matchAll(/- REPLACE_WITH:\s*([\s\S]*?)(?=\n- (?:REASON|SECTION)|$)/gi)];
    const reasonMatches = [...block.matchAll(/- REASON:\s*(.+)/gi)];

    const sections = [];
    for (let i = 0; i < sectionMatches.length; i++) {
      sections.push({
        action_subtype: "content_differentiation",
        target_section: sectionMatches[i][1].trim(),
        new_content: (replaceMatches[i]?.[1] || "").trim(),
        reason: `${(reasonMatches[i]?.[1] || "").trim()} [${payload.similarity_pct}% similar to ${payload.similar_to}]`,
      });
    }

    if (sections.length > 0) return sections;

    // Fallback: single full-page section
    return [{
      action_subtype: "content_differentiation",
      target_section: "full_page",
      new_content: block.trim(),
      reason: `Content ${payload.similarity_pct}% similar to ${payload.similar_to}`,
    }];
  }

  // Default single section
  return [{
    action_subtype: payload.action_type || "rewrite_section",
    target_section: payload.target_section || null,
    new_content: payload.new_content || payload.full_content || "",
    reason: payload.reason || null,
  }];
}

async function handleUpdateContent(sb: any, targetPage: string, payload: any) {
  const sections = parseContentSections(payload, targetPage);
  const rows = sections.map((a: any) => ({
    page_path: targetPage,
    action_subtype: a.action_subtype || a.selector || "rewrite_section",
    target_section: a.target_section || a.selector || null,
    new_content: a.new_content || "",
    reason: a.reason || null,
  }));

  // Dedup: remove rows that target the same section as existing unapplied updates
  const dedupedRows = [];
  for (const row of rows) {
    if (row.target_section) {
      const { isDuplicate, existingCount } = await checkContentDuplicate(sb, targetPage, row.target_section);
      if (isDuplicate) {
        // Update existing instead of stacking
        await sb.from("seo_content_updates")
          .update({ new_content: row.new_content, reason: row.reason })
          .eq("page_path", targetPage)
          .eq("target_section", row.target_section)
          .eq("applied", false);
        continue;
      }
    }
    dedupedRows.push(row);
  }

  if (dedupedRows.length > 0) {
    const { error } = await sb.from("seo_content_updates").insert(dedupedRows);
    if (error) throw error;
  }

  return {
    success: true, action: "update_content", target: targetPage,
    sections_inserted: dedupedRows.length,
    sections_updated: rows.length - dedupedRows.length,
  };
}

async function handleContentDifferentiation(sb: any, targetPage: string, payload: any) {
  return handleUpdateContent(sb, targetPage, payload);
}

async function handlePushBlog(sb: any, payload: any) {
  const meta = payload.meta || {};
  const { error } = await sb.from("seo_blog_drafts").upsert({
    title: payload.title,
    slug: payload.slug,
    content: payload.content || "",
    meta_description: meta.meta_description || payload.meta_description || null,
    meta_title: meta.meta_title || payload.title || null,
    canonical_url: meta.canonical || null,
    og_title: meta.og_title || payload.title || null,
    og_description: meta.og_description || payload.meta_description || null,
    og_image: meta.og_image || payload.featured_image_url || null,
    featured_image_url: payload.featured_image_url || null,
    tags: payload.tags || [],
    keywords: payload.keywords || [],
    status: payload.status || "draft",
    published_at: payload.published_at || null,
    city_slug: payload.city_slug || null,
    service_slug: payload.service_slug || null,
  }, { onConflict: "slug" });
  if (error) throw error;
  return { success: true, action: "push_blog", slug: payload.slug, meta_included: !!payload.meta };
}

async function handleAppendReview(sb: any, targetPage: string, payload: any) {
  // Dedup: check existing review blocks for this page
  const { isDuplicate, existingCount } = await checkReviewDuplicate(sb, targetPage);
  if (existingCount >= 3) {
    return {
      success: false, action: "append_review", target: targetPage,
      error: `Already ${existingCount} unapplied review blocks for this page — skipping to prevent stacking`,
    };
  }

  const { error } = await sb.from("seo_review_blocks").insert({
    page_path: targetPage,
    review_html: payload.review_html || "",
    author_schema_json: payload.author_schema_json || null,
  });
  if (error) throw error;
  return { success: true, action: "append_review", target: targetPage };
}

async function handlePushLlmstxt(sb: any, payload: any) {
  const { error } = await sb.from("seo_llmstxt_entries").upsert({
    page_url: payload.page_url,
    entry: payload.entry,
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_url" });
  if (error) throw error;
  return { success: true, action: "push_llmstxt", page_url: payload.page_url };
}

async function handleUpdateRobots(sb: any, payload: any) {
  const content = payload.robots_txt_content || "";
  // Use upsert to replace existing robots.txt instead of stacking entries
  const { error } = await sb.from("seo_content_updates").upsert({
    page_path: "/robots.txt",
    action_subtype: "robots_txt",
    target_section: "full_file",
    new_content: content,
    reason: "Agent-generated robots.txt update",
    applied: false,
  }, { onConflict: "page_path,target_section" });
  if (error) {
    // Fallback: if upsert fails (no unique constraint), update existing or insert
    const { data: existing } = await sb.from("seo_content_updates")
      .select("id")
      .eq("page_path", "/robots.txt")
      .eq("action_subtype", "robots_txt")
      .eq("applied", false)
      .limit(1);
    if (existing && existing.length > 0) {
      await sb.from("seo_content_updates")
        .update({ new_content: content, reason: "Agent-generated robots.txt update" })
        .eq("id", existing[0].id);
    } else {
      await sb.from("seo_content_updates").insert({
        page_path: "/robots.txt",
        action_subtype: "robots_txt",
        target_section: "full_file",
        new_content: content,
        reason: "Agent-generated robots.txt update",
      });
    }
  }
  return { success: true, action: "update_robots", content_length: content.length };
}

async function handleGbpPost(sb: any, payload: any) {
  const { error } = await sb.from("seo_content_updates").insert({
    page_path: "/gbp",
    action_subtype: `gbp_${payload.post_type || "update"}`,
    target_section: payload.title || "GBP Post",
    new_content: payload.body || "",
    reason: `CTA: ${payload.cta_type} → ${payload.cta_url}. Keywords: ${(payload.target_keywords || []).join(", ")}. Image: ${payload.image_description || "none"}`,
  });
  if (error) throw error;
  return { success: true, action: "gbp_post", title: payload.title };
}

async function handleOffpageAction(sb: any, actionType: string, targetPage: string, payload: any) {
  const typeMap: Record<string, { type: string; notesPrefix: string }> = {
    social_bookmark: { type: "social_bookmark", notesPrefix: "" },
    classified_submission: { type: "classified", notesPrefix: "Classified: " },
    image_submission: { type: "image_submission", notesPrefix: "" },
    blog_promotion: { type: "blog_syndication", notesPrefix: "" },
  };

  const config = typeMap[actionType];
  if (!config) {
    return { success: false, error: `Unknown offpage action: ${actionType}` };
  }

  let notes = `[${payload.platform}] ${payload.title || ""}`;
  if (payload.description) notes += `\n${payload.description}`;
  if (payload.body) notes += `\n${payload.body}`;
  if (payload.board_or_album) notes += `\nBoard: ${payload.board_or_album}`;

  const { error } = await sb.from("seo_offpage_log").insert({
    type: config.type,
    platform: payload.platform || "unknown",
    url: payload.target_url || payload.blog_url || payload.link_url || targetPage,
    notes,
    source: "agent",
    status: "pending",
  });
  if (error) throw error;
  return { success: true, action: actionType, platform: payload.platform };
}

async function handleMicroBlog(sb: any, targetPage: string, payload: any) {
  const { error } = await sb.from("seo_content_updates").insert({
    page_path: payload.canonical_url || targetPage,
    action_subtype: `micro_blog_${payload.platform?.toLowerCase() || "unknown"}`,
    target_section: payload.title || "Micro-blog",
    new_content: payload.excerpt_body || "",
    reason: `Syndicate to ${payload.platform}. Tags: ${(payload.tags || []).join(", ")}`,
  });
  if (error) throw error;
  return { success: true, action: "micro_blog", platform: payload.platform };
}

async function handleCreatePage(sb: any, targetPage: string, payload: any) {
  const { error } = await sb.from("seo_city_pages").upsert({
    page_path: targetPage,
    title_tag: payload.title_tag || payload.title || "",
    meta_description: payload.meta_description || "",
    h1: payload.h1 || "",
    intro_paragraph: payload.intro_paragraph || "",
    body_sections: payload.body_sections || [],
    faq: payload.faq || [],
    cta_text: payload.cta_text || "",
    local_schema: payload.local_schema || null,
    internal_link_suggestions: payload.internal_link_suggestions || [],
    city: payload.city || "",
    city_slug: payload.city_slug || "",
    service: payload.service || "",
    service_slug: payload.service_slug || "",
    status: "draft",
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_path" });
  if (error) throw error;

  // Auto-sync: meta, schemas, links
  await sb.from("seo_page_meta").upsert({
    page_path: targetPage,
    title: payload.title_tag || "",
    meta_description: payload.meta_description || "",
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_path" });

  if (payload.local_schema) {
    await sb.from("seo_schemas").upsert({
      page_path: targetPage,
      schema_type: payload.local_schema["@type"] || "LocalBusiness",
      schema_json: payload.local_schema,
      updated_at: new Date().toISOString(),
    }, { onConflict: "page_path,schema_type" });
  }

  if (payload.faq && payload.faq.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: payload.faq.map((f: any) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
    await sb.from("seo_schemas").upsert({
      page_path: targetPage,
      schema_type: "FAQPage",
      schema_json: faqSchema,
      updated_at: new Date().toISOString(),
    }, { onConflict: "page_path,schema_type" });
  }

  if (payload.internal_link_suggestions?.length > 0) {
    const linkRows = payload.internal_link_suggestions.map((link: any) => ({
      page_path: targetPage,
      anchor_text: link.anchor_text || link.text || "",
      href: link.href || link.url || "",
    }));
    await sb.from("seo_injected_links").insert(linkRows);
  }

  return {
    success: true, applied: true, action: "create_page",
    target: targetPage, city: payload.city, service: payload.service,
  };
}

// ---- NEW AGENT HANDLERS ----

async function handleCannibalizationFix(sb: any, targetPage: string, payload: any) {
  const fixType = payload.fix_type || "canonical";

  if (fixType === "redirect" && payload.redirect_to) {
    await sb.from("seo_content_updates").insert({
      page_path: targetPage,
      action_subtype: "301_redirect",
      target_section: "full_page",
      new_content: payload.redirect_to,
      reason: `Cannibalization fix: redirect to ${payload.redirect_to}. Competing query: "${payload.competing_query || ""}"`,
    });
  } else if (fixType === "canonical") {
    await sb.from("seo_page_meta").upsert({
      page_path: targetPage,
      canonical_url: payload.canonical_url || payload.winner_url || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "page_path" });
  } else if (fixType === "content_differentiation") {
    return handleUpdateContent(sb, targetPage, payload);
  }

  return { success: true, action: "cannibalization_fix", fix_type: fixType, target: targetPage };
}

async function handleContentRefresh(sb: any, targetPage: string, payload: any) {
  const sections = payload.sections || [{
    action_subtype: "content_refresh",
    target_section: payload.target_section || "full_page",
    new_content: payload.new_content || payload.refreshed_content || "",
    reason: payload.reason || "Content decay detected — refreshing outdated content",
  }];

  const rows = sections.map((s: any) => ({
    page_path: targetPage,
    action_subtype: s.action_subtype || "content_refresh",
    target_section: s.target_section || "full_page",
    new_content: s.new_content || "",
    reason: s.reason || "Content refresh",
  }));

  if (rows.length > 0) {
    const { error } = await sb.from("seo_content_updates").insert(rows);
    if (error) throw error;
  }

  if (payload.title || payload.meta_description) {
    await sb.from("seo_page_meta").upsert({
      page_path: targetPage,
      title: payload.title || null,
      meta_description: payload.meta_description || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "page_path" });
  }

  return { success: true, action: "content_refresh", target: targetPage, sections_count: rows.length };
}

async function handleAddFaq(sb: any, targetPage: string, payload: any) {
  const faqs = payload.faqs || payload.faq || [];
  if (faqs.length === 0) {
    return { success: false, action: "add_faq", error: "No FAQ items provided" };
  }

  // Store as structured JSON — the client frontend is responsible for rendering
  // FAQs using the site's own design system (accordions, details, cards, etc.)
  const faqJson = JSON.stringify(faqs);

  await sb.from("seo_content_updates").insert({
    page_path: targetPage,
    action_subtype: "add_faq",
    target_section: payload.insert_after || "bottom",
    new_content: faqJson,
    reason: payload.reason || `Adding ${faqs.length} FAQ items for SERP feature targeting`,
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f: any) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  await sb.from("seo_schemas").upsert({
    page_path: targetPage,
    schema_type: "FAQPage",
    schema_json: faqSchema,
    updated_at: new Date().toISOString(),
  }, { onConflict: "page_path,schema_type" });

  return { success: true, action: "add_faq", target: targetPage, faq_count: faqs.length };
}

async function handleContentBrief(sb: any, targetPage: string, payload: any) {
  const { error } = await sb.from("seo_content_updates").insert({
    page_path: targetPage,
    action_subtype: "content_brief",
    target_section: "new_page",
    new_content: JSON.stringify({
      title: payload.title || "",
      target_keyword: payload.target_keyword || "",
      outline: payload.outline || [],
      word_count_target: payload.word_count_target || 1500,
      intent: payload.intent || "",
      cluster: payload.cluster || "",
    }),
    reason: payload.reason || `Topical authority gap — new content needed for "${payload.target_keyword || ""}"`,
  });
  if (error) throw error;
  return { success: true, action: "content_brief", target: targetPage, keyword: payload.target_keyword };
}

// ---- DYNAMIC CONFIG HANDLERS ----

/** System handler: update_receiver_config — upserts handler configs into local DB */
async function handleUpdateReceiverConfig(sb: any, payload: any) {
  const configs = payload.configs || [];
  if (!Array.isArray(configs) || configs.length === 0) {
    return { success: false, action: "update_receiver_config", error: "No configs provided" };
  }

  let upserted = 0;
  let errors: string[] = [];

  for (const cfg of configs) {
    if (!cfg.action_type) {
      errors.push("Config missing action_type — skipped");
      continue;
    }

    const { error } = await sb.from("seo_receiver_config").upsert({
      action_type: cfg.action_type,
      handler_type: cfg.handler_type || "passthrough",
      target_table: cfg.target_table || "seo_content_updates",
      field_mapping: cfg.field_mapping || {},
      upsert_key: cfg.upsert_key || null,
      meta_sync: cfg.meta_sync || {},
      validation: cfg.validation || {},
      version: cfg.version || "1.0.0",
      enabled: cfg.enabled !== false,
      updated_at: new Date().toISOString(),
    }, { onConflict: "action_type" });

    if (error) {
      errors.push(`${cfg.action_type}: ${error.message}`);
    } else {
      upserted++;
    }
  }

  return {
    success: errors.length === 0,
    action: "update_receiver_config",
    upserted,
    errors: errors.length > 0 ? errors : undefined,
    pushed_at: payload.pushed_at,
  };
}

/** Inject Article handler — stores article content for frontend rendering.
 *  Articles use <details>/<summary> for expand/collapse and bare semantic HTML
 *  so the client site's existing CSS handles all styling. */
async function handleInjectArticle(sb: any, targetPage: string, payload: any) {
  const content = payload.article_html || payload.content || "";
  if (content.trim().length < 100) {
    return { success: false, action: "inject_article", error: "Article content too short" };
  }

  // Ensure the article has a <details> wrapper — if the writer forgot, wrap it
  let finalContent = content;
  if (!finalContent.includes("<details")) {
    const h2Match = finalContent.match(/<h2[^>]*>.*?<\/h2>/is);
    if (h2Match) {
      const h2 = h2Match[0];
      const body = finalContent.replace(h2, "").trim();
      finalContent = `${h2}\n<details>\n  <summary>Read more</summary>\n  ${body}\n</details>`;
    }
  }

  // Clear any existing unapplied article for this page (replace, don't stack)
  await sb.from("seo_content_updates")
    .delete()
    .eq("page_path", targetPage)
    .eq("action_subtype", "inject_article")
    .eq("applied", false);

  const { error } = await sb.from("seo_content_updates").insert({
    page_path: targetPage,
    action_subtype: "inject_article",
    target_section: payload.insert_after || "bottom",
    new_content: finalContent,
    reason: payload.reason || `Article Booster: targeting "${payload.target_keyword || "unknown"}" (vol: ${payload.search_volume || "?"})`,
  });
  if (error) throw error;

  // If article includes meta suggestions, sync them
  if (payload.suggested_title || payload.suggested_meta) {
    await sb.from("seo_page_meta").upsert({
      page_path: targetPage,
      title: payload.suggested_title || null,
      meta_description: payload.suggested_meta || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "page_path" });
  }

  return {
    success: true,
    applied: true,
    action: "inject_article",
    target: targetPage,
    content_length: content.length,
    keyword: payload.target_keyword,
  };
}

/** Generic dynamic handler — reads config from seo_receiver_config and processes accordingly */
async function handleDynamic(sb: any, actionType: string, targetPage: string, payload: any) {
  const { data: config } = await sb
    .from("seo_receiver_config")
    .select("*")
    .eq("action_type", actionType)
    .eq("enabled", true)
    .maybeSingle();

  if (!config) {
    return { success: false, error: `No dynamic config found for action_type: ${actionType}` };
  }

  const mapping = config.field_mapping || {};
  const validation = config.validation || {};

  // Basic validation from config
  if (validation.required_fields) {
    for (const field of validation.required_fields) {
      if (!payload[field]) {
        return { success: false, error: `Missing required field: ${field}`, action: actionType };
      }
    }
  }

  if (validation.min_content_length) {
    const content = payload.content || payload.article_html || payload.new_content || "";
    if (content.length < validation.min_content_length) {
      return { success: false, error: `Content too short (min ${validation.min_content_length})`, action: actionType };
    }
  }

  // Resolve field mapping — simple template interpolation
  const resolvedRow: Record<string, any> = {};
  for (const [dbCol, template] of Object.entries(mapping)) {
    resolvedRow[dbCol] = resolveTemplate(template as string, targetPage, payload);
  }

  const targetTable = config.target_table || "seo_content_updates";

  try {
    if (config.handler_type === "upsert" && config.upsert_key) {
      const { error } = await sb.from(targetTable).upsert(resolvedRow, { onConflict: config.upsert_key });
      if (error) throw error;
    } else {
      const { error } = await sb.from(targetTable).insert(resolvedRow);
      if (error) throw error;
    }

    // Optional meta sync
    if (config.meta_sync?.enabled && (payload.title || payload.meta_description)) {
      await sb.from("seo_page_meta").upsert({
        page_path: targetPage,
        title: payload.title || null,
        meta_description: payload.meta_description || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "page_path" });
    }

    return { success: true, action: actionType, target: targetPage, handler: "dynamic", table: targetTable };
  } catch (err: any) {
    return { success: false, action: actionType, error: err.message, handler: "dynamic" };
  }
}

/** Simple template resolver: {{target_page}}, {{payload.field}}, {{payload.field || 'default'}} */
function resolveTemplate(template: string, targetPage: string, payload: any): string {
  if (!template || typeof template !== "string") return template;

  return template.replace(/\{\{(.+?)\}\}/g, (_match, expr) => {
    const trimmed = expr.trim();

    if (trimmed === "target_page") return targetPage;

    // Handle payload.field || 'default'
    const orMatch = trimmed.match(/^payload\.(.+?)\s*\|\|\s*['"](.+?)['"]$/);
    if (orMatch) {
      const val = payload[orMatch[1]];
      return val !== undefined && val !== null && val !== "" ? String(val) : orMatch[2];
    }

    // Handle payload.field
    const fieldMatch = trimmed.match(/^payload\.(.+)$/);
    if (fieldMatch) {
      const val = payload[fieldMatch[1]];
      return val !== undefined && val !== null ? String(val) : "";
    }

    return template;
  });
}

// ---- SERVE ROBOTS.TXT (Issue 4 fix) ----
// GET /agent-receiver?serve=robots.txt — serves the latest agent-optimized robots.txt
// Client sites should proxy /robots.txt to this endpoint, or use a Vite plugin
// to fetch and write it during build.
async function serveRobotsTxt(sb: any): Promise<Response> {
  const { data } = await sb.from("seo_content_updates")
    .select("new_content")
    .eq("page_path", "/robots.txt")
    .eq("action_subtype", "robots_txt")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data?.new_content) {
    return new Response(data.new_content, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  }

  // Fallback: return a sensible default
  return new Response("User-agent: *\nAllow: /\n", {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

// ---- MAIN HANDLER ----

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // ── GET requests: serve dynamic content (robots.txt, llms.txt) ──
  if (req.method === "GET") {
    const url = new URL(req.url);
    const serve = url.searchParams.get("serve");
    if (serve === "robots.txt") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, serviceKey);
      return serveRobotsTxt(sb);
    }
    return json({ error: "Unknown serve parameter" }, 400);
  }

  try {
    const secret = Deno.env.get("AGENT_WEBHOOK_SECRET");
    const bodyText = await req.text();

    // Verify HMAC signature
    if (secret) {
      const signature = req.headers.get("X-Agent-Signature") || "";
      const valid = await verifySignature(secret, bodyText, signature);
      if (!valid) return json({ error: "Invalid signature" }, 401);
    }

    const rawCommand = JSON.parse(bodyText);

    // ---- STEP 1: Validate command structure ----
    const cmdValidation = validateCommand(rawCommand);
    if (!cmdValidation.valid) {
      return json({
        error: "Invalid command structure",
        validation_errors: cmdValidation.errors,
        validation_warnings: cmdValidation.warnings,
      }, 400);
    }

    const command = cmdValidation.sanitized;
    const { action_type, target_page, payload } = command;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // ---- STEP 2: Rate limiting (skip for system actions) ----
    if (action_type !== "update_receiver_config") {
      const { limited, count: rateCount } = await checkRateLimit(sb, action_type);
      if (limited) {
        return json({
          error: `Rate limited: ${rateCount} ${action_type} actions in the last 5 minutes`,
        }, 429);
      }
    }

    // ---- STEP 3: Action-specific validation ----
    const actionValidation = validateAction(action_type, payload);
    if (!actionValidation.valid) {
      await sb.from("agent_received_log").insert({
        action_type,
        target_page,
        payload,
        result: { rejected: true, errors: actionValidation.errors, warnings: actionValidation.warnings },
        status: "rejected",
      });

      return json({
        error: "Payload validation failed",
        validation_errors: actionValidation.errors,
        validation_warnings: actionValidation.warnings,
      }, 422);
    }

    const cleanPayload = actionValidation.sanitized;
    const targetPage = normalizePath(target_page || "/");

    // ---- STEP 4: Route to handler ----
    // Priority: hardcoded handler > built-in new handlers > dynamic config
    let result: any;

    switch (action_type) {
      // ── Hardcoded handlers (backward compatible) ──
      case "update_meta":
        result = await handleUpdateMeta(sb, targetPage, cleanPayload);
        break;
      case "inject_schema":
        result = await handleInjectSchema(sb, targetPage, cleanPayload);
        break;
      case "add_links":
        result = await handleAddLinks(sb, targetPage, cleanPayload);
        break;
      case "update_content":
        result = await handleUpdateContent(sb, targetPage, cleanPayload);
        break;
      case "content_differentiation":
        result = await handleContentDifferentiation(sb, targetPage, cleanPayload);
        break;
      case "push_blog":
        result = await handlePushBlog(sb, cleanPayload);
        break;
      case "append_review":
        result = await handleAppendReview(sb, targetPage, cleanPayload);
        break;
      case "push_llmstxt":
        result = await handlePushLlmstxt(sb, cleanPayload);
        break;
      case "update_robots":
        result = await handleUpdateRobots(sb, cleanPayload);
        break;
      case "gbp_post":
        result = await handleGbpPost(sb, cleanPayload);
        break;
      case "micro_blog":
        result = await handleMicroBlog(sb, targetPage, cleanPayload);
        break;
      case "create_page":
        result = await handleCreatePage(sb, targetPage, cleanPayload);
        break;
      case "cannibalization_fix":
        result = await handleCannibalizationFix(sb, targetPage, cleanPayload);
        break;
      case "content_refresh":
        result = await handleContentRefresh(sb, targetPage, cleanPayload);
        break;
      case "add_faq":
        result = await handleAddFaq(sb, targetPage, cleanPayload);
        break;
      case "content_brief":
        result = await handleContentBrief(sb, targetPage, cleanPayload);
        break;
      case "inject_links":
        result = await handleAddLinks(sb, targetPage, cleanPayload);
        break;
      case "social_bookmark":
      case "classified_submission":
      case "image_submission":
      case "blog_promotion":
        result = await handleOffpageAction(sb, action_type, targetPage, cleanPayload);
        break;

      // ── New built-in handlers ──
      case "update_receiver_config":
        result = await handleUpdateReceiverConfig(sb, cleanPayload);
        break;
      case "inject_article":
        result = await handleInjectArticle(sb, targetPage, cleanPayload);
        break;

      // ── Dynamic fallback: check seo_receiver_config for unknown action types ──
      default: {
        result = await handleDynamic(sb, action_type, targetPage, cleanPayload);
        if (!result.success && result.error?.includes("No dynamic config")) {
          return json({ error: `Unknown action_type: ${action_type}. No dynamic config found.` }, 400);
        }
        break;
      }
    }

    // Add warnings to result if any
    if (actionValidation.warnings.length > 0) {
      result.validation_warnings = actionValidation.warnings;
    }

    // Log the received command
    await sb.from("agent_received_log").insert({
      action_type,
      target_page: targetPage,
      payload: cleanPayload,
      result,
      status: result.success ? "success" : "failed",
    }).then(() => {});

    return json(result);
  } catch (err: any) {
    console.error("Agent receiver error:", err);
    return json({ error: err.message }, 500);
  }
});
