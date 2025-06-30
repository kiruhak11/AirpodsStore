import { prisma } from '~/lib/database'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    })
    
    return {
      success: true,
      data: products,
      count: products.length
    }
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error)
    
    return {
      success: false,
      message: 'Ошибка при получении продуктов из базы данных',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}) 