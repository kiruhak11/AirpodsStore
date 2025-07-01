<template>
  <div 
    class="product-card"
    :class="{ 'product-card--in-cart': isInCart }"
  >
    <!-- Badge для новинок/скидок -->
    <div class="product-card__badges">
      <div 
        v-if="product.isNew" 
        class="product-card__badge product-card__badge--new"
      >
        NEW
      </div>
      <div 
        v-if="product.isFeatured" 
        class="product-card__badge product-card__badge--featured"
      >
        FEATURED
      </div>
      <div 
        v-if="product.isBestSeller" 
        class="product-card__badge product-card__badge--best-seller"
      >
        BEST SELLER
      </div>
    </div>

    <!-- Кнопка быстрого просмотра -->
    <div class="product-card__quick-view">
      <button 
        @click="openQuickView"
        class="product-card__quick-view-btn"
      >
        <Icon name="lucide:eye" class="product-card__quick-view-icon" />
      </button>
    </div>

    <!-- Изображение товара -->
    <div class="product-card__image-container">
      <PlaceholderImage
        :src="primaryImage?.url || product.image"
        :alt="primaryImage?.alt || product.name"
        :width="400"
        :height="400"
        image-class="product-card__image"
      />
      
      <!-- Overlay с кнопками действий -->
      <div class="product-card__overlay">
        <div class="product-card__actions">
          <button 
            @click="addToCart"
            :disabled="isInCart"
            class="product-card__action-btn product-card__action-btn--cart"
            :class="{ 'product-card__action-btn--disabled': isInCart }"
          >
            <Icon 
              :name="isInCart ? 'lucide:check' : 'lucide:shopping-cart'" 
              class="product-card__action-icon" 
            />
          </button>
          <button 
            @click="toggleWishlist"
            class="product-card__action-btn product-card__action-btn--wishlist"
            :class="{ 'product-card__action-btn--active': isInWishlist }"
          >
            <Icon 
              :name="isInWishlist ? 'lucide:heart' : 'lucide:heart'" 
              class="product-card__action-icon"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Информация о товаре -->
    <div class="product-card__content">
      <!-- Категория -->
      <div class="product-card__category">
        {{ product.category?.name || 'Без категории' }}
      </div>

      <!-- Название товара -->
      <ClientOnly>
        <NuxtLink 
          v-if="product.id"
          :to="`/catalog/${product.category?.slug || 'all'}/${product.slug || product.id}`"
          class="product-card__title-link"
        >
          <h3 class="product-card__title">
            {{ product.name }}
          </h3>
        </NuxtLink>
        <template #fallback>
          <div v-if="product.id" class="product-card__title-link">
            <h3 class="product-card__title">
              {{ product.name }}
            </h3>
          </div>
        </template>
      </ClientOnly>
      <div v-if="!product.id" class="product-card__title-container">
        <h3 class="product-card__title">
          {{ product.name }}
        </h3>
      </div>

      <!-- Цвета -->
      <div v-if="colors.length > 1" class="product-card__colors">
        <button
          v-for="color in colors"
          :key="color"
          :class="['product-card__color-dot', { 'product-card__color-dot--active': color === currentColor }]"
          :style="{ background: color }"
          @click="goToColor(color)"
          :aria-label="`Выбрать цвет: ${color}`"
        ></button>
      </div>

      <!-- Рейтинг -->
      <div class="product-card__rating">
        <div class="product-card__stars">
          <Icon 
            v-for="star in 5" 
            :key="star"
            :name="star <= averageRating ? 'lucide:star' : 'lucide:star'" 
            class="product-card__star"
            :class="{ 'product-card__star--filled': star <= averageRating }"
          />
        </div>
        <span class="product-card__reviews-count">
          ({{ product._count?.reviews || 0 }})
        </span>
      </div>

      <!-- Цена -->
      <div class="product-card__price">
        <span class="product-card__current-price">
          ${{ formatPrice(product.price) }}
        </span>
        <span 
          v-if="product.comparePrice && product.comparePrice > product.price"
          class="product-card__compare-price"
        >
          ${{ formatPrice(product.comparePrice) }}
        </span>
        <span 
          v-if="product.comparePrice && product.comparePrice > product.price"
          class="product-card__discount-badge"
        >
          -{{ Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) }}%
        </span>
      </div>

      <!-- Скидки -->
      <div v-if="activeDiscounts && activeDiscounts.length > 0" class="product-card__discounts">
        <div 
          v-for="discount in activeDiscounts" 
          :key="discount.id"
          class="product-card__discount-tag"
        >
          {{ discount.discount?.name || 'Скидка' }}
        </div>
      </div>

      <!-- Статус наличия -->
      <div class="product-card__stock">
        <span 
          class="product-card__stock-badge"
          :class="{ 'product-card__stock-badge--available': product.inStock }"
        >
          {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'
import PlaceholderImage from '~/components/ui/PlaceholderImage.vue'

interface Props {
  product: Product
  colors?: string[]
  colorVariants?: Product[]
}

const props = defineProps<Props>()

// Computed свойства
const primaryImage = computed(() => {
  if (!props.product.images || !Array.isArray(props.product.images) || props.product.images.length === 0) return null
  return props.product.images.find((img: any) => img.isPrimary) || props.product.images[0]
})

const averageRating = computed(() => {
  if (!props.product.reviews || !Array.isArray(props.product.reviews) || props.product.reviews.length === 0) return 0
  const total = props.product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
  return Math.round(total / props.product.reviews.length)
})

const activeDiscounts = computed(() =>
  Array.isArray(props.product.productDiscounts)
    ? props.product.productDiscounts.filter((pd: any) => pd.discount && pd.discount.isActive)
    : []
)

// Получаем текущий цвет товара
const currentColor = computed(() => props.product.color)

// Получаем массив цветов и вариантов
const colorVariants = computed(() => props.colorVariants || [])
const colors = computed(() => props.colors || [])

// Метод для перехода на товар с выбранным цветом
const goToColor = (color: string) => {
  const variant = colorVariants.value.find(p => p.color === color)
  if (variant) {
    navigateTo(`/catalog/${variant.category?.slug || 'all'}/${variant.slug || variant.id}`)
  }
}

// Store
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// Состояние
const isInCart = computed(() => 
  cartStore.items.some(item => item.productId === props.product.id)
)

const isInWishlist = computed(() => 
  wishlistStore.items.some(item => item.product.id === props.product.id)
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
  wishlistStore.toggleItem(props.product)
  
  if (isInWishlist.value) {
    useToast().add({
      title: 'Удалено из избранного',
      description: props.product.name,
      icon: 'lucide:heart',
      color: 'gray'
    })
  } else {
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

<style scoped lang="scss">
.product-card {
  position: relative;
  background: var(--color-card);
  border-radius: 1rem;
  box-shadow: var(--color-shadow);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all var(--transition-main);
  
  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
  
  &--in-cart {
    box-shadow: 0 0 0 2px var(--color-primary);
  }
  
  &__badges {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  &__badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    &--new {
      background: var(--color-success);
    }
    
    &--featured {
      background: var(--color-warning);
    }
    
    &--best-seller {
      background: var(--color-primary);
    }
  }
  
  &__quick-view {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    opacity: 0;
    transition: opacity var(--transition-main);
  }
  
  &__quick-view-btn {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 0.5rem;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: none;
    cursor: pointer;
    transition: all var(--transition-main);
    
    &:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }
  }
  
  &__quick-view-icon {
    width: 1rem;
    height: 1rem;
    color: var(--color-text);
  }
  
  &__image-container {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--color-bg);
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0);
    transition: background-color var(--transition-main);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__actions {
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity var(--transition-main);
  }
  
  &__action-btn {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 0.75rem;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: none;
    cursor: pointer;
    transition: all var(--transition-main);
    
    &:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }
    
    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        transform: none;
      }
    }
    
    &--active {
      .product-card__action-icon {
        color: var(--color-error);
        fill: var(--color-error);
      }
    }
  }
  
  &__action-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text);
    transition: color var(--transition-main);
  }
  
  &__content {
    padding: 1rem;
  }
  
  &__category {
    font-size: 0.75rem;
    color: var(--color-primary);
    font-weight: 500;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  &__title-link {
    display: block;
    text-decoration: none;
  }
  
  &__title-container {
    display: block;
  }
  
  &__title {
    font-weight: 600;
    color: var(--color-text);
    font-size: 0.875rem;
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color var(--transition-main);
  }
  
  &__title-link:hover &__title {
    color: var(--color-primary);
  }
  
  &__rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.5rem;
  }
  
  &__stars {
    display: flex;
  }
  
  &__star {
    width: 0.75rem;
    height: 0.75rem;
    color: #d1d5db;
    transition: color var(--transition-main);
    
    &--filled {
      color: #fbbf24;
      fill: #fbbf24;
    }
  }
  
  &__reviews-count {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
  
  &__price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }
  
  &__current-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-text);
  }
  
  &__compare-price {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-decoration: line-through;
  }
  
  &__discount-badge {
    font-size: 0.75rem;
    background: var(--color-error);
    color: white;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-weight: 600;
  }
  
  &__discounts {
    margin-top: 0.5rem;
  }
  
  &__discount-tag {
    font-size: 0.75rem;
    background: var(--color-success);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    display: inline-block;
    margin-right: 0.25rem;
    font-weight: 500;
  }
  
  &__stock {
    margin-top: 0.5rem;
  }
  
  &__stock-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    background: var(--color-error);
    color: white;
    font-weight: 500;
    
    &--available {
      background: var(--color-success);
      color: white;
    }
  }

  &__colors {
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem 0 0.25rem 0;
  }
  &__color-dot {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    border: 2px solid var(--color-border);
    cursor: pointer;
    transition: border 0.2s;
    outline: none;
    box-shadow: 0 0 0 1px var(--color-border);
    &:hover,
    &--active {
      border: 2px solid var(--color-primary);
      box-shadow: 0 0 0 2px var(--color-primary-light);
    }
  }
}

// Hover effects
.product-card:hover {
  .product-card__quick-view {
    opacity: 1;
  }
  
  .product-card__overlay {
    background: rgba(0, 0, 0, 0.2);
  }
  
  .product-card__actions {
    opacity: 1;
  }
  
  .product-card__image {
    transform: scale(1.1);
  }
}

// Dark mode adjustments
:global(.dark) {
  .product-card {
    background: var(--color-card);
    border-color: var(--color-border);
    
    &__quick-view-btn,
    &__action-btn {
      background: rgba(35, 39, 47, 0.9);
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(35, 39, 47, 1);
      }
    }
    
    &__action-icon {
      color: var(--color-text);
    }
    
    &__title {
      color: var(--color-text);
    }
    
    &__current-price {
      color: var(--color-text);
    }
    
    &__reviews-count {
      color: var(--color-text-secondary);
    }
    
    &__star {
      color: #374151;
      
      &--filled {
        color: #fbbf24;
        fill: #fbbf24;
      }
    }
  }
}
</style>
