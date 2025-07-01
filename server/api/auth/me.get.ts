import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Можно получать токен из query, header или cookie
    const token = getQuery(event).token || event.req.headers['x-auth-token']
    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
    }
    const user = await prisma.user.findUnique({ where: { sessionToken: String(token) } })
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Пользователь не найден' })
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  } catch (error) {
    console.error('Me error:', error)
    throw error
  }
}) 