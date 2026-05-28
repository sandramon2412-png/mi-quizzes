// ============================================================
// Luminous Studio — Supabase Client + Helpers
// ============================================================
// Setup:
//  1. Create a project at https://app.supabase.com
//  2. Go to Project Settings → API
//  3. Copy your Project URL and anon key below
//  4. Run schema.sql in the Supabase SQL Editor
// ============================================================

const SUPABASE_URL      = 'https://euauqqamrkqwoytveljp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YXVxcWFtcmtxd295dHZlbGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjc5ODcsImV4cCI6MjA4OTcwMzk4N30.-047G98I5ecegiWBmkItSgYkhv37AAgTOOZoeB-iAIo';

const AUTH_POLL_INTERVAL_MS = 180;

function getSafeAuthStorage() {
  try {
    const key = '__luminous_auth_storage_test__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    return undefined;
  }
}

const safeAuthStorage = getSafeAuthStorage();
const SUPABASE_CLIENT_OPTIONS = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    ...(safeAuthStorage ? { storage: safeAuthStorage } : {}),
  },
};

function createOfflineSupabaseClient() {
  const offlineError = { message: 'Supabase client unavailable', code: 'OFFLINE' };
  const result = (data = null, error = null) => Promise.resolve({ data, error });
  const builder = () => {
    const api = {
      select: () => api,
      eq: () => api,
      neq: () => api,
      order: () => api,
      limit: () => api,
      range: () => api,
      update: () => api,
      upsert: () => api,
      delete: () => api,
      insert: () => api,
      single: () => result(null, offlineError),
      maybeSingle: () => result(null, null),
      then: (resolve, reject) => result(null, null).then(resolve, reject),
      catch: (reject) => result(null, null).catch(reject),
    };
    return api;
  };
  return {
    auth: {
      getSession: () => result({ session: null }),
      setSession: () => result({ session: null }),
      refreshSession: () => result({ session: null }),
      getUser: () => result({ user: null }),
      signInWithPassword: () => result(null, offlineError),
      signUp: () => result(null, offlineError),
      signOut: () => result(null),
      resetPasswordForEmail: () => result(null, offlineError),
    },
    from: () => builder(),
  };
}

if (!window.supabase?.createClient) {
  console.warn('[Luminous] Supabase library not available; running with local demo fallback.');
  window.supabase = { createClient: createOfflineSupabaseClient };
}

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CLIENT_OPTIONS);

const authSleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const isUsableSession = (session) => !!(session?.access_token && session?.user);
const SUPABASE_PROJECT_REF = (() => {
  try { return new URL(SUPABASE_URL).hostname.split('.')[0]; } catch { return ''; }
})();

function readCachedSupabaseSession() {
  if (!safeAuthStorage || !SUPABASE_PROJECT_REF) return null;
  const keys = [
    `sb-${SUPABASE_PROJECT_REF}-auth-token`,
    ...Array.from({ length: safeAuthStorage.length }, (_, idx) => safeAuthStorage.key(idx))
      .filter(key => key && key.startsWith('sb-') && key.endsWith('-auth-token')),
  ];
  for (const key of [...new Set(keys)]) {
    try {
      const raw = safeAuthStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const session = parsed?.currentSession || parsed;
      const expiresAt = Number(session?.expires_at || 0);
      if (expiresAt && expiresAt < Math.floor(Date.now() / 1000) - 30) continue;
      if (isUsableSession(session)) return session;
    } catch {}
  }
  return null;
}

function persistCachedSupabaseSession(session) {
  if (!safeAuthStorage || !SUPABASE_PROJECT_REF || !isUsableSession(session)) return;
  try {
    safeAuthStorage.setItem(`sb-${SUPABASE_PROJECT_REF}-auth-token`, JSON.stringify({
      currentSession: session,
      expiresAt: session.expires_at || null,
    }));
  } catch {}
}

async function readCurrentSession() {
  const cached = readCachedSupabaseSession();
  if (cached) return cached;
  try {
    const { data: { session } } = await db.auth.getSession();
    if (isUsableSession(session)) return session;
  } catch {}
  return null;
}

async function refreshCurrentSession() {
  try {
    const { data, error } = await db.auth.refreshSession();
    if (!error && isUsableSession(data?.session)) return data.session;
  } catch {}
  return null;
}

async function waitForStoredSession(timeoutMs = 4000) {
  const started = Date.now();
  let session = await readCurrentSession();
  if (session) return session;
  while (Date.now() - started < timeoutMs) {
    await authSleep(AUTH_POLL_INTERVAL_MS);
    session = await readCurrentSession();
    if (session) return session;
  }
  return refreshCurrentSession();
}

