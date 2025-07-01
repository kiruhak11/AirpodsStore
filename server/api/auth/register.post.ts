import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, fullName } = body

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email и пароль обязательны' })
    }

    // Проверка, что пользователь уже существует
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'Пользователь уже существует' })
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: fullName || null,
        role: 'user',
        createdAt: new Date().toISOString(),
      }
    })

    // Можно возвращать только id/email/role
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}) 