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

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth ──────────────────────────────────────────────────────
const Auth = {
  async session() {
    const { data: { session } } = await db.auth.getSession();
    return session;
  },

  // Siempre devuelve un token válido, refrescándolo si es necesario
  async getToken() {
    // Intentar refresh incondicional para garantizar token fresco
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
    return data;
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
    const s = await this.session();
    if (!s) {
      const next = encodeURIComponent(location.pathname + location.search);
      window.location.href = `./login.html?next=${next}`;
      return null;
    }
    return s.user;
  },

  // Redirect to dashboard if already logged in (use on login/registro)
  async redirectIfAuth(dest = './dashboard.html') {
    const s = await this.session();
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
          productUrl:       quiz.productUrl        || '',
          paymentUrl:       quiz.paymentUrl        || '',
          landingUrl:       quiz.landingUrl        || '',
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
      const row = {
        user_id:      userId,
        name:         app.name,
        type:         app.type,
        niche:        app.niche,
        product:      app.product,
        description:  app.description,
        icon:         app.icon,
        access_codes: app.accessCodes || [],
        status:       app.status || 'active',
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
      created:     r.created_at,
      status:      r.status,
      name:        r.name,
      type:        r.type,
      niche:       r.niche,
      product:     r.product,
      description: r.description,
      icon:        r.icon,
      accessCodes: r.access_codes || [],
    }),
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
