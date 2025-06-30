import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const products = await prisma.$queryRawUnsafe(`
      SELECT 
        id,
        name,
        description,
        price,
        image,
        additionalImages,
        categoryId,
        color,
        model,
        inStock,
        specs
      FROM product
      ORDER BY id DESC
    `) as any[]

    // Приводим id и categoryId к строке, если это BigInt
    const formattedProducts = products.map((product: any) => ({
      id: typeof product.id === 'bigint' ? product.id.toString() : product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      image: product.image,
      additionalImages: product.additionalImages,
      categoryId: typeof product.categoryId === 'bigint' ? product.categoryId.toString() : product.categoryId,
      color: product.color,
      model: product.model,
      inStock: product.inStock,
      specs: product.specs
    }))

    return formattedProducts
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}) 