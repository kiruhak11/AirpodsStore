import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Проверка токена и роли
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const user = await prisma.user.findUnique({ where: { id: Number(token) } })
  if (!user || user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  // Получаем всех пользователей
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true
    },
    orderBy: { id: 'asc' }
  })
  return users
}) 