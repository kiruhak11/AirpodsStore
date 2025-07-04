import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categorySlug = query.category as string

    let sqlQuery = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.additionalImages,
        p.categoryId,
        p.color,
        p.model,
        p.inStock,
        p.specs,
        p.createdAt,
        c.id as category_id,
        c.name as category_name,
        c.description as category_description,
        c.image as category_image,
        c.slug as category_slug
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
    `

    if (categorySlug) {
      sqlQuery += ` WHERE c.slug = '${categorySlug}'`
    }

    sqlQuery += ` ORDER BY p.id DESC`

    const products = await prisma.$queryRawUnsafe(sqlQuery) as any[]

    // Функция для генерации slug из названия
    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    // Приводим id и categoryId к числу, если это BigInt
    const formattedProducts = products.map((product: any) => ({
      id: typeof product.id === 'bigint' ? Number(product.id) : Number(product.id),
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      image: product.image,
      additionalImages: product.additionalImages,
      categoryId: typeof product.categoryId === 'bigint' ? Number(product.categoryId) : product.categoryId,
      color: product.color,
      model: product.model,
      inStock: product.inStock,
      specs: product.specs,
      createdAt: product.createdAt,
      slug: generateSlug(product.name),
      category: product.category_id ? {
        id: typeof product.category_id === 'bigint' ? Number(product.category_id) : Number(product.category_id),
        name: product.category_name,
        description: product.category_description,
        image: product.category_image,
        slug: product.category_slug
      } : null
    }))

    return formattedProducts
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}) 