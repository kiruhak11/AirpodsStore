import { prisma } from '../../utils/prisma'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const categoryId = event.context.query?.categoryId || event.node.req?.url?.split('categoryId=')[1]
  const where = categoryId ? { categoryId: Number(categoryId) } : undefined
  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  return products
}) 