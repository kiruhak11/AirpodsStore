import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const user = await prisma.user.findFirst({ where: { sessionToken: String(token) } })
  if (!user || user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  const { id } = getQuery(event)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id обязателен' })

  await prisma.product.delete({ where: { id: Number(id) } })
  return { success: true }
}) 