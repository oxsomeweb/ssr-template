import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data, error } = await sb
      .from("seo_llmstxt_entries")
      .select("entry")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const text = (data || []).map((r: any) => r.entry).join("\n\n");

    return new Response(text || "# Drippy Suds\n> Professional mobile auto detailing in Sacramento, CA\n\nhttps://drippysuds.com", {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500, headers: corsHeaders });
  }
});
