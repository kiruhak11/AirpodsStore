import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Для теста userId захардкожен
  const userId = 'test-user-id'
  const cart = await prisma.cart.findMany({
    where: { userId },
    include: { product: true },
  })
  return { cart }
}) 