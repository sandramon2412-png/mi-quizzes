// Candado de plan del claude-proxy.
// El navegador también bloquea la IA por plan, pero ese candado se saltea desde
// la consola. Este test cubre el que importa: el del servidor, donde vive la
// master key de Anthropic. Transpila la Edge Function y la corre con stubs.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const os = require('os');

const FN = path.resolve(__dirname, '..', 'supabase', 'functions', 'claude-proxy', 'index.ts');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'plan-gate-'));

// Quita los imports por URL (Deno) y pasa el TS a JS para poder ejecutarlo en Node.
fs.writeFileSync(path.join(tmp, 'fn.ts'),
  fs.readFileSync(FN, 'utf8').replace(/^import .*$/gm, ''));
try {
  execFileSync('npx', ['tsc', path.join(tmp, 'fn.ts'), '--target', 'es2022',
    '--module', 'esnext', '--outDir', tmp, '--skipLibCheck'], { stdio: 'ignore' });
} catch { /* tsc emite igual aunque se queje de los tipos de Deno */ }

if (!fs.existsSync(path.join(tmp, 'fn.js'))) {
  console.log('⚠️  Hace falta TypeScript para este test: npm i typescript --no-save');
  process.exit(0);
}
const code = fs.readFileSync(path.join(tmp, 'fn.js'), 'utf8').replace(/^"use strict";/, '');

// Corre la función como si la llamara un usuario con ese plan.
async function call(plan, feature) {
  const enviadoAAnthropic = [];
  let handler = null;
  const serve = h => { handler = h; };
  const createClient = () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'u1' } }, error: null }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () =>
      (plan === '__error__'
        ? { data: null, error: { message: 'db caída' } }
        : { data: { plan } }) }) }) }),
  });
  const Deno = { env: { get: k => ({
    SUPABASE_URL: 'https://x.supabase.co', SUPABASE_ANON_KEY: 'anon',
    SUPABASE_SERVICE_ROLE_KEY: 'service', ANTHROPIC_API_KEY: 'sk-test',
  }[k]) } };
  const fetch = async (_url, init) => {
    enviadoAAnthropic.push(JSON.parse(init.body));
    return { status: 200, json: async () => ({ content: [{ type: 'text', text: 'ok' }] }) };
  };
  new Function('serve', 'createClient', 'Deno', 'fetch', code)(serve, createClient, Deno, fetch);

  const body = { model: 'claude-haiku-4-5-20251001', max_tokens: 16,
                 messages: [{ role: 'user', content: 'hola' }] };
  if (feature) body.feature = feature;
  const res = await handler({
    method: 'POST',
    headers: { get: h => (h === 'Authorization' ? 'Bearer token-valido' : null) },
    json: async () => body,
  });
  return { status: res.status, enviadoAAnthropic };
}

let f = 0;
const chk = (n, ok) => { console.log(' ' + (ok ? '✅' : '❌'), n); if (!ok) f++; };

(async () => {
  // plan, feature, HTTP esperado, descripción
  const casos = [
    ['free',    null,     403, 'Free no puede generar con IA'],
    ['free',    'botLab', 403, 'Free no puede usar Bot Lab'],
    ['starter', null,     403, 'Starter no puede generar con IA (la IA es de Pro)'],
    ['starter', 'botLab', 200, 'Starter SÍ puede usar Bot Lab (lo paga)'],
    ['pro',     null,     200, 'Pro puede generar con IA'],
    ['growth',  null,     200, 'Growth puede generar con IA'],
    ['elite',   null,     200, 'Elite puede generar con IA'],
    ['',        null,     403, 'Un perfil sin plan cae en Free, no en abierto'],
    // Si no se puede leer el plan: ni se gasta la API ni se le dice a un cliente
    // que pagó que "actualice su plan". Es un fallo transitorio, no una venta.
    ['__error__', null,   503, 'Si no se puede leer el plan, responde 503'],
    ['__error__', 'botLab', 503, 'Lo mismo para Bot Lab'],
  ];

  for (const [plan, feature, esperado, desc] of casos) {
    const r = await call(plan, feature);
    chk(`${desc} → ${r.status}`, r.status === esperado);
    if (r.status !== 200) {
      chk('   y no gasta la API al bloquear', r.enviadoAAnthropic.length === 0);
    }
  }

  // El campo interno no debe viajar: Anthropic rechaza campos desconocidos.
  const ok = await call('starter', 'botLab');
  chk('el campo `feature` no se reenvía a Anthropic',
      ok.enviadoAAnthropic.length === 1 && !('feature' in ok.enviadoAAnthropic[0]));
  chk('el mensaje del usuario sí llega intacto',
      ok.enviadoAAnthropic[0].messages[0].content === 'hola');

  console.log('\n' + (f === 0 ? '🎉 TODOS PASAN' : '⚠️ ' + f + ' FALLAN'));
  process.exit(f ? 1 : 0);
})();
