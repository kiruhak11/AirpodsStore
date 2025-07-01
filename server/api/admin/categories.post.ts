import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const user = await prisma.user.findFirst({ where: { sessionToken: String(token) } })
  if (!user || user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  const body = await readBody(event)
  const { name, description, image, slug } = body
  if (!name || !slug) throw createError({ statusCode: 400, statusMessage: 'name и slug обязательны' })

  const category = await prisma.category.create({
    data: {
      name,
      description: description || null,
      image: image || null,
      slug: slug.toLowerCase().replace(/ /g, '-')
    }
  })
  return category
}) 