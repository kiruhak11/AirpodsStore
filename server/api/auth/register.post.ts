import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Для хэширования паролей
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Замените на более надежный секрет

// Схема валидации для данных регистрации
const registerSchema = z.object({
  name: z.string().min(3, 'Имя должно содержать минимум 3 символа'),
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export default defineEventHandler(async (event) => {
  // Получаем данные из запроса
  const body = await readBody(event);

  // Валидируем данные с помощью Zod
  const result = registerSchema.safeParse(body);

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

  const { name, email, password } = body;

  // Проверяем, не существует ли пользователь с таким email
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 422,
      statusMessage: 'User with this email already exists',
    });
  }

  // Хэшируем пароль перед сохранением
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создаем пользователя в базе данных
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // Храним хэшированный пароль
    },
  });

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

  // Можно вернуть что-то вроде JWT токена для сессии, но пока вернем нового пользователя
  return {
    message: 'Успех!',
    data: {
      access_token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    },
  };
});
