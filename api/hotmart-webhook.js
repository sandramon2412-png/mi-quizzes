// ============================================================
// Luminous Studio — Hotmart Webhook Handler
// POST /api/hotmart-webhook
// Hotmart docs: https://developers.hotmart.com/docs/en/webhooks
// ============================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HOTMART_SECRET = process.env.HOTMART_WEBHOOK_SECRET; // set in Vercel env vars

// Map Hotmart product IDs → plan names
const PRODUCT_PLAN_MAP = {
  '7513032': 'starter',
  '7513065': 'pro',
  '7513088': 'growth',
  '7513105': 'elite',
  // Also support env var overrides
  ...(process.env.HOTMART_PRODUCT_STARTER ? { [process.env.HOTMART_PRODUCT_STARTER]: 'starter' } : {}),
  ...(process.env.HOTMART_PRODUCT_PRO     ? { [process.env.HOTMART_PRODUCT_PRO]:     'pro'     } : {}),
  ...(process.env.HOTMART_PRODUCT_GROWTH  ? { [process.env.HOTMART_PRODUCT_GROWTH]:  'growth'  } : {}),
  ...(process.env.HOTMART_PRODUCT_ELITE   ? { [process.env.HOTMART_PRODUCT_ELITE]:   'elite'   } : {}),
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── 1. Verify Hotmart signature ──────────────────────────
  const signature = req.headers['x-hotmart-webhook-token'];
  if (HOTMART_SECRET && signature !== HOTMART_SECRET) {
    console.error('Hotmart webhook: invalid token');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const event = req.body;
  const eventType = event?.event;

  console.log('Hotmart webhook received:', eventType, JSON.stringify(event).slice(0, 300));

  // ── 2. Handle relevant events ────────────────────────────
  // https://developers.hotmart.com/docs/en/webhooks/events
  const ACTIVE_EVENTS = [
    'PURCHASE_COMPLETE',       // new sale confirmed
    'PURCHASE_APPROVED',       // payment approved
    'SUBSCRIPTION_REACTIVATED',// re-activated after churn
  ];
  const CANCEL_EVENTS = [
    'PURCHASE_REFUNDED',
    'PURCHASE_CHARGEBACK',
    'SUBSCRIPTION_CANCELLATION',
    'SUBSCRIPTION_EXPIRED',
  ];

  if (!ACTIVE_EVENTS.includes(eventType) && !CANCEL_EVENTS.includes(eventType)) {
    // Not an event we care about — return 200 so Hotmart doesn't retry
    return res.status(200).json({ ok: true, ignored: true });
  }

  // ── 3. Extract buyer info ────────────────────────────────
  const buyer = event?.data?.buyer || event?.data?.subscriber;
  const product = event?.data?.product;
  const buyerEmail = buyer?.email;
  const productId = String(product?.id || '');

  if (!buyerEmail) {
    return res.status(400).json({ error: 'No buyer email in payload' });
  }

  // ── 4. Determine plan ────────────────────────────────────
  const plan = ACTIVE_EVENTS.includes(eventType)
    ? (PRODUCT_PLAN_MAP[productId] || 'pro')  // fallback to pro if product id not mapped
    : 'free';                                  // cancelled → downgrade to free

  // Subscription expiry: set 35 days from now for monthly (buffer for billing)
  const expiresAt = ACTIVE_EVENTS.includes(eventType)
    ? new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  // ── 5. Update Supabase ───────────────────────────────────
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Find user by email
    const { data: users, error: userErr } = await supabase.auth.admin.listUsers();
    if (userErr) throw userErr;

    const user = users?.users?.find(u => u.email === buyerEmail);
    if (!user) {
      // User doesn't exist yet — store pending upgrade so they get it on first login
      await supabase.from('pending_upgrades').upsert({
        email: buyerEmail,
        plan,
        hotmart_product_id: productId,
        event_type: eventType,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      console.log(`Hotmart: stored pending upgrade for ${buyerEmail} → ${plan}`);
      return res.status(200).json({ ok: true, pending: true });
    }

    // Update user metadata with plan
    const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        plan,
        plan_expires_at: expiresAt,
        hotmart_product_id: productId,
      },
    });
    if (updateErr) throw updateErr;

    // Also upsert into a plans table for easy querying
    await supabase.from('user_plans').upsert({
      user_id: user.id,
      email: buyerEmail,
      plan,
      hotmart_product_id: productId,
      event_type: eventType,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    console.log(`Hotmart: updated ${buyerEmail} → plan=${plan}`);
    return res.status(200).json({ ok: true, plan, email: buyerEmail });

  } catch (err) {
    console.error('Hotmart webhook DB error:', err);
    return res.status(500).json({ error: err.message });
  }
}
