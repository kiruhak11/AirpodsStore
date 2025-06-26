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

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        variants: true,
        specifications: {
          orderBy: { sortOrder: 'asc' }
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        productDiscounts: {
          include: {
            discount: true
          }
        },
        _count: {
          select: { reviews: true }
        }
      }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Получаем средний рейтинг
    const avgRating = await prisma.review.aggregate({
      where: {
        productId: product.id,
        isActive: true
      },
      _avg: {
        rating: true
      }
    })

    // Получаем рекомендуемые товары (из той же категории)
    const recommendedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        },
        category: true
      },
      take: 4
    })

    return {
      product: {
        ...product,
        averageRating: avgRating._avg.rating || 0
      },
      recommendedProducts
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 