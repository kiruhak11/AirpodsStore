<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ pageTitle }}
      </h1>
      <p class="text-gray-600">
        {{ pageDescription }}
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-8 flex flex-wrap gap-4">
      <button 
        @click="clearFilters"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Все товары
      </button>
      <button 
        v-for="category in categories"
        :key="(category as any).id"
        @click="filterByCategory((category as any).slug)"
        :class="[
          'px-4 py-2 rounded-lg transition-colors',
          selectedCategory === (category as any).slug
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ (category as any).name }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center min-h-96">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>

    <!-- Products Grid -->
    <div v-else-if="products && products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="(product as any).id"
        :product="product as any"
      />
    </div>

    <!-- No Products -->
    <div v-else class="text-center py-12">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
      <p class="text-gray-600 mb-4">Попробуйте изменить фильтры или вернуться позже</p>
      <button 
        @click="clearFilters"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Показать все товары
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'

// Get query parameters
const route = useRoute()
const router = useRouter()

const category = route.query.category as string
const isNew = route.query.new === 'true'
const isBestSeller = route.query.bestSeller === 'true'

// Computed properties
const selectedCategory = computed(() => category)

// Load data
const { data: categoriesResponse } = await useFetch('/api/categories')
const { data: productsResponse, pending } = await useFetch('/api/products', {
  query: {
    category: category || undefined,
    new: isNew || undefined,
    bestSeller: isBestSeller || undefined
  }
})

// Computed properties with proper type checking
const categories = computed(() => {
  if (!categoriesResponse.value) return []
  if ('success' in categoriesResponse.value && !categoriesResponse.value.success) return []
  return Array.isArray(categoriesResponse.value) ? categoriesResponse.value : []
})

const products = computed(() => {
  if (!productsResponse.value) return []
  if ('success' in productsResponse.value && !productsResponse.value.success) return []
  return Array.isArray(productsResponse.value) ? productsResponse.value : []
})

const pageTitle = computed(() => {
  if (isNew) return 'Новинки'
  if (isBestSeller) return 'Хиты продаж'
  if (category) {
    const cat = categories.value.find((c: any) => (c as any).slug === category)
    return cat ? (cat as any).name : 'Товары'
  }
  return 'Все товары'
})

const pageDescription = computed(() => {
  if (isNew) return 'Самые свежие поступления в нашем магазине'
  if (isBestSeller) return 'Самые популярные товары среди наших покупателей'
  if (category) {
    const cat = categories.value.find((c: any) => (c as any).slug === category)
    return cat ? `Товары в категории "${(cat as any).name}"` : 'Товары'
  }
  return 'Широкий ассортимент качественных товаров'
})

// Methods
const filterByCategory = (slug: string) => {
  router.push({
    path: '/products',
    query: { category: slug }
  })
}

const clearFilters = () => {
  router.push('/products')
}

// SEO
useHead(() => ({
  title: `${pageTitle.value} - LexidShop`,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: `${pageTitle.value} - LexidShop` },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `https://lexid.shop/products${route.fullPath !== '/products' ? route.fullPath : ''}` }
  ]
}))
</script> 