import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, message } = body

    if (!name || !email || !message) {
      return { success: false, error: 'Все поля обязательны' }
    }

    // Настройки Telegram
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || '').split(',')

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_IDS.length || !TELEGRAM_CHAT_IDS[0]) {
      return { success: false, error: 'Не настроен Telegram: проверьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_IDS' }
    }

    const text = `📝 Новая заявка на сотрудничество\n\n👤 Имя: ${name}\n✉️ Email: ${email}\n💬 Сообщение: ${message}`

    let ok = true
    let errors = []
    for (const chatId of TELEGRAM_CHAT_IDS) {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId.trim(), text })
      })
      if (!res.ok) {
        ok = false
        errors.push(await res.text())
      }
    }

    return { success: ok, errors: ok ? undefined : errors }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) }
  }
}) 