import { testDatabaseConnection, closeDatabaseConnection } from '../lib/database'

async function testConnection() {
  console.log('🔍 Тестирование подключения к базе данных...')
  
  try {
    const isConnected = await testDatabaseConnection()
    
    if (isConnected) {
      console.log('✅ Подключение к базе данных успешно!')
      console.log('📊 База данных готова к работе')
    } else {
      console.log('❌ Не удалось подключиться к базе данных')
      console.log('💡 Проверьте:')
      console.log('   - Правильность DATABASE_URL в .env файле')
      console.log('   - Доступность Docker хостинга')
      console.log('   - Правильность портов и учетных данных')
    }
  } catch (error) {
    console.error('💥 Критическая ошибка:', error)
  } finally {
    await closeDatabaseConnection()
  }
}

// Запускаем тест
testConnection() 