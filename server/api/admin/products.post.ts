import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const user = await prisma.user.findFirst({ where: { sessionToken: String(token) } })
  if (!user || user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  const body = await readBody(event)
  const { name, description, price, image, additionalImages, categoryId, color, model, inStock, specs } = body
  if (!name || price === undefined) throw createError({ statusCode: 400, statusMessage: 'name и price обязательны' })

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price: Number(price),
      image: image || null,
      additionalImages: additionalImages || [],
      categoryId: categoryId ? Number(categoryId) : null,
      color: color || null,
      model: model || null,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      specs: specs || {},
      createdAt: new Date().toISOString(),
    }
  })
  return product
}) 