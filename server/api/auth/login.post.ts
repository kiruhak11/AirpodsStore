import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Замените на более надежный секрет

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Валидируем данные с помощью Zod
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));

    throw createError({
      statusCode: 422,
      statusMessage: 'Ошибка валидации данных',
      data: {
        errors: [...errors],
      },
    });
  }

  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
});
