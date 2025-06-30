import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    console.log('🔄 Инициализация базы данных...')
    
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных установлено')
    
    // Создаем категории
    const categories = await prisma.category.createMany({
      data: [
        {
          name: 'AirPods Pro',
          description: 'Беспроводные наушники с активным шумоподавлением'
        },
        {
          name: 'AirPods',
          description: 'Классические беспроводные наушники'
        },
        {
          name: 'AirPods Max',
          description: 'Премиальные накладные наушники'
        }
      ],
      skipDuplicates: true
    })
    
    console.log(`✅ Создано категорий: ${categories.count}`)
    
    // Создаем тестовые продукты
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'AirPods Pro 2',
          description: 'Новейшие беспроводные наушники с улучшенным шумоподавлением',
          price: 249.99,
          categoryId: 1,
          color: 'Белый',
          model: 'A2931',
          inStock: true,
          additionalImages: [],
          specs: {
            batteryLife: '6 часов',
            noiseCancellation: true,
            waterResistance: 'IPX4'
          }
        },
        {
          name: 'AirPods 3',
          description: 'Беспроводные наушники с пространственным звуком',
          price: 179.99,
          categoryId: 2,
          color: 'Белый',
          model: 'A2565',
          inStock: true,
          additionalImages: [],
          specs: {
            batteryLife: '6 часов',
            spatialAudio: true,
            waterResistance: 'IPX4'
          }
        }
      ],
      skipDuplicates: true
    })
    
    console.log(`✅ Создано продуктов: ${products.count}`)
    
    console.log('🎉 База данных успешно инициализирована!')
    
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем инициализацию
initDatabase() 