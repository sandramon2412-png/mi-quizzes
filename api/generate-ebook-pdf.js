const PDFDocument = require('pdfkit');

const THEMES = {
  light: {
    bg: '#ffffff', fg: '#1a1a1a', muted: '#555555',
    primary: '#2E5BFF', accent: '#7c3aed',
    surface: '#f0f5ff', surface2: '#f7f8fb', border: '#e5e7eb',
  },
  pastel: {
    bg: '#fdf6f0', fg: '#2a2233', muted: '#6b5a6f',
    primary: '#e0749c', accent: '#f4a261',
    surface: '#fbeadf', surface2: '#f7e1d4', border: '#eed6c4',
  },
  corporate: {
    bg: '#ffffff', fg: '#0f172a', muted: '#475569',
    primary: '#0a2540', accent: '#059669',
    surface: '#ecfdf5', surface2: '#f0fdf4', border: '#d1fae5',
  },
  'dark-neon': {
    bg: '#0a0a0f', fg: '#eaeaf0', muted: '#a3a3b5',
    primary: '#c084fc', accent: '#22d3ee',
    surface: '#1a1a2e', surface2: '#10101c', border: '#2a2a44',
  },
  finance: {
    bg: '#f4f7f5', fg: '#13231b', muted: '#64766d',
    primary: '#1F7A5A', accent: '#C8A24A',
    surface: '#e8f1ec', surface2: '#fff8e5', border: '#d5e4da',
  },
  spiritual: {
    bg: '#FBF4ED', fg: '#372620', muted: '#8B7065',
    primary: '#B96F5F', accent: '#D8A06F',
    surface: '#FFF0E7', surface2: '#FFF9F4', border: '#EBD6C8',
  },
};

const safeText = (value = '') => String(value)
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '');

const decodeHtml = (value = '') => String(value)
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const stripTags = (value = '') => decodeHtml(String(value).replace(/<[^>]+>/g, ' '))
  .replace(/\s+/g, ' ')
  .trim();

const filenameFor = (title = 'ebook') => {
  const clean = String(title).replace(/[\\/:*?"<>|]+/g, '').trim() || 'ebook';
  return `${clean}.pdf`;
};

function inferThemeId(ebook) {
  const text = [
    ebook?.title, ebook?.topic, ebook?.brief, ebook?.cover?.subtitle,
    ...(ebook?.chapters || []).slice(0, 3).flatMap(ch => [ch?.title, ch?.body_md]),
  ].filter(Boolean).join(' ').toLowerCase();
  if (/finanz|dinero|ahorro|deuda|presupuesto|invers|wealth|money/.test(text)) return 'finance';
  if (/espirit|bibl|fe\b|dios|oraci|devocional|cristi|comuni[oó]n/.test(text)) return 'spiritual';
  return 'light';
}

function resolveTheme(ebook) {
  const explicitId = ebook.cover?.theme || ebook.settings?.theme || ebook.theme;
  const inferredId = inferThemeId(ebook);
  const themeId = explicitId && THEMES[explicitId] && !(explicitId === 'light' && inferredId !== 'light')
    ? explicitId
    : inferredId;
  const base = THEMES[themeId] || THEMES.light;
  const from = ebook.cover?.gradientFrom;
  const to = ebook.cover?.gradientTo;
  if (/^#[0-9a-f]{6}$/i.test(from || '') && /^#[0-9a-f]{6}$/i.test(to || '')) {
    return { ...base, primary: from, accent: to };
  }
  return base;
}

function collectPdf(doc) {
  const chunks = [];
  doc.on('data', chunk => chunks.push(chunk));
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}

function addPageIfNeeded(doc, needed = 40) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

function drawText(doc, text, options = {}) {
  const size = options.size || 10;
  const lineGap = options.lineGap ?? 3;
  const paragraphGap = options.paragraphGap ?? 6;
  const indent = options.indent || 0;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right - indent;
  doc.font(options.bold ? 'Helvetica-Bold' : options.font || 'Times-Roman')
    .fontSize(size)
    .fillColor(options.color || '#111111');
  const height = doc.heightOfString(text, { width, lineGap });
  addPageIfNeeded(doc, height + paragraphGap);
  doc.text(text, doc.page.margins.left + indent, doc.y, { width, lineGap });
  doc.moveDown(paragraphGap / 12);
}

function drawHeading(doc, text, theme, level = 2) {
  addPageIfNeeded(doc, 34);
  doc.font('Helvetica-Bold')
    .fontSize(level === 2 ? 17 : 13)
    .fillColor(level === 2 ? theme.primary : theme.fg)
    .text(text, { lineGap: 2 });
  doc.moveDown(level === 2 ? 0.55 : 0.35);
}

function drawBullet(doc, text, theme) {
  const x = doc.page.margins.left;
  const y = doc.y;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right - 20;
  doc.font('Times-Roman').fontSize(10);
  const height = Math.max(20, doc.heightOfString(text, { width, lineGap: 2 }) + 10);
  addPageIfNeeded(doc, height + 4);
  doc.roundedRect(x, doc.y, width + 20, height, 6).fill(theme.surface);
  doc.circle(x + 10, doc.y + 12, 3).fill(theme.primary);
  doc.fillColor(theme.fg).font('Times-Roman').fontSize(10)
    .text(text, x + 22, y + 7, { width, lineGap: 2 });
  doc.y = y + height + 5;
}

function drawCallout(doc, text, theme) {
  const x = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  doc.font('Times-Italic').fontSize(10);
  const height = Math.max(34, doc.heightOfString(text, { width: width - 24, lineGap: 3 }) + 18);
  addPageIfNeeded(doc, height + 8);
  const y = doc.y;
  doc.roundedRect(x, y, width, height, 6).fill(theme.surface);
  doc.rect(x, y, 4, height).fill(theme.accent);
  doc.fillColor(theme.fg).font('Times-Italic').fontSize(10)
    .text(text, x + 14, y + 10, { width: width - 24, lineGap: 3 });
  doc.y = y + height + 8;
}

function drawVisual(doc, caption, theme) {
  const x = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const height = 86;
  addPageIfNeeded(doc, height + 22);
  const y = doc.y;
  doc.roundedRect(x, y, width, height, 10).fill(theme.surface2);
  doc.rect(x, y, width, height * 0.74).fill(theme.primary);
  doc.polygon([x, y], [x + width * 0.28, y], [x + width * 0.10, y + height * 0.74], [x, y + height * 0.74])
    .fillOpacity(0.18).fill('#ffffff').fillOpacity(1);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
    .text('VISUAL EDITORIAL', x + 16, y + height * 0.50, { width: width - 32 });
  doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7)
    .text(String(caption || 'Imagen editorial').toUpperCase(), x + 12, y + height * 0.79, { width: width - 24, lineGap: 1 });
  doc.y = y + height + 12;
}

async function fetchImageBuffer(url) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const type = response.headers.get('content-type') || '';
    if (!/image\/(png|jpe?g|webp)/i.test(type)) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
}

