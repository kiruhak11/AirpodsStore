<template>
  <div 
    class="product-card scroll-reveal"
    :class="{ 'product-card--in-cart': isInCart }"
  >
    <div class="product-card__badges">
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
        <Icon icon="lucide:eye" class="product-card__quick-view-icon" />
      </button>
    </div>

    <!-- Изображение товара -->
    <div class="product-card__image-container">
      <img
        :src="String(primaryImage?.url || product.image || '')"
        :alt="altText"
        class="product-card__image"
      />
      <!-- NEW badge поверх картинки -->
      <div v-if="product.isNew" class="product-card__badge-new">
        <Icon icon="lucide:sparkles" class="badge-icon" /> NEW
      </div>
      
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
              :icon="isInCart ? 'lucide:check' : 'lucide:shopping-cart'" 
              class="product-card__action-icon" 
            />
          </button>
          <button 
            @click="toggleWishlist"
            class="product-card__action-btn product-card__action-btn--wishlist"
            :class="{ 'product-card__action-btn--active': isInWishlist }"
          >
            <Icon 
              :icon="isInWishlist ? 'lucide:heart' : 'lucide:heart'" 
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
            :icon="star <= averageRating ? 'lucide:star' : 'lucide:star'" 
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
import { Icon } from '@iconify/vue'

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

const altText = computed(() => {
  if (primaryImage.value?.alt) return String(primaryImage.value.alt)
  if (props.product.name) return String(props.product.name)
  return ''
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
  background: rgba(255,255,255,0.18);
  border-radius: 2.2em;
  box-shadow: 0 12px 36px rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
  padding: 2.2em 1.7em 2em 1.7em;
  margin-bottom: 2.2em;
  display: flex;
  flex-direction: column;
  gap: 1.2em;
  position: relative;
  transition: box-shadow 0.28s, transform 0.28s, border 0.28s;
  backdrop-filter: blur(18px);
  &:hover {
    box-shadow: 0 18px 48px rgba(56,249,215,0.13), 0 4px 24px rgba(67,233,123,0.13);
    transform: translateY(-7px) scale(1.035);
    z-index: 2;
  }
  &__image-container {
    border-radius: 1.5em;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(56,249,215,0.10);
    margin-bottom: 1.2em;
  }
  &__image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 1.5em;
    background: var(--color-bg-secondary);
    box-shadow: 0 2px 8px #38f9d733;
    transition: filter 0.18s;
  }
  &__badges, &__badge, &__badge-new {
    filter: drop-shadow(0 0 8px #38f9d7cc);
    font-size: 1.01em;
    font-weight: 700;
    border-radius: 1.2em;
    padding: 0.3em 1.1em;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    box-shadow: 0 0 8px #38f9d7cc, 0 2px 8px #38f9d722;
    letter-spacing: 0.04em;
    margin-bottom: 0.5em;
    animation: fadeInPro 0.7s;
  }
  &__quick-view-btn {
    background: rgba(255,255,255,0.7);
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px #38f9d733;
    transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
    &:hover {
      background: #38f9d7;
      color: #fff;
      transform: scale(1.08);
    }
  }
  &__action-btn {
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 3.1em;
    height: 3.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4em;
    box-shadow: 0 2px 8px rgba(56,249,215,0.10);
    cursor: pointer;
    transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
    margin-right: 0.7em;
    &:hover {
      background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
      box-shadow: 0 4px 16px rgba(56,249,215,0.13);
      transform: translateY(-2px) scale(1.13);
    }
    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &--active {
      background: linear-gradient(90deg, #ff4d4d 0%, #ffb347 100%);
      color: #fff;
    }
  }
  &__action-icon {
    font-size: 1.3em;
    filter: drop-shadow(0 0 8px #38f9d7cc);
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    padding-top: 0.5em;
  }
  &__title {
    font-size: 1.25em;
    font-weight: 800;
    margin-bottom: 0.2em;
    color: var(--color-primary);
  }
  &__category {
    font-size: 1em;
    color: var(--color-text-secondary);
    margin-bottom: 0.2em;
  }
  &__price {
    font-size: 1.18em;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.3em;
  }
  &__compare-price {
    color: #b0b0b0;
    font-size: 1em;
    margin-left: 0.7em;
    text-decoration: line-through;
  }
  &__discount-badge {
    background: linear-gradient(90deg, #ff4d4d 0%, #ffb347 100%);
    color: #fff;
    border-radius: 1em;
    padding: 0.2em 0.8em;
    font-size: 0.95em;
    margin-left: 0.7em;
    font-weight: 700;
    animation: fadeInPro 0.7s;
  }
  &__stock-badge {
    background: linear-gradient(90deg, #22c55e 0%, #38f9d7 100%);
    color: #fff;
    border-radius: 1em;
    padding: 0.2em 0.8em;
    font-size: 0.95em;
    font-weight: 700;
    margin-top: 0.3em;
    animation: fadeInPro 0.7s;
  }
  &__stars {
    display: flex;
    gap: 0.1em;
    margin-bottom: 0.2em;
  }
  &__star {
    font-size: 1.1em;
    color: #ffd700;
    filter: drop-shadow(0 0 6px #ffd70099);
    &--filled {
      color: #ffd700;
    }
  }
  &__reviews-count {
    font-size: 0.95em;
    color: var(--color-text-secondary);
    margin-left: 0.4em;
  }
  &__colors {
    display: flex;
    gap: 0.5em;
    margin-bottom: 0.3em;
  }
  &__color-dot {
    width: 1.3em;
    height: 1.3em;
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 0 8px #38f9d7cc;
    cursor: pointer;
    transition: border 0.18s, transform 0.18s;
    &--active {
      border: 2.5px solid #38f9d7;
      transform: scale(1.15);
    }
  }
  &__discounts {
    display: flex;
    gap: 0.5em;
    margin-bottom: 0.3em;
  }
  &__discount-tag {
    background: linear-gradient(90deg, #ffb347 0%, #38f9d7 100%);
    color: #fff;
    border-radius: 1em;
    padding: 0.2em 0.8em;
    font-size: 0.95em;
    font-weight: 700;
    animation: fadeInPro 0.7s;
  }
}
@keyframes fadeInPro {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
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

.product-card__badge-new {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 0.4em;
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.93em;
  border-radius: 999px;
  padding: 0.32em 1.2em 0.32em 0.9em;
  box-shadow: 0 0 12px #38f9d7cc, 0 2px 8px #38f9d722;
  z-index: 3;
  letter-spacing: 0.13em;
  filter: drop-shadow(0 0 8px #38f9d7cc);
  border: 1.5px solid #fff3;
  text-transform: uppercase;
  animation: badgePulse 1.6s infinite alternate;
}
.product-card__badge-new .badge-icon {
  font-size: 1.1em;
  margin-right: 0.2em;
}
@keyframes badgePulse {
  0% { box-shadow: 0 0 12px #38f9d7cc, 0 2px 8px #38f9d722; }
  100% { box-shadow: 0 0 24px #38f9d7cc, 0 4px 16px #38f9d744; }
}
</style>