// ── Auth ──────────────────────────────────────────────────────
const Auth = {
  async session(options = {}) {
    const timeoutMs = typeof options === 'number' ? options : (options.timeoutMs || 0);
    let session = await readCurrentSession();
    if (session) return session;
    if (timeoutMs > 0) {
      session = await waitForStoredSession(timeoutMs);
      if (session) return session;
    }
    return refreshCurrentSession();
  },

  async waitForSession(timeoutMs = 4000) {
    return waitForStoredSession(timeoutMs);
  },

  async hydrateSession(session) {
    if (!isUsableSession(session)) return null;
    persistCachedSupabaseSession(session);
    try {
      if (db.auth.setSession && session.access_token && session.refresh_token) {
        const { data } = await db.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        if (data?.session) {
          persistCachedSupabaseSession(data.session);
          return data.session;
        }
      }
    } catch {}
    return await readCurrentSession() || session;
  },

  // Siempre devuelve un token válido, refrescándolo si es necesario
  async getToken() {
    try {
      const session = await readCurrentSession();
      if (session?.access_token) return session.access_token;
    } catch {}
    try {
      const session = await waitForStoredSession(2500);
      if (session?.access_token) return session.access_token;
    } catch {}
    // Intentar refresh para garantizar token fresco
    try {
      const { data, error } = await db.auth.refreshSession();
      if (!error && data.session?.access_token) return data.session.access_token;
    } catch {}
    // Fallback: sesión actual
    const { data: { session } } = await db.auth.getSession();
    return session?.access_token || null;
  },

  // Obtener Groq API key desde Supabase profile (sin depender de localStorage)
  async getGroqKey(userId) {
    try {
      const { data } = await db.from('profiles').select('groq_api_key').eq('id', userId).single();
      return data?.groq_api_key || null;
    } catch { return null; }
  },

  async user() {
    const { data: { user } } = await db.auth.getUser();
    return user;
  },

  async signIn(email, password) {
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.session) persistCachedSupabaseSession(data.session);
    const session = await waitForStoredSession(5000);
    if (session) persistCachedSupabaseSession(session);
    // Apply any pending Hotmart upgrade for this email
    if (data?.user) _applyPendingUpgrade(data.user).catch(() => {});
    return { ...data, session: session || data?.session || null };
  },

  async signUp(email, password, name) {
    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await db.auth.signOut();
    window.location.href = './login.html';
  },

  async resetPassword(email) {
    const base = window.location.href.replace(/[^/]*(\?.*)?$/, '');
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: base + 'reset-password.html',
    });
    if (error) throw error;
  },

  // Redirect to login if not authenticated (use on protected pages)
  async requireAuth() {
    let s = await this.session({ timeoutMs: 5000 });
    if (!s) {
      await authSleep(650);
      s = await this.session({ timeoutMs: 3000 });
    }
    if (!s) {
      const isLocalHost = ['localhost', '127.0.0.1'].includes(location.hostname);
      if (isLocalHost) {
        return { id: 'local-dev-user', email: 'local@luminous.dev', user_metadata: { name: 'Luminous local' } };
      }
      const next = encodeURIComponent(location.pathname + location.search);
      window.location.href = `./login.html?next=${next}`;
      return null;
    }
    return s.user;
  },

  // Redirect to dashboard if already logged in (use on login/registro)
  async redirectIfAuth(dest = './dashboard.html') {
    const s = await this.session({ timeoutMs: 1200 });
    if (s) window.location.href = dest;
  },
};

