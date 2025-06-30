<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="flex justify-center items-center min-h-96">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-8">
      <h1 class="text-2xl font-bold text-red-600 mb-4">Товар не найден</h1>
      <p class="text-gray-600 mb-4">{{ error.message }}</p>
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 underline">
        Вернуться на главную
      </NuxtLink>
    </div>
    
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Галерея изображений -->
      <div class="space-y-4">
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            :src="product.image || '/images/placeholder.jpg'"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Информация о товаре -->
      <div class="space-y-6">
        <!-- Категория -->
        <div class="text-sm text-blue-600 font-medium">
          {{ product.category?.name || 'Без категории' }}
        </div>

        <!-- Название -->
        <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>

        <!-- Цена -->
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span class="text-3xl font-bold text-gray-900">
              ${{ formatPrice(Number(product.price)) }}
            </span>
          </div>
        </div>

        <!-- Статус наличия -->
        <div class="flex items-center gap-2">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              product.in_stock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ product.in_stock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </div>

        <!-- Описание -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Описание</h3>
          <p class="text-gray-600 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Кнопки действий -->
        <div class="flex gap-4">
          <button 
            @click="addToCart"
            :disabled="!product.in_stock"
            class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Добавить в корзину
          </button>
        </div>

        <!-- Характеристики -->
        <div v-if="product.color || product.model" class="space-y-2">
          <h3 class="text-lg font-semibold">Характеристики</h3>
          <div class="space-y-1">
            <div v-if="product.color" class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Цвет</span>
              <span class="font-medium">{{ product.color }}</span>
            </div>
            <div v-if="product.model" class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Модель</span>
              <span class="font-medium">{{ product.model }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Получаем параметр из URL (может быть slug или id)
const route = useRoute()
const slug = route.params.slug as string

// Загружаем данные о продукте
const { data: response, pending, error } = await useFetch(`/api/products/${slug}`)

// Computed свойства
const product = computed(() => {
  if (!response.value) return null
  // Handle both possible response structures
  if ('success' in response.value && !response.value.success) return null
  return (response.value as any).product || response.value
})

// Методы
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const addToCart = () => {
  // TODO: Implement cart functionality
  console.log('Add to cart:', product.value)
}

// SEO
useHead(() => ({
  title: product.value ? `${product.value.name} - LexidShop` : 'Товар не найден - LexidShop',
  meta: [
    { name: 'description', content: product.value?.description || 'Товар не найден' },
    { property: 'og:title', content: product.value ? product.value.name : 'Товар не найден' },
    { property: 'og:description', content: product.value?.description || 'Товар не найден' },
    { property: 'og:type', content: 'product' },
    { property: 'og:url', content: `https://lexid.shop/products/${slug}` }
  ]
}))
</script> 