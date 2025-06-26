import { prisma } from '../../utils/prisma'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.id) throw createError({ statusCode: 400, statusMessage: 'ID required' })
  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      additionalImages: body.additionalImages,
      categoryId: body.categoryId,
      color: body.color,
      model: body.model,
      inStock: body.inStock,
      specs: body.specs,
    },
  })
  return product
}) 