async function drawImageOrVisual(doc, block, theme) {
  const buffer = await fetchImageBuffer(block.url);
  if (!buffer) {
    drawVisual(doc, block.text, theme);
    return;
  }
  const x = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const height = 92;
  addPageIfNeeded(doc, height + 24);
  const y = doc.y;
  doc.roundedRect(x, y, width, height, 10).fill(theme.surface2);
  try {
    doc.image(buffer, x, y, { fit: [width, height], align: 'center', valign: 'center' });
  } catch {
    drawVisual(doc, block.text, theme);
    return;
  }
  if (block.text) {
    doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7)
      .text(String(block.text).toUpperCase(), x + 8, y + height + 5, { width: width - 16, lineGap: 1 });
    doc.y = y + height + 18;
  } else {
    doc.y = y + height + 12;
  }
}

function drawTable(doc, rows, theme) {
  if (!rows.length) return;
  const x = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const colWidth = width / rows[0].length;
  const rowHeight = 26;
  addPageIfNeeded(doc, rowHeight * Math.min(rows.length, 6) + 10);
  rows.forEach((row, rowIndex) => {
    if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) doc.addPage();
    const y = doc.y;
    row.forEach((cell, colIndex) => {
      doc.rect(x + colWidth * colIndex, y, colWidth, rowHeight)
        .fill(rowIndex === 0 ? theme.primary : (rowIndex % 2 ? theme.bg : theme.surface2));
      doc.fillColor(rowIndex === 0 ? '#ffffff' : theme.fg)
        .font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(8)
        .text(cell, x + colWidth * colIndex + 6, y + 7, { width: colWidth - 12, lineGap: 1 });
    });
    doc.y = y + rowHeight;
  });
  doc.moveDown(0.7);
}

