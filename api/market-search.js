const META_API_VERSION = process.env.META_API_VERSION || 'v20.0';
const META_ACCESS_TOKEN = process.env.META_AD_LIBRARY_ACCESS_TOKEN || process.env.FACEBOOK_AD_LIBRARY_TOKEN || '';

const DEMO_ADS = [
  { title: 'No compres otra crema sin saber que necesita tu piel', advertiser: 'Glow Method', platform: 'Facebook', destination: 'Hotmart', category: 'Health/Beauty', media: 'Video', country: 'Colombia', language: 'Espanol', impressions: 184000, activeDays: 42, score: 94, created: '2026-04-02', url: 'hotmart', hook: 'Diagnostico antes de rutina', insight: 'El anuncio usa curiosidad y evita prometer milagro: invita a diagnosticar antes de comprar.' },
  { title: '3 errores que empeoran manchas aunque uses protector', advertiser: 'Dermal Class', platform: 'Instagram', destination: 'WhatsApp', category: 'Course', media: 'Carousel', country: 'Mexico', language: 'Espanol', impressions: 132000, activeDays: 31, score: 88, created: '2026-04-11', url: 'whatsapp', hook: 'Errores ocultos', insight: 'Buen angulo educativo: muestra fallo actual y abre espacio para guia o quiz.' },
  { title: 'Piel sensible: rutina de 4 pasos para calmar rojez', advertiser: 'Skin Reset', platform: 'Facebook', destination: 'Shopify', category: 'Product/Service', media: 'Imagen', country: 'Estados Unidos', language: 'Espanol', impressions: 98000, activeDays: 26, score: 82, created: '2026-04-16', url: 'shopify', hook: 'Simplificar rutina', insight: 'El mensaje vende alivio y orden. Perfecto para mini app de seguimiento.' },
  { title: 'Tu piel no necesita 10 productos, necesita un mapa', advertiser: 'Beauty Lab Coach', platform: 'Instagram', destination: 'Leadpages', category: 'Personal Coach', media: 'Video', country: 'Espana', language: 'Espanol', impressions: 76000, activeDays: 19, score: 86, created: '2026-04-23', url: 'leadpages', hook: 'Mapa personalizado', insight: 'La palabra mapa conecta con quiz + resultado + mini app. Gran estructura de oferta.' },
  { title: 'Quiz gratis: descubre si tu barrera esta irritada', advertiser: 'Barrera Sana', platform: 'Facebook', destination: 'ClickFunnels', category: 'Health/Beauty', media: 'Video', country: 'Mexico', language: 'Espanol', impressions: 153000, activeDays: 36, score: 91, created: '2026-04-07', url: 'quiz', hook: 'Quiz de barrera', insight: 'Demuestra que quiz como entrada puede precalificar antes de vender reto o asesoramiento.' },
  { title: 'El antes y despues real empieza con constancia', advertiser: 'Luminous Demo', platform: 'Instagram', destination: 'Hotmart', category: 'App Page', media: 'Video', country: 'Colombia', language: 'Espanol', impressions: 64000, activeDays: 14, score: 78, created: '2026-04-29', url: 'hotmart', hook: 'Constancia guiada', insight: 'Este angulo refuerza la mini app como valor premium post-compra.' }
];

const COUNTRY_CODES = {
  'Todos los paises': 'ALL',
  Colombia: 'CO',
  Mexico: 'MX',
  Espana: 'ES',
  'Estados Unidos': 'US'
};

const LANGUAGE_CODES = {
  Espanol: 'es',
  Ingles: 'en',
  Portugues: 'pt'
};

const MEDIA_TYPES = {
  Video: 'VIDEO',
  Imagen: 'IMAGE',
  Carousel: 'ALL',
  'Todos los medios': 'ALL'
};

