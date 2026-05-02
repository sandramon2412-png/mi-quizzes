const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const stripTags = (value = '') => String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const filenameFor = (title = 'ebook') => `${String(title).replace(/[\\/:*?"<>|]+/g, '').trim() || 'ebook'}.pdf`;

function markdownToHtml(input = '') {
  const cleaned = String(input)
    .replace(/<button[\s\S]*?<\/button>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<figure[^>]*[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/gi, (_, caption) => `\n\n> ${stripTags(caption)}\n\n`)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned.split(/\n\n+/).map(block => {
    const text = block.trim();
    if (!text) return '';
    if (/^#{2,3}\s+/.test(text)) return `<h3>${escapeHtml(text.replace(/^#{2,3}\s+/, ''))}</h3>`;
    if (/^>\s+/.test(text)) return `<blockquote>${escapeHtml(text.replace(/^>\s+/, ''))}</blockquote>`;
    if (/^\|.+\|$/m.test(text)) {
      const rows = text.split('\n').filter(row => /^\|.+\|$/.test(row) && !/^\|\s*-/.test(row));
      return `<table>${rows.map((row, index) => `<tr>${row.split('|').map(cell => cell.trim()).filter(Boolean).map(cell => index === 0 ? `<th>${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</table>`;
    }
    if (/^[-*]\s+/m.test(text)) {
      const items = text.split('\n').filter(Boolean).map(line => `<li>${escapeHtml(line.replace(/^[-*]\s+/, ''))}</li>`).join('');
      return `<ul>${items}</ul>`;
    }
    if (/^\d+[.)]\s+/m.test(text)) {
      const items = text.split('\n').filter(Boolean).map(line => `<li>${escapeHtml(line.replace(/^\d+[.)]\s+/, ''))}</li>`).join('');
      return `<ol class="steps">${items}</ol>`;
    }
    return `<p>${escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
  }).join('\n');
}

function themeFor(ebook) {
  const id = ebook.cover?.theme || ebook.settings?.theme || ebook.theme || 'finance';
  if (id === 'spiritual') return { primary: '#B96F5F', accent: '#D8A06F', bg: '#FBF4ED', fg: '#372620', surface: '#FFF0E7', surface2: '#FFF9F4', border: '#EBD6C8' };
  if (id === 'pastel') return { primary: '#e0749c', accent: '#f4a261', bg: '#fdf6f0', fg: '#2a2233', surface: '#fbeadf', surface2: '#f7e1d4', border: '#eed6c4' };
  if (id === 'corporate') return { primary: '#0a2540', accent: '#059669', bg: '#ffffff', fg: '#0f172a', surface: '#ecfdf5', surface2: '#f0fdf4', border: '#d1fae5' };
  if (id === 'dark-neon') return { primary: '#c084fc', accent: '#22d3ee', bg: '#0a0a0f', fg: '#eaeaf0', surface: '#1a1a2e', surface2: '#10101c', border: '#2a2a44' };
  if (id === 'light') return { primary: '#2E5BFF', accent: '#7c3aed', bg: '#ffffff', fg: '#1a1a1a', surface: '#f0f5ff', surface2: '#f7f8fb', border: '#e5e7eb' };
  return { primary: '#1F7A5A', accent: '#C8A24A', bg: '#f4f7f5', fg: '#13231b', surface: '#e8f1ec', surface2: '#fff8e5', border: '#d5e4da' };
}

function buildHtml(ebook) {
  const theme = themeFor(ebook);
  const chapters = (ebook.chapters || []).map((chapter, index) => `
    <section class="chapter">
      <h2>${escapeHtml((chapter.title || `Seccion ${index + 1}`).replace(/^cap[ií]tulo\s+\d+\s*[:\-–—]?\s*/i, ''))}</h2>
      ${markdownToHtml(chapter.body_md || '')}
    </section>
  `).join('');

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
    :root{--primary:${theme.primary};--accent:${theme.accent};--bg:${theme.bg};--fg:${theme.fg};--surface:${theme.surface};--surface2:${theme.surface2};--border:${theme.border}}
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{margin:0;background:var(--bg);color:var(--fg);font-family:Georgia,'Times New Roman',serif}
    .cover{width:210mm;height:297mm;page-break-after:always;color:#fff;display:grid;grid-template-columns:1fr .85fr;gap:22mm;align-items:center;padding:28mm 22mm;background:linear-gradient(135deg,var(--primary) 0%,var(--primary) 62%,var(--accent) 145%);overflow:hidden;position:relative}
    .cover:before{content:'';position:absolute;right:-50mm;bottom:-60mm;width:150mm;height:150mm;border-radius:50%;background:rgba(255,255,255,.14)}.cover:after{content:'';position:absolute;right:46mm;top:-10mm;width:18mm;height:330mm;background:rgba(255,255,255,.08);transform:skewX(-18deg)}
    .cover h1{font-family:Arial,sans-serif;font-size:38pt;line-height:1.05;margin:0 0 16pt;font-weight:800}.cover p{font-size:15pt;line-height:1.45}.cover-card{height:145mm;border-radius:24px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.14);box-shadow:0 25px 70px rgba(0,0,0,.22);display:flex;align-items:flex-end;padding:18mm;font-family:Arial,sans-serif;font-size:8pt;font-weight:800;text-transform:uppercase;letter-spacing:.1em;position:relative;z-index:1}
    .doc{padding:18mm 20mm}.chapter{break-inside:auto;margin:0 0 11mm}.chapter h2{font-family:Arial,sans-serif;color:var(--primary);font-size:20pt;line-height:1.15;margin:0 0 10pt;break-after:avoid}.chapter h3{font-family:Arial,sans-serif;font-size:14pt;margin:14pt 0 7pt;break-after:avoid}.chapter p{font-size:11.2pt;line-height:1.55;margin:0 0 8pt;orphans:3;widows:3}.chapter strong{color:var(--primary)}
    ul,.steps{list-style:none;padding:0;margin:0 0 10pt}li{break-inside:avoid;background:var(--surface);padding:7pt 9pt;margin:4pt 0;border-radius:7pt;font-size:10.5pt;line-height:1.45}.steps{counter-reset:step}.steps li{counter-increment:step;padding-left:38pt;position:relative;background:var(--surface2)}.steps li:before{content:counter(step);position:absolute;left:9pt;top:7pt;width:21pt;height:21pt;border-radius:99px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-size:10pt;font-weight:800}
    blockquote{break-inside:avoid;background:var(--surface2);border-left:4pt solid var(--accent);padding:9pt 12pt;margin:10pt 0;border-radius:0 8pt 8pt 0}table{width:100%;border-collapse:collapse;margin:10pt 0;break-inside:avoid;font-family:Arial,sans-serif;font-size:9pt}th{background:var(--primary);color:#fff;text-align:left;padding:7pt}td{padding:7pt;border-top:1px solid var(--border)}@page{size:A4;margin:0}
  </style></head><body><section class="cover"><div><h1>${escapeHtml(ebook.title || 'Ebook')}</h1><p>${escapeHtml(ebook.cover?.subtitle || '')}</p></div><div class="cover-card">Luminous Studio</div></section><main class="doc">${chapters}</main></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const ebook = req.body?.ebook;
  if (!ebook || !Array.isArray(ebook.chapters)) return res.status(400).json({ error: 'Invalid ebook payload' });

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(buildHtml(ebook), { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filenameFor(ebook.title))}"`);
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('[render-ebook-pdf]', error);
    return res.status(500).json({ error: 'Could not render PDF' });
  } finally {
    if (browser) await browser.close();
  }
};
