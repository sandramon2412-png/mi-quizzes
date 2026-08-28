import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Plan capabilities (server-side copy of PlanLimits in app.js) ──
// The browser also gates these, but that check is trivially bypassed from the
// console, so the paid features are enforced here where the master key lives.
const PLAN_CAPS: Record<string, { ai: boolean; botLab: boolean }> = {
  free:    { ai: false, botLab: false },
  starter: { ai: false, botLab: true  },
  pro:     { ai: true,  botLab: true  },
  growth:  { ai: true,  botLab: true  },
  elite:   { ai: true,  botLab: true  },
};

// ── In-memory rate limiter: 15 requests per user per minute ──
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(userId);
  if (!entry || now > entry.reset) {
    rateMap.set(userId, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    // Verify the user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: { message: "No autorizado" } }), {
        status: 401,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: { message: "No autorizado" } }), {
        status: 401,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Rate limit check
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: { message: "Demasiadas solicitudes. Espera un momento e intenta de nuevo." } }),
        { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // ── Plan gate ────────────────────────────────────────────
    // `feature` says which paid capability the caller needs: "botLab" for the
    // Bot Lab chat, "ai" (default) for everything that generates content.
    const feature = body.feature === "botLab" ? "botLab" : "ai";
    delete body.feature; // Anthropic rejects unknown top-level fields

    // Read the plan with the caller's own token — the "profiles_select_own" RLS
    // policy allows exactly this, so no service-role key is needed here.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    // Couldn't read it: never charge the master key on an unverified plan, but
    // don't tell a paying customer to upgrade either — this is a transient fault.
    if (profileError) {
      console.error("claude-proxy: could not read plan for", user.id, profileError.message);
      return new Response(
        JSON.stringify({ error: { message: "No pudimos verificar tu plan. Intenta de nuevo en un momento." } }),
        { status: 503, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const plan = profile?.plan || "free";
    const caps = PLAN_CAPS[plan] || PLAN_CAPS.free;
    if (!caps[feature]) {
      return new Response(
        JSON.stringify({
          error: {
            code: "plan_required",
            plan,
            feature,
            message: feature === "botLab"
              ? "Bot Lab está disponible desde el plan Starter. Actualiza tu plan para usarlo."
              : "La creación con IA está disponible desde el plan Pro. Actualiza tu plan para usarla.",
          },
        }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Forward request to Anthropic
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "API key no configurada" } }), {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await anthropicRes.json();
    return new Response(JSON.stringify(data), {
      status: anthropicRes.status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
