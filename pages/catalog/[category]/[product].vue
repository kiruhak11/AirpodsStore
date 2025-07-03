<template>
  <div class="product-detail-page">
    <!-- Breadcrumbs -->
    <nav class="product-detail-page__breadcrumbs">
      <NuxtLink to="/" class="breadcrumb-link">Главная</NuxtLink>
      <span class="breadcrumb-separator">/</span>
      <NuxtLink to="/catalog" class="breadcrumb-link">Каталог</NuxtLink>
      <span class="breadcrumb-separator">/</span>
      <NuxtLink :to="`/catalog/${category?.slug}`" class="breadcrumb-link">
        {{ category?.name || 'Категория' }}
      </NuxtLink>
      <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">{{ product?.name || 'Товар' }}</span>
    </nav>

    <!-- Loading State -->
    <div v-if="pending" class="product-loading">
      <div class="product-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-price"></div>
          <div class="skeleton-description"></div>
        </div>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-detail-page__content">
      <div class="product-gallery">
        <!-- Main Image -->
        <div class="product-gallery__main">
          <img
            :src="currentImage || product.image"
            :alt="product?.name"
            class="product-gallery__main-image"
            loading="lazy"
          />
        </div>

        <!-- Thumbnails for additionalImages -->
        <div v-if="galleryImages.length > 1" class="product-gallery__thumbnails">
          <button
            v-for="(img, idx) in galleryImages"
            :key="idx"
            @click="currentImage = img"
            class="product-gallery__thumbnail"
            :class="{ 'product-gallery__thumbnail--active': currentImage === img }"
          >
            <img
              :src="img"
              :alt="`${product?.name} фото ${idx+1}`"
              class="product-gallery__thumbnail-image"
              loading="lazy"
            />
          </button>
        </div>
      </div>

      <div class="product-info">
        <!-- Category -->
        <div class="product-category">
          {{ product?.category?.name || 'Без категории' }}
        </div>

        <!-- Title -->
        <h1 class="product-title">{{ product?.name }}</h1>

        <!-- Rating -->
        <div class="product-rating">
          <div class="product-stars">
            <Icon 
              v-for="star in 5" 
              :key="star"
              :icon="star <= averageRating ? 'lucide:star' : 'lucide:star'" 
              class="product-star"
              :class="{ 'product-star--filled': star <= averageRating }"
            />
          </div>
          <span class="product-reviews-count">
            ({{ product?._count?.reviews || 0 }} отзывов)
          </span>
        </div>

        <!-- Price -->
        <div class="product-price">
          <span class="product-price__current">
            ${{ formatPrice(product?.price) }}
          </span>
          <span 
            v-if="product?.comparePrice && product?.comparePrice > product?.price"
            class="product-price__compare"
          >
            ${{ formatPrice(product?.comparePrice) }}
          </span>
          <span 
            v-if="product?.comparePrice && product?.comparePrice > product?.price"
            class="product-price__discount"
          >
            -{{ Math.round(((product?.comparePrice - product?.price) / product?.comparePrice) * 100) }}%
          </span>
        </div>

        <!-- Stock Status -->
        <div class="product-stock">
          <span 
            class="product-stock__badge"
            :class="{ 'product-stock__badge--available': product?.inStock }"
          >
            {{ product?.inStock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </div>

        <!-- Description -->
        <div class="product-description">
          <h3 class="product-description__title">Описание</h3>
          <p class="product-description__text">
            {{ product?.description || 'Описание товара отсутствует' }}
          </p>
        </div>

        <!-- Actions -->
        <div class="product-actions">
          <div class="product-buttons">
            <button 
              @click="addToCart"
              :disabled="!product?.inStock || isInCart"
              class="product-btn product-btn--primary"
              :class="{ 'product-btn--disabled': !product?.inStock || isInCart }"
            >
              <Icon 
                :icon="isInCart ? 'lucide:check' : 'lucide:shopping-cart'" 
                class="product-btn-icon" 
              />
              {{ isInCart ? 'В корзине' : 'Добавить в корзину' }}
            </button>

            <button 
              @click="toggleWishlist"
              class="product-btn product-btn--secondary"
              :class="{ 'product-btn--active': isInWishlist }"
            >
              <Icon 
                :icon="isInWishlist ? 'lucide:heart' : 'lucide:heart'" 
                class="product-btn-icon"
              />
              {{ isInWishlist ? 'В избранном' : 'В избранное' }}
            </button>
          </div>
        </div>

        <!-- Specifications -->
        <div v-if="product?.specs && ((Array.isArray(product.specs) && product.specs.length > 0) || (typeof product.specs === 'object' && Object.keys(product.specs).length > 0))" class="product-specs">
          <h3 class="product-specs__title">Характеристики</h3>
          <div class="product-specs__list">
            <template v-if="Array.isArray(product.specs)">
              <div 
                v-for="(spec, idx) in product.specs" 
                :key="spec.id || idx"
                class="product-specs__item"
              >
                <span class="product-specs__name">{{ spec.name }}</span>
                <span class="product-specs__value">{{ spec.value }}</span>
              </div>
            </template>
            <template v-else>
              <div v-for="(value, key) in product.specs" :key="key" class="product-specs__item">
                <span class="product-specs__name">{{ key }}</span>
                <span class="product-specs__value">{{ value }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="product-error">
      <div class="error-icon">❌</div>
      <h2 class="error-title">Товар не найден</h2>
      <p class="error-description">
        К сожалению, запрашиваемый товар не существует или был удален
      </p>
      <NuxtLink to="/catalog" class="error-btn">
        Вернуться в каталог
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Category } from '~/composables/useProducts'
import { useToast } from '~/composables/useToast'
import { Icon } from '@iconify/vue'

const route = useRoute()
const categorySlug = route.params.category as string
const productSlug = route.params.product as string

// Data fetching with proper error handling
const { data: product, pending } = await useAsyncData(
  `product-${productSlug}`,
  async () => {
    try {
      const response = await $fetch(`/api/products/${productSlug}`)
      // Handle different response formats
      const productData = Array.isArray(response) ? response[0] : response
      // Парсим specs, если это строка
      if (productData && typeof productData.specs === 'string') {
        try {
          productData.specs = JSON.parse(productData.specs)
        } catch (e) {
          productData.specs = []
        }
      }
      return productData as Product
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }
)

const { data: category } = await useAsyncData(
  `category-${categorySlug}`,
  async () => {
    try {
      const response = await $fetch(`/api/categories?slug=${categorySlug}`)
      const categoryData = Array.isArray(response) ? response[0] : response
      return categoryData as Category
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }
)

// Meta - moved after data fetching
useHead({
  title: computed(() => `${product.value?.name || 'Товар'} - LexidShop`),
  meta: [
    { name: 'description', content: computed(() => product.value?.description || 'Описание товара') }
  ]
})

// State
const currentImage = ref<string | null>(null)

// Computed
const averageRating = computed(() => {
  if (!product.value?.reviews || !Array.isArray(product.value.reviews) || product.value.reviews.length === 0) return 0
  const total = product.value.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0)
  return Math.round(total / product.value.reviews.length)
})

// Store
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isInCart = computed(() => 
  cartStore.items.some(item => item.productId === product.value?.id)
)

const isInWishlist = computed(() => 
  wishlistStore.items.some(item => item.product.id === product.value?.id)
)

// Methods
const formatPrice = (price: number) => {
  if (typeof price !== 'number' || isNaN(price)) return '—'
  return price.toFixed(2)
}

const addToCart = () => {
  if (!product.value || !product.value.inStock || isInCart.value) return
  
  cartStore.addItem({
    productId: product.value.id,
    quantity: 1,
    product: product.value
  })
  
  useToast().add({
    title: 'Товар добавлен в корзину',
    description: product.value.name,
    icon: 'lucide:check',
    color: 'green'
  })
}

const toggleWishlist = () => {
  if (!product.value) return
  
  wishlistStore.toggleItem(product.value)
  
  if (isInWishlist.value) {
    useToast().add({
      title: 'Удалено из избранного',
      description: product.value.name,
      icon: 'lucide:heart',
      color: 'gray'
    })
  } else {
    useToast().add({
      title: 'Добавлено в избранное',
      description: product.value.name,
      icon: 'lucide:heart',
      color: 'red'
    })
  }
}

// Обработка additionalImages (строка или массив)
const galleryImages = computed(() => {
  if (!product.value) return []
  let images: string[] = []
  if (product.value.image) images.push(product.value.image)
  let additional = product.value.additionalImages
  if (typeof additional === 'string') {
    try { additional = JSON.parse(additional) } catch { additional = [] }
  }
  if (Array.isArray(additional)) {
    images.push(...additional.filter(Boolean))
  }
  return images
})

watchEffect(() => {
  if (galleryImages.value.length > 0) {
    currentImage.value = galleryImages.value[0]
  }
})
</script>

<style scoped lang="scss">
.product-detail-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: 2rem 0;
}

.product-detail-page__breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  
  .breadcrumb-link {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--transition-main);
    
    &:hover {
      color: var(--color-primary);
    }
  }
  
  .breadcrumb-separator {
    color: var(--color-text-secondary);
  }
  
  .breadcrumb-current {
    color: var(--color-text);
    font-weight: 500;
  }
}

