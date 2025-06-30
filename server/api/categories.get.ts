import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.$queryRawUnsafe(`
      SELECT * FROM category ORDER BY id ASC
    `) as any[]

    // Приводим id к строке, если это BigInt
    const formattedCategories = categories.map((cat: any) => ({
      ...cat,
      id: typeof cat.id === 'bigint' ? cat.id.toString() : cat.id,
      parentId: typeof cat.parentId === 'bigint' ? cat.parentId.toString() : cat.parentId
    }))

    return formattedCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
})