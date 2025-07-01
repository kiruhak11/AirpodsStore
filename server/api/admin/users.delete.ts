import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Проверка токена и роли
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const admin = await prisma.user.findUnique({ where: { id: Number(token) } })
  if (!admin || admin.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  const { id } = await readBody(event)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id обязателен' })

  await prisma.user.delete({ where: { id: Number(id) } })
  return { success: true }
}) 