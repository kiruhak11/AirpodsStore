import { testDatabaseConnection } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    const isConnected = await testDatabaseConnection()
    
    if (isConnected) {
      return {
        success: true,
        message: 'Подключение к базе данных успешно установлено',
        timestamp: new Date().toISOString()
      }
    } else {
      return {
        success: false,
        message: 'Не удалось подключиться к базе данных',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка при проверке подключения к базе данных',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      timestamp: new Date().toISOString()
    }
  }
}) 