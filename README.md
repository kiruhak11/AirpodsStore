# 🎧 LexidShop - Современный магазин наушников

Полноценный коммерческий магазин электроники на Nuxt 3 с современным дизайном, системой скидок и админ-панелью.

## ✨ Особенности

- **Современный дизайн** - Адаптивный макет с темной/светлой темой
- **Prisma ORM** - Типобезопасная работа с базой данных
- **Система скидок** - Промокоды, акции, черная пятница
- **Админ-панель** - Управление товарами, категориями, скидками
- **Корзина и избранное** - С персистентностью данных
- **SEO оптимизация** - Мета-теги, sitemap, robots.txt
- **Платежи** - Интеграция со Stripe и PayPal
- **Анимации** - Плавные микровзаимодействия

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- PostgreSQL
- npm или yarn

### Установка

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd LexidShop
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp .env.example .env
```

Заполните `.env` файл:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lexidshop"

# Supabase (для миграции данных)
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App
NODE_ENV="development"
SITE_URL="https://your-domain.com"
```

4. **Настройте базу данных**
```bash
# Создайте базу данных PostgreSQL
createdb lexidshop

# Примените миграции Prisma
npm run db:push

# Сгенерируйте Prisma клиент
npm run db:generate

# Заполните базу тестовыми данными
npm run db:seed
```

5. **Запустите проект**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

```
LexidShop/
├── components/          # Vue компоненты
│   ├── ui/             # UI компоненты (shadcn)
│   └── ProductCard.vue # Карточка товара
├── composables/        # Composables
│   └── useProducts.ts  # Работа с товарами
├── pages/              # Страницы
│   ├── admin/          # Админ-панель
│   ├── products/       # Страницы товаров
│   └── index.vue       # Главная страница
├── server/             # Серверная часть
│   ├── api/            # API endpoints
│   └── utils/          # Утилиты
├── stores/             # Pinia stores
│   ├── cart.ts         # Корзина
│   ├── wishlist.ts     # Избранное
│   └── modal.ts        # Модальные окна
├── prisma/             # Prisma схема
│   └── schema.prisma   # Схема базы данных
└── scripts/            # Скрипты
    └── migrate-to-prisma.ts # Миграция данных
```

## 🗄️ База данных

### Основные модели

- **User** - Пользователи (админ, менеджер, клиент)
- **Product** - Товары с изображениями, вариантами, характеристиками
- **Category** - Категории товаров (иерархические)
- **Order** - Заказы с элементами и адресами
- **Discount** - Система скидок (промокоды, акции)
- **Review** - Отзывы и рейтинги
- **Payment** - Платежи (Stripe, PayPal)

### Миграция из Supabase

Если у вас есть данные в Supabase:

```bash
# Настройте переменные окружения для Supabase
# Затем запустите миграцию
npm run db:seed
```

## 🎨 Дизайн и UI

### Цветовая схема
- **Основной**: Blue (#3B82F6)
- **Акцент**: Purple (#8B5CF6)
- **Успех**: Green (#10B981)
- **Предупреждение**: Orange (#F59E0B)
- **Ошибка**: Red (#EF4444)

### Темы
- **Светлая** - По умолчанию
- **Темная** - Автоматическое переключение

### Анимации
- Плавные переходы (300ms)
- Hover эффекты
- Масштабирование при наведении
- Fade in/out для модальных окон

## 🔧 API Endpoints

### Товары
- `GET /api/products` - Список товаров с фильтрацией
- `GET /api/products/[slug]` - Детальная информация о товаре

### Категории
- `GET /api/categories` - Список категорий

### Корзина
- `POST /api/cart/add` - Добавить в корзину
- `PUT /api/cart/update` - Обновить количество
- `DELETE /api/cart/remove` - Удалить из корзины

### Заказы
- `POST /api/orders` - Создать заказ
- `GET /api/orders` - Список заказов пользователя

## 🛒 Функциональность

### Корзина
- Добавление/удаление товаров
- Изменение количества
- Персистентность данных
- Быстрый просмотр

### Избранное
- Сохранение товаров
- Синхронизация между устройствами
- Экспорт списка

### Система скидок
- **Промокоды** - Процентные или фиксированные скидки
- **Акции** - "Купи X - получи Y бесплатно"
- **Черная пятница** - Автоматические скидки по расписанию
- **Минимальная сумма** - Скидки от определенной суммы

### Поиск и фильтрация
- Поиск по названию и описанию
- Фильтрация по категориям
- Сортировка по цене, дате, популярности
- Пагинация

## 👨‍💼 Админ-панель

### Управление товарами
- Создание/редактирование товаров
- Загрузка изображений
- Управление вариантами
- Технические характеристики

### Управление категориями
- Создание иерархических категорий
- Настройка порядка отображения
- SEO настройки

### Система скидок
- Создание промокодов
- Настройка акций
- Расписание скидок
- Статистика использования

### Заказы
- Просмотр всех заказов
- Изменение статуса
- Управление доставкой
- Экспорт данных

## 💳 Платежи

### Stripe
- Кредитные карты
- Apple Pay / Google Pay
- Автоматические платежи

### PayPal
- PayPal аккаунты
- Кредитные карты через PayPal
- Мгновенные платежи

## 📧 Email уведомления

- Подтверждение заказа
- Статус доставки
- Промокоды и акции
- Восстановление пароля

## 🔍 SEO

### Мета-теги
- Динамические заголовки
- Описания для каждой страницы
- Open Graph теги
- Twitter Cards

### Sitemap
- Автоматическая генерация
- Динамические URL товаров
- Приоритеты страниц

### Robots.txt
- Настройка индексации
- Запрет админ-панели
- Указание sitemap

## 🧪 Тестирование

### Unit тесты
```bash
npm run test
```

### E2E тесты
```bash
npm run test:e2e
```

### Линтинг
```bash
npm run lint
npm run lint:fix
```

## 🚀 Деплой

### Vercel
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Мониторинг

### Аналитика
- Google Analytics 4
- Hotjar для тепловых карт
- Конверсионная воронка

### Производительность
- Lighthouse CI
- Core Web Vitals
- Оптимизация изображений

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:

- 📧 Email: support@lexidshop.com
- 💬 Discord: [Сервер поддержки](https://discord.gg/lexidshop)
- 📖 Документация: [docs.lexidshop.com](https://docs.lexidshop.com)

---

**Сделано с ❤️ для любителей качественного звука**
