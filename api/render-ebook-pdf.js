const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const filenameFor = (title = 'ebook') => {
  const clean = String(title).replace(/[\\/:*?"<>|]+/g, '').trim() || 'ebook';
  return `${clean}.pdf`;
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const html = req.body?.html;
  const filename = filenameFor(req.body?.filename || req.body?.title || 'ebook');
  if (!html || typeof html !== 'string' || html.length < 100) {
    return res.status(400).json({ error: 'Invalid html payload' });
  }

  let browser;
  try {
    const executablePath = await chromium.executablePath();
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 },
      executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    // 'load' waits for CSS/images without requiring zero-idle connections.
    // 'networkidle0' times out when Google Fonts CDN is slow in Lambda.
    await page.setContent(html, { waitUntil: 'load', timeout: 20000 });
    await page.emulateMediaType('print');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(Buffer.from(pdf));
  } catch (error) {
    console.error('[render-ebook-pdf]', error);
    return res.status(500).json({ error: 'Could not render PDF' });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
};
