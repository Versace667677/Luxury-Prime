// Example serverless endpoint for Vercel / Netlify / any Node-based serverless runtime.
// Rename this file to your actual deployment route if needed, for example: /api/send-form.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      text,
      nickname,
      age,
      reason,
      contactType,
      contactValue,
      selectedLanguage,
      timestamp
    } = req.body || {};

    if (!text || !nickname || !age || !reason || !contactType || !contactValue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert bot token here or read it from environment variables.
    // const TELEGRAM_BOT_TOKEN = 'вставити токен бота сюди';
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    // Insert chat id here or read it from environment variables.
    // const TELEGRAM_CHAT_ID = 'вставити chat_id сюди';
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).json({ error: 'Telegram credentials are not configured' });
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();
      return res.status(502).json({ error: 'Telegram API error', details: telegramError });
    }

    return res.status(200).json({
      ok: true,
      received: {
        nickname,
        age,
        reason,
        contactType,
        contactValue,
        selectedLanguage,
        timestamp
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal error', details: error.message });
  }
}
