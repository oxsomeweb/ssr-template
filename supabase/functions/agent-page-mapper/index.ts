const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get("AGENT_WEBHOOK_SECRET");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authHeader = req.headers.get("authorization") || req.headers.get("x-webhook-secret") || "";
    const token = authHeader.replace("Bearer ", "");

    const isAuthorized = (secret && token === secret) || (serviceRoleKey && token === serviceRoleKey);
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { site_id, pages } = body;

    if (!site_id || !Array.isArray(pages) || pages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing site_id or pages array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upsert pages into seo_page_map table
    const records = pages.map((p: any) => ({
      site_id,
      page_path: p.page_path,
      page_title: p.page_title || "",
      sections: JSON.stringify(p.sections || []),
      component_file: p.component_file || null,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("seo_page_map")
      .upsert(records, { onConflict: "site_id,page_path" });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, upserted: records.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
