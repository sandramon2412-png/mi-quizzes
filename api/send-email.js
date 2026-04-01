// Vercel Serverless Function: POST /api/send-email
// Sends quiz result email to lead via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const {
    toEmail, toName,
    quizTitle, quizProduct,
    profileName, profileEmoji, profileDescription, profileRecommendation,
    matchScore,
    fromName,
  } = req.body;

  if (!toEmail || !profileName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const senderName = fromName || 'Luminous Studio';
  const subject = `${profileEmoji || '🎯'} Tu perfil: ${profileName}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f7f2fa;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f2fa;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(139,106,160,0.10);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#8B6AA0,#C4A7D7);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:56px;margin-bottom:12px;">${profileEmoji || '🎯'}</div>
          <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 8px;">${profileName}</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Tu perfil en ${quizTitle || 'el quiz'}</p>
          ${matchScore ? `<div style="margin-top:16px;display:inline-block;background:rgba(255,255,255,0.2);border-radius:50px;padding:6px 18px;color:#fff;font-weight:700;font-size:13px;">✨ ${matchScore}% de compatibilidad</div>` : ''}
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          ${toName ? `<p style="color:#8B6AA0;font-size:15px;margin:0 0 20px;">Hola <strong>${toName}</strong>, estos son tus resultados:</p>` : ''}
          <div style="background:#f7f2fa;border-radius:12px;padding:20px;margin-bottom:20px;">
            <p style="color:#4a3560;font-size:15px;line-height:1.7;margin:0;">${profileDescription || ''}</p>
          </div>
          ${profileRecommendation ? `
          <div style="border-left:3px solid #8B6AA0;padding:16px 20px;margin-bottom:24px;background:#faf7fd;border-radius:0 12px 12px 0;">
            <p style="color:#6b4f8a;font-size:14px;font-weight:600;margin:0 0 6px;">💡 Recomendación para ti</p>
            <p style="color:#4a3560;font-size:14px;line-height:1.6;margin:0;">${profileRecommendation}</p>
          </div>` : ''}
          ${quizProduct ? `
          <div style="text-align:center;margin:28px 0;">
            <p style="color:#8B8B8B;font-size:13px;margin:0 0 16px;">La solución ideal para tu perfil:</p>
            <div style="display:inline-block;background:linear-gradient(135deg,#8B6AA0,#b98fd4);border-radius:50px;padding:14px 32px;">
              <span style="color:#fff;font-weight:800;font-size:15px;">✨ ${quizProduct}</span>
            </div>
          </div>` : ''}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f7f2fa;padding:20px 40px;text-align:center;border-top:1px solid #ede8f5;">
          <p style="color:#b0a0c0;font-size:12px;margin:0;">Enviado por <strong>${senderName}</strong> · Powered by Luminous Studio</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${senderName} <noreply@luminous-studio.com>`,
        to: [toEmail],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Resend error');
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('send-email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
