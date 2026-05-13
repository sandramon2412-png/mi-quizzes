// ============================================================
// Luminous Studio — Groq Proxy (plataforma)
// ============================================================
// Proxy autenticado para Groq usando la master key de la
// plataforma. Se usa para tareas simples de creación (ideas,
// mejorar pregunta, temas de color) mientras que las tareas
// complejas pasan por claude-proxy.
//
// Requiere: usuario autenticado (Auth header válido).
// Rate limit: 30 req/min por usuario.
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 30;
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
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
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

    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: { message: "Demasiadas solicitudes. Espera un momento." } }),
        { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Prefer the creator's own Groq key saved in their profile. This makes
    // Settings > "Probar conexión" validate the same key used by published apps.
    let apiKey = "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (serviceRoleKey) {
      const admin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        serviceRoleKey
      );
      const { data: profile } = await admin
        .from("profiles")
        .select("groq_api_key")
        .eq("id", user.id)
        .single();
      apiKey = profile?.groq_api_key || "";
    }

    // Fallback for platform-owned generation if the creator has no key.
    if (!apiKey) apiKey = Deno.env.get("GROQ_API_KEY") || "";
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "No hay API key de Groq configurada para esta cuenta" } }), {
        status: 500,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.model || "llama-3.3-70b-versatile",
        messages: body.messages || [],
        max_tokens: body.max_tokens || 1024,
        temperature: body.temperature ?? 0.7,
      }),
    });

    const data = await groqRes.json();
    return new Response(JSON.stringify(data), {
      status: groqRes.status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
