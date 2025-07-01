import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  // Проверка токена и роли
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const admin = await prisma.user.findUnique({ where: { id: Number(token) } })
  if (!admin || admin.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  const body = await readBody(event)
  const { email, password, fullName, role } = body
  if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'Email и пароль обязательны' })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw createError({ statusCode: 409, statusMessage: 'Пользователь уже существует' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName: fullName || null,
      role: role || 'user',
      createdAt: new Date().toISOString(),
    }
  })
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt
  }
}) 