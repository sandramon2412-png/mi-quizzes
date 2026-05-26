// ============================================================
// Luminous Studio — Creator AI Proxy
// ============================================================
// Endpoint PÚBLICO usado por el player de quizzes y mini-apps.
// Busca server-side la groq_api_key del creador del contenido
// y llama a Groq con ella. Si no hay key o falla, cae al
// Claude de la plataforma.
//
// Llamado desde: mini-app-player.html, resultado-quiz.html
// Body: { contentType: 'miniapp'|'quiz'|'landing_builder', contentId, messages,
//         systemPrompt, maxTokens, model }
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit: 30 req/min por IP
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.reset) {
    rateMap.set(key, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

async function callGroq(apiKey: string, body: any) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || "llama-3.3-70b-versatile",
      messages: body.systemPrompt
        ? [{ role: "system", content: body.systemPrompt }, ...(body.messages || [])]
        : (body.messages || []),
      max_tokens: body.maxTokens || 500,
      temperature: body.temperature ?? 0.7,
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || "Groq failed");
  return {
    content: data.choices?.[0]?.message?.content || "",
    provider: "groq",
  };
}

async function callClaude(apiKey: string, body: any) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: body.claudeModel || "claude-haiku-4-5-20251001",
      max_tokens: body.maxTokens || 500,
      system: body.systemPrompt || undefined,
      messages: body.messages || [],
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || "Claude failed");
  return {
    content: data.content?.[0]?.text || "",
    provider: "claude",
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const ip = req.headers.get("x-forwarded-for") || "anon";
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: { message: "Demasiadas solicitudes" } }),
        { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { contentType, contentId } = body;
    if (!contentType || !contentId) {
      return new Response(
        JSON.stringify({ error: { message: "contentType y contentId son requeridos" } }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Landing Builder: generacion publica controlada para evitar depender
    // de la sesion local del navegador. Mantiene rate limit por IP y usa
    // solo la llave server-side de la plataforma.
    if (contentType === "landing_builder") {
      const claudeKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!claudeKey) {
        return new Response(
          JSON.stringify({ error: { message: "No hay proveedor de IA disponible" } }),
          { status: 503, headers: { ...CORS, "Content-Type": "application/json" } }
        );
      }
      const result = await callClaude(claudeKey, {
        ...body,
        maxTokens: Math.min(Number(body.maxTokens || 6500), 8000),
        claudeModel: body.claudeModel || "claude-haiku-4-5-20251001",
      });
      return new Response(JSON.stringify(result), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Cliente con service role para leer la groq_api_key del creador
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1) Obtener owner del contenido
    const table = contentType === "quiz" ? "quizzes" : "mini_apps";
    const { data: content, error: cErr } = await admin
      .from(table)
      .select("user_id")
      .eq("id", contentId)
      .single();
    if (cErr || !content) {
      return new Response(
        JSON.stringify({ error: { message: "Contenido no encontrado" } }),
        { status: 404, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // 2) Leer la groq key del creador
    const { data: profile } = await admin
      .from("profiles")
      .select("groq_api_key")
      .eq("id", content.user_id)
      .single();

    const groqKey = profile?.groq_api_key || "";

    // 3) Intentar Groq primero
    if (groqKey) {
      try {
        const result = await callGroq(groqKey, body);
        return new Response(JSON.stringify(result), {
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      } catch (e) {
        console.warn("Groq failed, falling back to Claude:", e.message);
      }
    }

    // 4) Fallback: Claude con la master key de la plataforma
    const claudeKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!claudeKey) {
      return new Response(
        JSON.stringify({ error: { message: "El creador no tiene Groq configurado y no hay fallback disponible" } }),
        { status: 503, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const result = await callClaude(claudeKey, body);
    return new Response(JSON.stringify(result), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
