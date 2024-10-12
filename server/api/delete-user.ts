import { createClient } from '@supabase/supabase-js';
import { H3Event, sendError } from 'h3';

// Замените эти значения на свои
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-supabase-url';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-supabase-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async (event: H3Event) => {
  try {
    const body = await readBody(event);

    console.log('Тело запроса:', body);

    const { userId } = body;

    if (!userId) {
      throw new Error('ID пользователя не предоставлен');
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(`Ошибка при удалении пользователя: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Ошибка на сервере:');
    return sendError(event, new Error('Не удалось удалить аккаунт.'));
  }
};
