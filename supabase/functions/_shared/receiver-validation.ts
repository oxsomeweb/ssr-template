// ============================================================
// RECEIVER VALIDATION LIBRARY
// Deploy alongside agent-receiver on each client site
// File: supabase/functions/_shared/receiver-validation.ts
// ============================================================

// @ts-nocheck

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
  sanitized: any; // cleaned payload
}

// ---- STRING SANITIZATION ----

/** Fix double-encoded strings, strip null bytes, normalize whitespace */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return String(input ?? "");
  let s = input;

  // Fix double-encoded JSON strings (e.g. "\"hello\"" → "hello")
  if (s.startsWith('"') && s.endsWith('"')) {
    try { s = JSON.parse(s); } catch { /* keep as-is */ }
  }

  // Strip null bytes and control characters (except newline/tab)
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  // Normalize excessive whitespace
  s = s.replace(/[ \t]{3,}/g, "  ").replace(/\n{4,}/g, "\n\n\n");

  return s.trim();
}

/** Sanitize all string values in an object recursively */
export function sanitizePayload(obj: any): any {
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizePayload);
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = sanitizePayload(val);
    }
    return result;
  }
  return obj;
}

// ---- STRUCTURAL VALIDATORS ----

/** Validate the top-level command structure */
export function validateCommand(command: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!command || typeof command !== "object") {
    return { valid: false, errors: ["Payload is not a valid object"], warnings, sanitized: command };
  }

  if (!command.action_type || typeof command.action_type !== "string") {
    errors.push("Missing or invalid action_type");
  }

  if (command.action_type && command.action_type.length > 100) {
    errors.push("action_type exceeds 100 characters");
  }

  if (command.target_page && typeof command.target_page === "string") {
    if (command.target_page.length > 500) {
      errors.push("target_page exceeds 500 characters");
    }
    // Must start with / or be a special value
    if (!command.target_page.startsWith("/") && !["robots.txt"].some(s => command.target_page.includes(s))) {
      warnings.push(`target_page "${command.target_page}" doesn't start with /`);
    }
  }

  if (!command.payload || typeof command.payload !== "object") {
    errors.push("Missing or invalid payload object");
  }

  const sanitized = sanitizePayload(command);

  return { valid: errors.length === 0, errors, warnings, sanitized };
}

// ---- ACTION-SPECIFIC VALIDATORS ----