function parseBlocks(input = '') {
  let body = safeText(input);
  const blocks = [];

  body = body.replace(/<figure([^>]*)[\s\S]*?(?:<img[^>]+src=["']([^"']+)["'][^>]*>)?[\s\S]*?(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/gi, (match, attrs = '', src = '', caption = '') => {
    const attrUrl = String(attrs).match(/data-image-url=["']([^"']+)["']/i)?.[1] || '';
    const imgUrl = src || String(match).match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || '';
    blocks.push({ type: imgUrl || attrUrl ? 'image' : 'visual', url: imgUrl || attrUrl, text: stripTags(caption) });
    return '\n\n';
  });
  body = body
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n### $1\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1\n')
    .replace(/<\/(p|div|section|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  const lines = body.split(/\n+/).map(line => decodeHtml(line).replace(/\s+/g, ' ').trim()).filter(Boolean);
  let table = [];
  for (const line of lines) {
    if (/^\|.+\|$/.test(line)) {
      const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
      if (cells.length && !cells.every(cell => /^-+$/.test(cell))) table.push(cells);
      continue;
    }
    if (table.length) {
      blocks.push({ type: 'table', rows: table });
      table = [];
    }
    if (/^#{2,3}\s+/.test(line)) blocks.push({ type: line.startsWith('###') ? 'h3' : 'h2', text: line.replace(/^#{2,3}\s+/, '') });
    else if (/^[-*•]\s+/.test(line)) blocks.push({ type: 'bullet', text: line.replace(/^[-*•]\s+/, '') });
    else if (/^>\s+/.test(line)) blocks.push({ type: 'quote', text: line.replace(/^>\s+/, '') });
    else blocks.push({ type: 'p', text: line });
  }
  if (table.length) blocks.push({ type: 'table', rows: table });
  return blocks;
}

async function drawCover(doc, ebook, theme) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(theme.primary);
  doc.rect(0, doc.page.height * 0.70, doc.page.width, doc.page.height * 0.30).fill(theme.accent);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(36)
    .text(ebook.title || 'Mi ebook', 58, 145, { width: 260, lineGap: 2 });
  const subtitle = ebook.cover?.subtitle || '';
  if (subtitle) {
    doc.font('Times-Roman').fontSize(15).fillColor('#ffffff')
      .text(subtitle, 58, doc.y + 18, { width: 275, lineGap: 4 });
  }
  const x = 360;
  const y = 122;
  const w = 168;
  const h = 330;
  const coverImage = await fetchImageBuffer(ebook.cover?.imageUrl);
  doc.roundedRect(x, y, w, h, 18).fillOpacity(0.15).fill('#ffffff').fillOpacity(1);
  if (coverImage) {
    try {
      doc.image(coverImage, x, y, { fit: [w, h], align: 'center', valign: 'center' });
    } catch {}
  }
  doc.roundedRect(x + 14, y + 14, w - 28, h - 28, 14).strokeColor('#ffffff').opacity(0.35).stroke().opacity(1);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
    .text('LUMINOUS STUDIO', x + 26, y + h - 54, { width: w - 52, align: 'center' });
}

async function renderChapter(doc, chapter, index, theme) {
  doc.addPage();
  drawHeading(doc, chapter.title || `Seccion ${index + 1}`, theme, 2);
  const blocks = parseBlocks(chapter.body_md || '');
  for (const block of blocks) {
    if (block.type === 'h2') drawHeading(doc, block.text, theme, 2);
    else if (block.type === 'h3') drawHeading(doc, block.text, theme, 3);
    else if (block.type === 'bullet') drawBullet(doc, block.text, theme);
    else if (block.type === 'quote') drawCallout(doc, block.text, theme);
    else if (block.type === 'visual') drawVisual(doc, block.text, theme);
    else if (block.type === 'image') await drawImageOrVisual(doc, block, theme);
    else if (block.type === 'table') drawTable(doc, block.rows, theme);
    else drawText(doc, block.text, { color: theme.fg });
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ebook = req.body?.ebook;
  if (!ebook || !Array.isArray(ebook.chapters)) {
    return res.status(400).json({ error: 'Invalid ebook payload' });
  }

  try {
    const theme = resolveTheme(ebook);
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 42, right: 46, bottom: 46, left: 46 },
      bufferPages: false,
      info: { Title: ebook.title || 'Ebook', Author: 'Luminous Studio' },
    });
    const done = collectPdf(doc);
    await drawCover(doc, ebook, theme);
    for (const [index, chapter] of ebook.chapters.entries()) {
      await renderChapter(doc, chapter, index, theme);
    }
    doc.end();
    const pdf = await done;

    const fileName = filenameFor(ebook.title);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('[generate-ebook-pdf]', error);
    return res.status(500).json({ error: 'Could not generate PDF' });
  }
};
