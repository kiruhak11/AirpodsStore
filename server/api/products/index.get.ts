import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const perPage = parseInt(query.perPage as string) || 10;
  const search = (query.search as string) || '';
  const sort = (query.sort as string) || 'asc';

  const skip = (page - 1) * perPage;

  // Параметры запроса для поиска и сортировки
  const where = search
    ? {
        name: {
          contains: search,
          lte: 'insensitive', // регистронезависимый поиск
        },
      }
    : {};

  const orderBy = sort === 'desc' ? { name: 'desc' } : { name: 'asc' };

  // Получаем продукты
  const products = await prisma.product.findMany({
    where,
    skip,
    take: perPage,
    // @ts-ignore
    orderBy,
  });

  // Определяем общее количество продуктов для подсчета страниц
  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalProducts / perPage);

  return {
    message: 'Успех!',
    data: {
      products,
      meta: {
        page,
        perPage,
        totalProducts,
        totalPages,
      },
    },
  };
});