.product-loading {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.product-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  .skeleton-image {
    height: 500px;
    background: linear-gradient(90deg, var(--color-bg) 25%, var(--color-card) 50%, var(--color-bg) 75%);
    background-size: 200px 100%;
    animation: skeleton 1.5s infinite linear;
    border-radius: 1rem;
  }
  
  .skeleton-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .skeleton-title {
    height: 2rem;
    background: linear-gradient(90deg, var(--color-bg) 25%, var(--color-card) 50%, var(--color-bg) 75%);
    background-size: 200px 100%;
    animation: skeleton 1.5s infinite linear;
    border-radius: 0.5rem;
  }
  
  .skeleton-price {
    height: 1.5rem;
    width: 50%;
    background: linear-gradient(90deg, var(--color-bg) 25%, var(--color-card) 50%, var(--color-bg) 75%);
    background-size: 200px 100%;
    animation: skeleton 1.5s infinite linear;
    border-radius: 0.5rem;
  }
  
  .skeleton-description {
    height: 4rem;
    background: linear-gradient(90deg, var(--color-bg) 25%, var(--color-card) 50%, var(--color-bg) 75%);
    background-size: 200px 100%;
    animation: skeleton 1.5s infinite linear;
    border-radius: 0.5rem;
  }
}

@keyframes skeleton {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.product-detail-page__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.product-gallery {
  &__main {
    margin-bottom: 1rem;
  }
  
  &__main-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 1rem;
    background: var(--color-bg);
  }
  
  &__thumbnails {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  &__thumbnail {
    width: 80px;
    height: 80px;
    border: 2px solid transparent;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-main);
    background: var(--color-bg);
    
    &:hover {
      border-color: var(--color-primary);
    }
    
    &--active {
      border-color: var(--color-primary);
    }
  }
  
  &__thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-category {
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin: 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-stars {
  display: flex;
}

.product-star {
  width: 1.25rem;
  height: 1.25rem;
  color: #d1d5db;
  transition: color var(--transition-main);
  
  &--filled {
    color: #fbbf24;
    fill: #fbbf24;
  }
}

.product-reviews-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  
  &__current {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }
  
  &__compare {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    text-decoration: line-through;
  }
  
  &__discount {
    font-size: 0.875rem;
    background: var(--color-error);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
  }
}

.product-stock {
  &__badge {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background: var(--color-error);
    color: white;
    font-weight: 500;
    
    &--available {
      background: var(--color-success);
    }
  }
}

.product-description {
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }
  
  &__text {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-main);
  
  &--primary {
    background: var(--color-primary);
    color: white;
    
    &:hover:not(.product-btn--disabled) {
      background: var(--color-primary-hover);
      transform: translateY(-1px);
    }
  }
  
  &--secondary {
    background: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    
    &:hover {
      background: var(--color-border);
    }
    
    &.product-btn--active {
      background: var(--color-error);
      color: white;
      border-color: var(--color-error);
    }
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
}

.product-btn-icon {
  width: 1rem;
  height: 1rem;
}

.product-specs {
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
  
  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  &__item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--color-bg);
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
  }
  
  &__name {
    font-weight: 500;
    color: var(--color-text);
  }
  
  &__value {
    color: var(--color-text-secondary);
  }
}

.product-error {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.error-description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.error-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-main);
  
  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
  }
}

// Responsive
@media (max-width: 1024px) {
  .product-detail-page__content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-skeleton {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 1rem 0;
  }
  
  .product-detail-page__content {
    padding: 0 0.5rem;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .product-price__current {
    font-size: 1.5rem;
  }
  
  .product-buttons {
    flex-direction: column;
  }
  
  .product-gallery__main-image {
    height: 300px;
  }
}
</style> 