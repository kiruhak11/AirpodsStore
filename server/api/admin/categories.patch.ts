import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const user = await prisma.user.findFirst({ where: { sessionToken: String(token) } })
  if (!user || user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  const body = await readBody(event)
  const { id, name, description, image, slug } = body
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id обязателен' })

  const data: any = {}
  if (name) data.name = name
  if (description !== undefined) data.description = description
  if (image !== undefined) data.image = image
  if (slug) data.slug = slug

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data
  })
  return category
}) 