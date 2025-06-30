import { PrismaClient } from '@prisma/client'

// Создаем глобальный экземпляр PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Используем существующий экземпляр или создаем новый
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// В режиме разработки сохраняем экземпляр глобально
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Функция для проверки подключения к базе данных
export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Успешное подключение к базе данных')
    return true
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error)
    return false
  }
}

// Функция для закрытия подключения
export async function closeDatabaseConnection() {
  await prisma.$disconnect()
  console.log('🔌 Подключение к базе данных закрыто')
}

// Экспортируем типы для использования в других частях приложения
export type { User, Product, Category, Order, OrderItem } from '@prisma/client' 