export function validateUpdateMeta(payload: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (payload.title && payload.title.length > 70) {
    warnings.push(`Title is ${payload.title.length} chars (recommended < 60)`);
  }
  if (payload.title && payload.title.length > 200) {
    errors.push("Title exceeds 200 character hard limit");
  }

  if (payload.meta_description && payload.meta_description.length > 200) {
    warnings.push(`Meta description is ${payload.meta_description.length} chars (recommended < 160)`);
  }
  if (payload.meta_description && payload.meta_description.length > 500) {
    errors.push("Meta description exceeds 500 character hard limit");
  }

  // Check for placeholder text
  const placeholders = ["{", "{{", "[INSERT", "PLACEHOLDER", "TODO", "FIXME"];
  for (const field of ["title", "meta_description", "og_title", "og_description"]) {
    if (payload[field]) {
      for (const ph of placeholders) {
        if (payload[field].toUpperCase().includes(ph)) {
          errors.push(`${field} contains placeholder text: "${ph}"`);
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings, sanitized: sanitizePayload(payload) };
}

export function validateInjectSchema(payload: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload.schema_type || typeof payload.schema_type !== "string") {
    errors.push("Missing schema_type");
  }

  // Auto-parse string-encoded JSON
  if (typeof payload.schema_json === "string") {
    try {
      payload.schema_json = JSON.parse(payload.schema_json);
    } catch {
      errors.push("schema_json is a string but not valid JSON");
    }
  }

  if (!payload.schema_json || typeof payload.schema_json !== "object") {
    errors.push("Missing or invalid schema_json");
  }

  // Validate JSON-LD structure
  if (payload.schema_json) {
    if (!payload.schema_json["@type"] && !payload.schema_json["@context"]) {
      warnings.push("schema_json missing @type and @context");
    }

    // Check for placeholder social URLs
    const jsonStr = JSON.stringify(payload.schema_json);
    const fakeSocials = ["facebook.com/yourpage", "twitter.com/yourhandle", "instagram.com/yourprofile", "example.com"];
    for (const fake of fakeSocials) {
      if (jsonStr.includes(fake)) {
        errors.push(`Schema contains placeholder social URL: ${fake}`);
      }
    }

    // Validate phone numbers aren't placeholders
    if (payload.schema_json.telephone) {
      const phone = payload.schema_json.telephone;
      if (phone.includes("555-") || phone === "(000) 000-0000" || phone === "123-456-7890") {
        errors.push(`Schema contains placeholder phone number: ${phone}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings, sanitized: sanitizePayload(payload) };
}

export function validateContent(payload: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const editorialLabels = [
    /^\s*(?:\*\*|__)?\s*citable facts\s*:?/i,
    /^\s*(?:\*\*|__)?\s*key takeaway\s*:?/i,
    /^\s*(?:\*\*|__)?\s*direct answer\s*:?/i,
    /^\s*(?:\*\*|__)?\s*summary\s*:?/i,
  ];

  const sections = payload.sections || [payload];
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const prefix = sections.length > 1 ? `Section[${i}]: ` : "";

    if (!section.new_content && !section.full_content) {
      errors.push(`${prefix}Missing new_content`);
      continue;
    }

    const content = section.new_content || section.full_content || "";

    for (const pattern of editorialLabels) {
      if (pattern.test(content)) {
        errors.push(`${prefix}Contains helper label text like \"Citable facts:\" instead of final website copy`);
        break;
      }
    }

    // Check for empty or near-empty content
    if (content.trim().length < 20) {
      errors.push(`${prefix}Content too short (${content.trim().length} chars)`);
    }

    // Check for AI slop markers
    const slopMarkers = [
      "In today's fast-paced world",
      "In conclusion,",
      "It's important to note that",
      "When it comes to",
      "At the end of the day",
      "Look no further",
      "Without further ado",
      "In the ever-evolving landscape",
    ];
    for (const slop of slopMarkers) {
      if (content.includes(slop)) {
        warnings.push(`${prefix}Contains AI slop phrase: "${slop}"`);
      }
    }

    // Check for raw markdown/HTML being double-encoded
    if (content.includes("&lt;") || content.includes("&gt;") || content.includes("&amp;amp;")) {
      warnings.push(`${prefix}Content appears to be double-encoded HTML`);
    }
  }

  return { valid: errors.length === 0, errors, warnings, sanitized: sanitizePayload(payload) };
}

export function validatePushBlog(payload: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload.title || payload.title.trim().length < 5) {
    errors.push("Blog title missing or too short");
  }

  if (!payload.slug || payload.slug.trim().length < 3) {
    errors.push("Blog slug missing or too short");
  }

  // Validate slug format
  if (payload.slug && !/^[a-z0-9-]+$/.test(payload.slug)) {
    warnings.push("Blog slug contains non-URL-safe characters");
  }

  if (!payload.content || payload.content.trim().length < 100) {
    errors.push("Blog content too short (< 100 chars)");
  }

  return { valid: errors.length === 0, errors, warnings, sanitized: sanitizePayload(payload) };
}

export function validateCreatePage(payload: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload.h1 || payload.h1.trim().length < 5) {
    errors.push("Page H1 missing or too short");
  }

  if (!payload.intro_paragraph || payload.intro_paragraph.trim().length < 20) {
    errors.push("Intro paragraph missing or too short");
  }

  if (!payload.body_sections || !Array.isArray(payload.body_sections) || payload.body_sections.length === 0) {
    errors.push("body_sections missing or empty");
  }

  // Validate FAQ structure
  if (payload.faq && Array.isArray(payload.faq)) {
    for (let i = 0; i < payload.faq.length; i++) {
      const faq = payload.faq[i];
      if (!faq.question || faq.question.trim().length < 5) {
        errors.push(`FAQ[${i}] question missing or too short`);
      }
      if (!faq.answer || faq.answer.trim().length < 10) {
        errors.push(`FAQ[${i}] answer missing or too short`);
      }
    }
  }

  // Check for cross-contamination (city name in wrong field)
  if (payload.city && payload.service) {
    if (payload.h1 && !payload.h1.toLowerCase().includes(payload.city.toLowerCase())) {
      warnings.push(`H1 doesn't mention the target city "${payload.city}"`);
    }
  }

  return { valid: errors.length === 0, errors, warnings, sanitized: sanitizePayload(payload) };
}

export function validateAppendReview(payload: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload.review_html || payload.review_html.trim().length < 20) {
    errors.push("review_html missing or too short");
  }

  // Check for XSS vectors in review HTML
  if (payload.review_html) {
    const dangerous = ["<script", "onerror=", "onload=", "javascript:", "eval("];
    for (const d of dangerous) {
      if (payload.review_html.toLowerCase().includes(d)) {
        errors.push(`review_html contains potentially dangerous content: "${d}"`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings, sanitized: sanitizePayload(payload) };
}

// ---- DEDUPLICATION HELPERS ----

/** Check if a schema already exists for this page+type, return existing ID if so */
export async function checkSchemaDuplicate(
  sb: any,
  pagePath: string,
  schemaType: string
): Promise<{ isDuplicate: boolean; existingId?: string }> {
  const { data } = await sb
    .from("seo_schemas")
    .select("id")
    .eq("page_path", pagePath)
    .eq("schema_type", schemaType)
    .maybeSingle();

  return { isDuplicate: !!data, existingId: data?.id };
}

/** Check if a review block already exists for this page path */
export async function checkReviewDuplicate(
  sb: any,
  pagePath: string
): Promise<{ isDuplicate: boolean; existingCount: number }> {
  const { data, count } = await sb
    .from("seo_review_blocks")
    .select("id", { count: "exact" })
    .eq("page_path", pagePath)
    .eq("applied", false);

  return { isDuplicate: (count || 0) > 0, existingCount: count || 0 };
}

/** Check if content updates already exist for this page+section (prevent stacking) */
export async function checkContentDuplicate(
  sb: any,
  pagePath: string,
  targetSection: string | null
): Promise<{ isDuplicate: boolean; existingCount: number }> {
  let query = sb
    .from("seo_content_updates")
    .select("id", { count: "exact" })
    .eq("page_path", pagePath)
    .eq("applied", false);

  if (targetSection) {
    query = query.eq("target_section", targetSection);
  }

  const { count } = await query;
  return { isDuplicate: (count || 0) > 0, existingCount: count || 0 };
}

// ---- RATE LIMITING ----

/** Check if too many actions have been received recently */
export async function checkRateLimit(
  sb: any,
  actionType: string,
  windowMinutes: number = 5,
  maxActions: number = 50
): Promise<{ limited: boolean; count: number }> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count } = await sb
    .from("agent_received_log")
    .select("id", { count: "exact" })
    .eq("action_type", actionType)
    .gte("received_at", since);

  return { limited: (count || 0) >= maxActions, count: count || 0 };
}

// ---- MASTER VALIDATOR ----

/** Run action-specific validation based on action_type */
export function validateAction(actionType: string, payload: any): ValidationResult {
  switch (actionType) {
    case "update_meta":
      return validateUpdateMeta(payload);
    case "inject_schema":
      return validateInjectSchema(payload);
    case "update_content":
    case "content_differentiation":
      return validateContent(payload);
    case "push_blog":
      return validatePushBlog(payload);
    case "create_page":
      return validateCreatePage(payload);
    case "append_review":
      return validateAppendReview(payload);
    // These are simpler actions with less risk — basic sanitization only
    case "push_llmstxt":
    case "update_robots":
    case "gbp_post":
    case "social_bookmark":
    case "classified_submission":
    case "micro_blog":
    case "image_submission":
    case "blog_promotion":
    case "add_links":
    case "cannibalization_fix":
    case "content_refresh":
    case "add_faq":
    case "content_brief":
    case "inject_links":
    case "inject_article":
    case "update_receiver_config":
      return { valid: true, errors: [], warnings: [], sanitized: sanitizePayload(payload) };
    default:
      // Dynamic actions: don't reject unknown types — let the receiver check seo_receiver_config
      return { valid: true, errors: [], warnings: [`Unknown action_type "${actionType}" — will attempt dynamic handler`], sanitized: sanitizePayload(payload) };
  }
}