// ── Database ──────────────────────────────────────────────────
const DB = {

  // ── Profiles ───────────────────────────────────────────────
  profiles: {
    async get(userId) {
      const { data, error } = await db.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      return data;
    },
    async upsert(userId, updates) {
      const { data, error } = await db
        .from('profiles')
        .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
        .select().single();
      if (error) throw error;
      return data;
    },
  },

  // ── Quizzes ────────────────────────────────────────────────
  quizzes: {
    async getAll(userId) {
      const { data, error } = await db.from('quizzes')
        .select('*').eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(this._norm);
    },

    async get(id) {
      const { data, error } = await db.from('quizzes').select('*').eq('id', id).single();
      if (error) return null;
      return this._norm(data);
    },

    async save(quiz, userId) {
      const row = {
        user_id:           userId,
        title:             quiz.title,
        subtitle:          quiz.subtitle,
        product:           quiz.product,
        niche:             quiz.niche,
        status:            quiz.status || 'draft',
        estimated_minutes: quiz.estimatedMinutes || 2,
        questions:         quiz.questions,
        profiles:          quiz.profiles,
        updated_at:        new Date().toISOString(),
        // All extra settings in one JSONB column (postQuizAction, landingUrl, pixelId, etc.)
        settings: {
          postQuizAction:   quiz.postQuizAction   || 'result_page',
          description:      quiz.description      || '',
          brandName:        quiz.brandName        || '',
          brandColor:       quiz.brandColor       || '',
          brandLogo:        quiz.brandLogo        || '',
          coverImage:       quiz.coverImage       || '',
          imageKeywords:    quiz.imageKeywords    || '',
          emailResultEnabled: !!quiz.emailResultEnabled,
          showLuminousCta:  quiz.showLuminousCta === true,
          productUrl:       quiz.productUrl        || '',
          paymentUrl:       quiz.paymentUrl        || '',
          landingUrl:       quiz.landingUrl        || '',
          landingId:        quiz.landingId         || '',
          landingSlug:      quiz.landingSlug       || '',
          ebookId:          quiz.ebookId           || '',
          ebookUrl:         quiz.ebookUrl          || '',
          leadMagnetUrl:    quiz.leadMagnetUrl     || '',
          whatsappNumber:   quiz.whatsappNumber    || '',
          whatsappMessage:  quiz.whatsappMessage   || '',
          leadCapture:      quiz.leadCapture       !== false,
          waLeadCapture:    quiz.waLeadCapture     !== false,
          metaPixelId:      quiz.metaPixelId       || '',
          metaCapiToken:    quiz.metaCapiToken      || '',
          miniAppId:        quiz.miniAppId          || '',
        },
      };
      if (quiz.id && !quiz.id.startsWith('tmpl-')) {
        const { data, error } = await db.from('quizzes').update(row).eq('id', quiz.id).select().single();
        if (error) throw error;
        return this._norm(data);
      } else {
        const { data, error } = await db.from('quizzes').insert(row).select().single();
        if (error) throw error;
        return this._norm(data);
      }
    },

    async delete(id) {
      const { error } = await db.from('quizzes').delete().eq('id', id);
      if (error) throw error;
    },

    _norm: (r) => ({
      id:               r.id,
      created:          r.created_at,
      status:           r.status,
      title:            r.title,
      subtitle:         r.subtitle,
      product:          r.product,
      niche:            r.niche,
      estimatedMinutes: r.estimated_minutes,
      questions:        r.questions,
      profiles:         r.profiles,
      userId:           r.user_id,
      user_id:          r.user_id,
      owner_id:         r.user_id,
      // Spread all settings fields back to top level
      ...(r.settings || {}),
    }),
  },

  // ── Mini-Apps ──────────────────────────────────────────────
  miniApps: {
    async getAll(userId) {
      const { data, error } = await db.from('mini_apps')
        .select('*').eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(this._norm);
    },

    async get(id) {
      const { data, error } = await db.from('mini_apps').select('*').eq('id', id).single();
      if (error) return null;
      return this._norm(data);
    },

    async save(app, userId) {
      // Collect non-standard fields into content JSONB
      const KNOWN = new Set(['id','user_id','userId','name','type','types','niche','product','description','icon','accessCodes','access_codes','status','content','created','created_at','updated_at']);
      const extraContent = {};
      for (const [k, v] of Object.entries(app)) {
        if (!KNOWN.has(k) && v !== undefined) extraContent[k] = v;
      }
      const row = {
        user_id:      userId,
        name:         app.name,
        type:         app.type,
        types:        app.types || [app.type].filter(Boolean),
        niche:        app.niche,
        product:      app.product,
        description:  app.description,
        icon:         app.icon,
        access_codes: app.accessCodes || [],
        status:       app.status || 'active',
        content:      Object.keys(extraContent).length ? { ...(app.content || {}), ...extraContent } : (app.content || null),
        updated_at:   new Date().toISOString(),
      };
      if (app.id) {
        const { data, error } = await db.from('mini_apps').update(row).eq('id', app.id).select().single();
        if (error) throw error;
        return this._norm(data);
      } else {
        const { data, error } = await db.from('mini_apps').insert(row).select().single();
        if (error) throw error;
        return this._norm(data);
      }
    },

    async delete(id) {
      const { error } = await db.from('mini_apps').delete().eq('id', id);
      if (error) throw error;
    },

    _norm: (r) => ({
      id:          r.id,
      user_id:     r.user_id,
      owner_id:    r.user_id,
      created:     r.created_at,
      status:      r.status,
      name:        r.name,
      type:        r.type,
      types:       r.types || [r.type].filter(Boolean),
      niche:       r.niche,
      product:     r.product,
      description: r.description,
      icon:        r.icon,
      accessCodes: r.access_codes || [],
      ...(r.content || {}),
    }),
  },

  // ── Landings (Landing Builder) ─────────────────────────────
  landings: {
    async getAll(userId) {
      const { data, error } = await db.from('landings')
        .select('*').eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async get(id) {
      const { data, error } = await db.from('landings').select('*').eq('id', id).single();
      if (error) return null;
      return data;
    },

    async getBySlug(slug) {
      const { data, error } = await db.from('landings').select('*').eq('slug', slug).maybeSingle();
      if (error) return null;
      return data;
    },

    async save(landing, userId) {
      // Ensure unique slug: if taken by another row, append short suffix.
      // Also reject reserved paths that would collide with real pages.
      const RESERVED = new Set([
        'l','api','admin','assets','public','static',
        'acceso-exito','bot-chat','bots','dashboard','generador-ia','index',
        'landing-builder','landing-view','leads','login','manna-acceso','manna-app',
        'mini-app-player','pago-exitoso','plantillas-miniapps','plantillas',
        'precios','quiz','recuperar-contrasena','registro','reset-password',
        'resultado-quiz','settings','favicon','robots','sitemap',
      ]);
      let slug = landing.slug;
      if (slug && RESERVED.has(slug.toLowerCase())) {
        slug = `${slug}-landing`;
      }
      if (slug) {
        try {
          const { data: existing } = await db.from('landings')
            .select('id').eq('slug', slug).maybeSingle();
          if (existing && existing.id !== landing.id) {
            slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
          }
        } catch {}
      }
      const row = {
        user_id:    userId,
        slug,
        title:      landing.title,
        brief:      landing.brief || '',
        html:       landing.html || '',
        messages:   landing.messages || [],
        published:  !!landing.published,
        settings:   landing.settings || {},
        updated_at: new Date().toISOString(),
      };
      // If we have a local id, try update first; if no row exists yet, insert with that id
      if (landing.id) {
        const { data: updated } = await db.from('landings').update(row).eq('id', landing.id).select().maybeSingle();
        if (updated) return updated;
        row.id = landing.id;
      }
      const { data, error } = await db.from('landings').insert(row).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await db.from('landings').delete().eq('id', id);
      if (error) throw error;
    },

    async incrementVisits(slug) {
      try {
        const { data } = await db.from('landings').select('id,visits').eq('slug', slug).maybeSingle();
        if (!data) return;
        await db.from('landings').update({ visits: (data.visits || 0) + 1 }).eq('id', data.id);
      } catch {}
    },
  },

  // ── Ebooks (Ebook Packager) ────────────────────────────────
  ebooks: {
    async getAll(userId) {
      const { data, error } = await db.from('ebooks')
        .select('*').eq('user_id', userId)
        .order('updated_at', { ascending: false });
      // Table may not exist yet — degrade gracefully
      if (error) {
        if (error.code === 'PGRST205' || error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('Could not find')) return [];
        throw error;
      }
      return data || [];
    },

    async get(id) {
      try {
        const { data, error } = await db.from('ebooks').select('*').eq('id', id).single();
        if (error) return null;
        return data;
      } catch { return null; }
    },

    async save(ebook, userId) {
      const row = {
        user_id:    userId,
        title:      ebook.title || 'Mi ebook',
        brief:      ebook.brief || '',
        topic:      ebook.topic || '',
        audience:   ebook.audience || '',
        tone:       ebook.tone || '',
        chapters:   ebook.chapters || [],
        cover:      ebook.cover || {},
        messages:   ebook.messages || [],
        settings:   ebook.settings || {},
        updated_at: new Date().toISOString(),
      };
      try {
        if (ebook.id) {
          const { data: updated } = await db.from('ebooks').update(row).eq('id', ebook.id).select().maybeSingle();
          if (updated) return updated;
          row.id = ebook.id;
        }
        const { data, error } = await db.from('ebooks').insert(row).select().single();
        if (error) throw error;
        return data;
      } catch (e) {
        // If the table doesn't exist, return the ebook as-is so localStorage still works
        if (e.code === 'PGRST205' || e.code === '42P01' || e.message?.includes('does not exist') || e.message?.includes('Could not find')) {
          console.warn('[DB.ebooks.save] Table ebooks not found — using localStorage only. Run schema.sql to enable cloud sync.');
          return { ...row, id: ebook.id || ('local-' + Date.now()) };
        }
        throw e;
      }
    },

    async delete(id) {
      try {
        const { error } = await db.from('ebooks').delete().eq('id', id);
        if (error && !(error.code === 'PGRST205' || error.code === '42P01')) throw error;
      } catch (e) {
        if (!(e.code === 'PGRST205' || e.code === '42P01' || e.message?.includes('does not exist'))) throw e;
      }
    },

    async incrementDownloads(id) {
      try {
        const { data } = await db.from('ebooks').select('downloads').eq('id', id).maybeSingle();
        if (!data) return;
        await db.from('ebooks').update({ downloads: (data.downloads || 0) + 1 }).eq('id', id);
      } catch {}
    },
  },

  // ── Landing events (CTA clicks, scrolls, etc.) ─────────────
  landingEvents: {
    async track(landingId, userId, eventType, meta = {}) {
      try {
        let visitorId = localStorage.getItem('ls_visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('ls_visitor_id', visitorId);
        }
        await db.from('landing_events').insert({
          landing_id: landingId,
          user_id: userId,
          event_type: eventType,
          visitor_id: visitorId,
          meta,
        });
      } catch (e) { console.warn('landing event', e); }
    },
    async summary(landingId) {
      const { data } = await db.from('landing_events')
        .select('event_type, visitor_id').eq('landing_id', landingId);
      if (!data) return { views: 0, uniqueViews: 0, ctaClicks: 0 };
      const uniq = new Set();
      let ctaClicks = 0, views = 0;
      data.forEach(e => {
        if (e.event_type === 'view') { views++; if (e.visitor_id) uniq.add(e.visitor_id); }
        if (e.event_type === 'cta_click') ctaClicks++;
      });
      return { views, uniqueViews: uniq.size, ctaClicks };
    },
  },

  // ── Leads ──────────────────────────────────────────────────
  leads: {
    async getAll(userId) {
      const { data, error } = await db.from('leads')
        .select('*, quizzes(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async create(lead) {
      const { data, error } = await db.from('leads').insert(lead).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await db.from('leads').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ── Responses (uso mensual por creador) ──────────────────
  responses: {
    async track({ ownerId, contentType, contentId, visitorId, month }) {
      const { error } = await db.from('response_events').insert({
        owner_id:     ownerId,
        content_type: contentType,
        content_id:   contentId,
        visitor_id:   visitorId,
        month,
      });
      if (error && !String(error.message).includes('duplicate')) {
        console.warn('Response tracking error:', error.message);
      }
    },
    async getMonthCount(ownerId, month) {
      const { count, error } = await db.from('response_events')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', ownerId)
        .eq('month', month);
      if (error) { console.warn('Response count error:', error.message); return null; }
      return count || 0;
    },
  },

  // ── Analytics ──────────────────────────────────────────────
  analytics: {
    async track(quizId, userId, eventType, profileId = null) {
      const { error } = await db.from('analytics_events').insert({
        quiz_id:    quizId,
        user_id:    userId,
        event_type: eventType,
        profile_id: profileId,
      });
      if (error) console.warn('Analytics error:', error.message);
    },

    async summary(quizId) {
      const { data } = await db.from('analytics_events')
        .select('event_type, profile_id')
        .eq('quiz_id', quizId);
      if (!data) return { views: 0, completions: 0 };
      return {
        views:       data.filter(e => e.event_type === 'view').length,
        completions: data.filter(e => e.event_type === 'completion').length,
      };
    },

    async summaryAll(userId) {
      const { data } = await db.from('analytics_events')
        .select('quiz_id, event_type')
        .eq('user_id', userId);
      if (!data) return {};
      const out = {};
      data.forEach(e => {
        if (!out[e.quiz_id]) out[e.quiz_id] = { views: 0, completions: 0 };
        if (e.event_type === 'view')       out[e.quiz_id].views++;
        if (e.event_type === 'completion') out[e.quiz_id].completions++;
      });
      return out;
    },
  },
};

// ── Apply pending Hotmart upgrade on login ─────────────────
async function _applyPendingUpgrade(user) {
  if (!user?.email || !user?.id) return;
  const { data } = await db.from('pending_upgrades').select('*').eq('email', user.email).single();
  if (!data) return;
  // Apply plan to profile
  await db.from('profiles').update({ plan: data.plan, updated_at: new Date().toISOString() }).eq('id', user.id);
  // Upsert into user_plans
  await db.from('user_plans').upsert({
    user_id: user.id, email: user.email, plan: data.plan,
    hotmart_product_id: data.hotmart_product_id,
    event_type: data.event_type, expires_at: data.expires_at,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  // Delete pending entry
  await db.from('pending_upgrades').delete().eq('email', user.email);
}

// Expose helpers for pages that check readiness through window.*.
window.db = db;
window.Auth = Auth;
window.DB = DB;
