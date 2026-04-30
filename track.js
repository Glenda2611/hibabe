// api/track.js — Vercel Serverless Function
// Recebe eventos de analytics e cadastros do site SERPENTTE
// Armazena no KV Store da Vercel (configure ANALYTICS_TOKEN no dashboard)

export default async function handler(req, res) {
  // CORS — permite o site chamar esta API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    const timestamp = new Date().toISOString();

    // IP do visitante (Vercel injeta headers reais)
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      'unknown';

    // User agent
    const ua = req.headers['user-agent'] || 'unknown';

    const event = {
      ...body,
      ip,
      userAgent: ua,
      timestamp,
    };

    // ── OPÇÃO 1: Salvar no Vercel KV (recomendado) ──────────────────────────
    // Ative o KV no dashboard da Vercel e adicione as env vars:
    // KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN
    //
    // import { kv } from '@vercel/kv';
    // const key = `serpentte:${body.type}:${Date.now()}`;
    // await kv.set(key, event, { ex: 60 * 60 * 24 * 90 }); // 90 dias

    // ── OPÇÃO 2: Webhook → Google Sheets / Notion / Airtable ────────────────
    // Se você configurou WEBHOOK_URL no painel da Vercel:
    if (process.env.WEBHOOK_URL) {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    }

    // ── OPÇÃO 3: Log (sempre ativo — visível nos logs da Vercel) ─────────────
    console.log('[SERPENTTE_TRACK]', JSON.stringify(event));

    return res.status(200).json({ ok: true, ts: timestamp });
  } catch (err) {
    console.error('[SERPENTTE_TRACK_ERROR]', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
