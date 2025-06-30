# Настройка подключения к базе данных на Docker хостинге

## 📋 Обзор

Этот проект использует MySQL базу данных, развернутую в Docker контейнере, с Prisma ORM для работы с данными.

## 🚀 Быстрый старт

### 1. Создание файла .env

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
DATABASE_URL="mysql://user:password@your-docker-host:3306/airpodsstore"
```

**Замените параметры на ваши реальные данные:**

- `user` - имя пользователя (из docker-compose.yml: MYSQL_USER)
- `password` - пароль пользователя (из docker-compose.yml: MYSQL_PASSWORD)
- `your-docker-host` - IP адрес или домен вашего Docker хостинга
- `3306` - порт MySQL (стандартный)
- `airpodsstore` - имя базы данных (из docker-compose.yml: MYSQL_DATABASE)

### 2. Примеры конфигурации

```env
# Локальный Docker
DATABASE_URL="mysql://user:password@localhost:3306/airpodsstore"

# Удаленный сервер по IP
DATABASE_URL="mysql://user:password@192.168.1.100:3306/airpodsstore"

# Удаленный сервер по домену
DATABASE_URL="mysql://user:password@your-server.com:3306/airpodsstore"
```

## 🔧 Настройка Docker

### Запуск базы данных в Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Запуск только базы данных
docker-compose up -d db

# Просмотр логов
docker-compose logs db
```

### Проверка статуса контейнеров

```bash
docker-compose ps
```

## 🧪 Тестирование подключения

### 1. Тест подключения

```bash
npm run db:test
```

### 2. Проверка через API

```bash
curl -X POST http://localhost:3010/api/database/connection
```

### 3. Проверка через Prisma Studio

```bash
npm run db:studio
```

## 📊 Инициализация базы данных

### 1. Генерация Prisma клиента

```bash
npm run db:generate
```

### 2. Применение миграций

```bash
npm run db:push
```

### 3. Создание тестовых данных

```bash
npm run db:init
```

## 🔍 Устранение неполадок

### Ошибка подключения

1. **Проверьте доступность хоста:**
   ```bash
   ping your-docker-host
   ```

2. **Проверьте порт:**
   ```bash
   telnet your-docker-host 3306
   ```

3. **Проверьте Docker контейнер:**
   ```bash
   docker-compose ps
   docker-compose logs db
   ```

### Ошибка аутентификации

1. **Проверьте учетные данные в .env**
2. **Убедитесь, что пользователь создан в базе данных**
3. **Проверьте права доступа пользователя**

### Ошибка базы данных

1. **Проверьте, что база данных существует:**
   ```bash
   docker-compose exec db mysql -u user -p airpodsstore
   ```

2. **Создайте базу данных, если её нет:**
   ```sql
   CREATE DATABASE IF NOT EXISTS airpodsstore;
   ```

## 📁 Структура файлов

```
├── lib/
│   └── database.ts          # Подключение к базе данных
├── server/api/
│   ├── database/
│   │   └── connection.post.ts  # API для проверки подключения
│   └── products/
│       └── index.get.ts     # API для работы с продуктами
├── scripts/
│   ├── init-database.ts     # Инициализация БД
│   └── test-connection.ts   # Тест подключения
├── prisma/
│   └── schema.prisma        # Схема базы данных
└── .env                     # Переменные окружения
```

## 🔐 Безопасность

1. **Никогда не коммитьте .env файл**
2. **Используйте сильные пароли**
3. **Ограничьте доступ к базе данных по IP**
4. **Регулярно обновляйте зависимости**

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи Docker: `docker-compose logs db`
2. Проверьте подключение: `npm run db:test`
3. Убедитесь в правильности DATABASE_URL
4. Проверьте доступность портов и хоста 