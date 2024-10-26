import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // @ts-ignore
  const { id } = event.context.params;

  // Преобразуем id в число, если оно передается как строка
  const productId = parseInt(id);

  // Проверяем, что id является числом
  if (isNaN(productId)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  // Получаем продукт по id
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  // Проверяем, найден ли продукт
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  return {
    message: 'Успех!',
    data: product,
  };
});
