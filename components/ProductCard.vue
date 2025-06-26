<template>
  <div 
    class="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
    :class="{ 'ring-2 ring-blue-500': isInCart }"
  >
    <!-- Badge для новинок/скидок -->
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <div 
        v-if="product.isNew" 
        class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
      >
        NEW
      </div>
      <div 
        v-if="product.isFeatured" 
        class="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
      >
        FEATURED
      </div>
      <div 
        v-if="product.isBestSeller" 
        class="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
      >
        BEST SELLER
      </div>
    </div>

    <!-- Кнопка быстрого просмотра -->
    <div class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        @click="openQuickView"
        class="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Icon name="lucide:eye" class="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>
    </div>

    <!-- Изображение товара -->
    <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
      <NuxtImg
        :src="primaryImage?.url || '/images/placeholder.jpg'"
        :alt="primaryImage?.alt || product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
        sizes="sm:100vw md:50vw lg:400px"
      />
      
      <!-- Overlay с кнопками действий -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            @click="addToCart"
            :disabled="isInCart"
            class="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Icon 
              :name="isInCart ? 'lucide:check' : 'lucide:shopping-cart'" 
              class="w-5 h-5 text-gray-600 dark:text-gray-300" 
            />
          </button>
          <button 
            @click="toggleWishlist"
            class="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon 
              :name="isInWishlist ? 'lucide:heart' : 'lucide:heart'" 
              :class="[
                'w-5 h-5 transition-colors',
                isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Информация о товаре -->
    <div class="p-4">
      <!-- Категория -->
      <div class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
        {{ product.category.name }}
      </div>

      <!-- Название товара -->
      <NuxtLink 
        :to="`/products/${product.slug}`"
        class="block"
      >
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- Рейтинг -->
      <div class="flex items-center gap-1 mt-2">
        <div class="flex">
          <Icon 
            v-for="star in 5" 
            :key="star"
            :name="star <= averageRating ? 'lucide:star' : 'lucide:star'" 
            :class="[
              'w-3 h-3',
              star <= averageRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
            ]"
          />
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ({{ product._count && typeof product._count.reviews === 'number' ? product._count.reviews : 0 }})
        </span>
      </div>

      <!-- Цена -->
      <div class="flex items-center gap-2 mt-2">
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          ${{ formatPrice(product.price) }}
        </span>
        <span 
          v-if="product.comparePrice && product.comparePrice > product.price"
          class="text-sm text-gray-500 dark:text-gray-400 line-through"
        >
          ${{ formatPrice(product.comparePrice) }}
        </span>
        <span 
          v-if="product.comparePrice && product.comparePrice > product.price"
          class="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-1 py-0.5 rounded"
        >
          -{{ Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) }}%
        </span>
      </div>

      <!-- Скидки -->
      <div v-if="activeDiscounts && activeDiscounts.length > 0" class="mt-2">
        <div 
          v-for="discount in activeDiscounts" 
          :key="discount.id"
          class="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded-full inline-block mr-1"
        >
          {{ discount.discount.name }}
        </div>
      </div>

      <!-- Статус наличия -->
      <div class="mt-2">
        <span 
          :class="[
            'text-xs px-2 py-1 rounded-full',
            product.stockQuantity > 0 
              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
          ]"
        >
          {{ product.stockQuantity > 0 ? 'В наличии' : 'Нет в наличии' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

interface Props {
  product: Product
}

const props = defineProps<Props>()

// Computed свойства
const primaryImage = computed(() => {
  if (!props.product.images || !Array.isArray(props.product.images) || props.product.images.length === 0) return null
  return props.product.images.find(img => img.isPrimary) || props.product.images[0]
})

const averageRating = computed(() => {
  if (!props.product.reviews || !Array.isArray(props.product.reviews) || props.product.reviews.length === 0) return 0
  const total = props.product.reviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round(total / props.product.reviews.length)
})

const activeDiscounts = computed(() =>
  Array.isArray(props.product.productDiscounts)
    ? props.product.productDiscounts.filter(pd => pd.discount && pd.discount.isActive)
    : []
)

// Store
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// Состояние
const isInCart = computed(() => 
  cartStore.items.some(item => item.productId === props.product.id)
)

const isInWishlist = computed(() => 
  wishlistStore.items.some(item => item.id === props.product.id)
)

// Методы
const formatPrice = (price: number) => {
  if (typeof price !== 'number' || isNaN(price)) return '—'
  return price.toFixed(2)
}

const addToCart = () => {
  if (!isInCart.value) {
    cartStore.addItem({
      productId: props.product.id,
      quantity: 1,
      product: props.product
    })
    
    // Показываем уведомление
    useToast().add({
      title: 'Товар добавлен в корзину',
      description: props.product.name,
      icon: 'lucide:check',
      color: 'green'
    })
  }
}

const toggleWishlist = () => {
  if (isInWishlist.value) {
    wishlistStore.removeItem(props.product.id)
    useToast().add({
      title: 'Удалено из избранного',
      description: props.product.name,
      icon: 'lucide:heart',
      color: 'gray'
    })
  } else {
    wishlistStore.addItem(props.product)
    useToast().add({
      title: 'Добавлено в избранное',
      description: props.product.name,
      icon: 'lucide:heart',
      color: 'red'
    })
  }
}

const openQuickView = () => {
  // Открываем модальное окно быстрого просмотра
  const modalStore = useModalStore()
  modalStore.open('quick-view', { product: props.product })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
