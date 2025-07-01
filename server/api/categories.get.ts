import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const slug = query.slug as string

    let sqlQuery = `SELECT * FROM category`
    
    if (slug) {
      sqlQuery += ` WHERE slug = '${slug}'`
    }
    
    sqlQuery += ` ORDER BY id ASC`

    const categories = await prisma.$queryRawUnsafe(sqlQuery) as any[]

    // Приводим id к числу, если это BigInt
    const formattedCategories = categories.map((cat: any) => ({
      ...cat,
      id: typeof cat.id === 'bigint' ? Number(cat.id) : Number(cat.id),
      parentId: typeof cat.parentId === 'bigint' ? Number(cat.parentId) : cat.parentId
    }))

    // Если запрашивается конкретная категория, возвращаем первый элемент
    if (slug) {
      return formattedCategories[0] || null
    }

    return formattedCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
})