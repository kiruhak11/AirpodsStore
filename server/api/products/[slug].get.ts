import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product slug is required'
      })
    }

    // Функция для генерации slug из названия (должна совпадать с той, что в products.get.ts)
    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    // Получаем все товары и ищем по slug
    const products = await prisma.$queryRawUnsafe(`
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
      ORDER BY p.id DESC
    `) as any[]

    // Ищем товар по slug
    const product = products.find((p: any) => {
      const productSlug = generateSlug(p.name)
      return productSlug === slug
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Форматируем товар
    const formattedProduct = {
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
    }

    return formattedProduct
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 