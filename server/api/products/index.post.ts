import { prisma } from '../../utils/prisma'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const product = await prisma.product.create({ data: {
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
  }})
  return product
}) 