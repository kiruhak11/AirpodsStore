import { defineEventHandler, readBody } from 'h3';
import { $fetch } from 'ofetch';

const TELEGRAM_BOT_TOKEN = '7813684314:AAGkfwukYo4dUIAac2Sh2sz0xfGG78rZHlA';
const TELEGRAM_CHAT_IDS = ['641028028', '502773482'];

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return { status: 'error', message: 'Method not allowed' };
  }
  const body = await readBody(event);
  const { name, phone, address, email, cart } = body;

  if (!name || !phone || !address || !email || !cart || !Array.isArray(cart)) {
    return { status: 'error', message: 'Некорректные данные заказа' };
  }

  const productsList = cart.map((item: any) => `• ${item.name} x${item.quantity} — ${item.price}₽`).join('\n');
  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const text = `🛒 Новый заказ с сайта AirPods Store\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email}\n🏠 Адрес: ${address}\n\nТовары:\n${productsList}\n\n💰 Сумма: ${total}₽`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const results = [];
    // eslint-disable-next-line camelcase
    for (const chat_id of TELEGRAM_CHAT_IDS) {
      const payload = {
        // eslint-disable-next-line camelcase
        chat_id,
        text,
        parse_mode: 'Markdown',
      };
      try {
        const response = await $fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        // eslint-disable-next-line camelcase
        results.push({ chat_id, ok: true, response });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Ошибка отправки в Telegram:', err);
        // eslint-disable-next-line camelcase
        results.push({ chat_id, ok: false, error: String(err) });
      }
    }
    const allOk = results.every((r) => r.ok);
    return { status: allOk ? 'ok' : 'error', detail: results };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Ошибка отправки в Telegram:', e);
    return { status: 'error', message: 'Ошибка сервера', error: String(e) };
  }
});