const PLATFORM_CODES = {
  Facebook: 'FACEBOOK',
  Instagram: 'INSTAGRAM',
  'Audience Network': 'AUDIENCE_NETWORK',
  Messenger: 'MESSENGER',
  WhatsApp: 'WHATSAPP',
  Threads: 'THREADS'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function numberFromRange(range) {
  if (!range) return 0;
  const text = typeof range === 'string' ? range : `${range.lower_bound || ''}-${range.upper_bound || ''}`;
  if (text.includes('>1M')) return 1000000;
  const parts = text.match(/\d+(?:K|M)?/gi) || [];
  const last = parts[parts.length - 1] || '0';
  const value = Number(last.replace(/[KM]/i, ''));
  if (/M/i.test(last)) return value * 1000000;
  if (/K/i.test(last)) return value * 1000;
  return value || 0;
}

function daysActive(start, stop) {
  if (!start) return 0;
  const from = new Date(start);
  const to = stop ? new Date(stop) : new Date();
  const diff = Math.max(0, to.getTime() - from.getTime());
  return Math.max(1, Math.round(diff / 86400000));
}

function inferDestination(text) {
  const value = String(text || '').toLowerCase();
  if (value.includes('hotmart')) return 'Hotmart';
  if (value.includes('kiwify')) return 'Kiwify';
  if (value.includes('shopify')) return 'Shopify';
  if (value.includes('whatsapp') || value.includes('wa.me')) return 'WhatsApp';
  if (value.includes('clickfunnels')) return 'ClickFunnels';
  if (value.includes('leadpages')) return 'Leadpages';
  if (value.includes('typeform')) return 'Typeform';
  if (value.includes('youtube')) return 'YouTube';
  return 'Landing';
}

function inferMedia(ad) {
  const platforms = Array.isArray(ad.publisher_platforms) ? ad.publisher_platforms.join(', ') : '';
  const creative = [
    ...(ad.ad_creative_bodies || []),
    ...(ad.ad_creative_link_titles || []),
    ...(ad.ad_creative_link_descriptions || [])
  ].join(' ');
  if (/video|watch|reel/i.test(`${platforms} ${creative}`)) return 'Video';
  return 'Imagen';
}

function scoreAd(ad) {
  let score = 62;
  const text = [
    ...(ad.ad_creative_bodies || []),
    ...(ad.ad_creative_link_titles || []),
    ...(ad.ad_creative_link_descriptions || [])
  ].join(' ').toLowerCase();
  if (/quiz|diagnost|descubre|test/.test(text)) score += 12;
  if (/gratis|guia|reto|metodo|sistema/.test(text)) score += 10;
  if (ad.ad_delivery_stop_time === null || !ad.ad_delivery_stop_time) score += 6;
  score += Math.min(10, Math.round(daysActive(ad.ad_delivery_start_time, ad.ad_delivery_stop_time) / 8));
  return Math.min(98, score);
}

function normalizeMetaAd(ad) {
  const body = (ad.ad_creative_bodies || [])[0] || '';
  const title = (ad.ad_creative_link_titles || [])[0] || body.slice(0, 82) || `Anuncio ${ad.id}`;
  const linkText = [
    ad.ad_snapshot_url,
    ...(ad.ad_creative_link_captions || []),
    ...(ad.ad_creative_link_descriptions || []),
    ...(ad.ad_creative_link_titles || [])
  ].join(' ');
  const destination = inferDestination(linkText);
  const platform = ((ad.publisher_platforms || [])[0] || 'FACEBOOK').replace(/_/g, ' ').toLowerCase();
  const cleanPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
  return {
    id: ad.id,
    title,
    advertiser: ad.page_name || 'Anunciante de Meta',
    platform: cleanPlatform === 'Audience network' ? 'Audience Network' : cleanPlatform,
    destination,
    category: 'Health/Beauty',
    media: inferMedia(ad),
    country: 'Meta',
    language: (ad.languages || [])[0] || 'Meta',
    impressions: numberFromRange(ad.impressions),
    activeDays: daysActive(ad.ad_delivery_start_time, ad.ad_delivery_stop_time),
    score: scoreAd(ad),
    created: (ad.ad_creation_time || ad.ad_delivery_start_time || '').slice(0, 10),
    url: String(destination).toLowerCase(),
    hook: title.slice(0, 48),
    insight: 'Anuncio publico importado desde Meta. Revisar promesa, CTA, formato y destino para convertirlo en oferta, quiz y creativo propio.',
    snapshotUrl: ad.ad_snapshot_url
  };
}

function buildMetaUrl(filters) {
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/ads_archive`);
  const fields = [
    'id',
    'page_id',
    'page_name',
    'ad_creation_time',
    'ad_delivery_start_time',
    'ad_delivery_stop_time',
    'ad_creative_bodies',
    'ad_creative_link_titles',
    'ad_creative_link_descriptions',
    'ad_creative_link_captions',
    'ad_snapshot_url',
    'publisher_platforms',
    'languages',
    'impressions'
  ];
  const country = COUNTRY_CODES[filters.country] || filters.countryCode || 'ALL';
  const platforms = (filters.platforms || [])
    .map(platform => PLATFORM_CODES[platform])
    .filter(Boolean);
  const languages = LANGUAGE_CODES[filters.language] ? [LANGUAGE_CODES[filters.language]] : [];
  const mediaType = MEDIA_TYPES[filters.media] || 'ALL';

  url.searchParams.set('access_token', META_ACCESS_TOKEN);
  url.searchParams.set('fields', fields.join(','));
  url.searchParams.set('limit', String(Math.min(Number(filters.limit || 25), 50)));
  url.searchParams.set('ad_type', filters.adType || 'ALL');
  url.searchParams.set('ad_active_status', filters.activeStatus || 'ACTIVE');
  url.searchParams.set('ad_reached_countries', JSON.stringify([country]));
  if (filters.query) url.searchParams.set('search_terms', String(filters.query).slice(0, 100));
  url.searchParams.set('search_type', filters.searchType === 'exact' ? 'KEYWORD_EXACT_PHRASE' : 'KEYWORD_UNORDERED');
  if (filters.dateFrom) url.searchParams.set('ad_delivery_date_min', filters.dateFrom);
  if (filters.dateTo) url.searchParams.set('ad_delivery_date_max', filters.dateTo);
  if (platforms.length) url.searchParams.set('publisher_platforms', JSON.stringify(platforms));
  if (languages.length) url.searchParams.set('languages', JSON.stringify(languages));
  if (mediaType !== 'ALL') url.searchParams.set('media_type', mediaType);
  return url;
}

function filterDemo(filters) {
  const query = String(filters.query || '').toLowerCase().trim();
  return DEMO_ADS.filter(ad => {
    const text = `${ad.title} ${ad.advertiser} ${ad.hook} ${ad.insight}`.toLowerCase();
    const queryOk = !query || query.split(/\s+/).some(word => text.includes(word));
    const countryOk = !filters.country || filters.country === 'Todos los paises' || ad.country === filters.country;
    const mediaOk = !filters.media || filters.media === 'Todos los medios' || ad.media === filters.media;
    const platformOk = !filters.platforms?.length || filters.platforms.includes(ad.platform);
    return queryOk && countryOk && mediaOk && platformOk;
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let filters = {};
  try {
    filters = await readBody(req);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  if (!META_ACCESS_TOKEN) {
    return res.status(200).json({
      mode: 'demo',
      source: 'demo-local',
      note: 'Configura META_AD_LIBRARY_ACCESS_TOKEN para consultar Meta Ad Library desde Vercel.',
      results: filterDemo(filters)
    });
  }

  try {
    const response = await fetch(buildMetaUrl(filters));
    const payload = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: payload?.error?.message || 'Meta Ad Library request failed',
        source: 'meta-ad-library'
      });
    }
    return res.status(200).json({
      mode: 'live',
      source: 'meta-ad-library',
      paging: payload.paging || null,
      results: (payload.data || []).map(normalizeMetaAd)
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Could not search ads',
      detail: error.message,
      source: 'meta-ad-library'
    });
  }
}

module.exports = handler;
