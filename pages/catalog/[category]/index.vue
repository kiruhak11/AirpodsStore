<template>
  <div class="catalog-page">
    <aside class="catalog-page__sidebar">
      <h2>Фильтры</h2>
      <div class="filter-group">
        <label>Цена</label>
        <input type="range" min="0" max="50000" v-model="price" />
        <span>{{ price }} ₽</span>
      </div>
      <div class="filter-group">
        <label>
          <input type="checkbox" v-model="onlyInStock" /> В наличии
        </label>
      </div>
      <Button variant="outline" @click="resetFilters">Сбросить</Button>
    </aside>
    <main class="catalog-page__main">
      <h1 class="catalog-page__title">{{ (categoryData && categoryData[0]?.name) || 'Каталог' }}</h1>
      <div v-if="filteredProducts.length === 0" class="catalog-page__empty">Нет товаров в этой категории</div>
      <div class="catalog-page__grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '~/composables/useProducts'

const route = useRoute()
const categorySlug = route.params.category as string

const { data: categoryData } = await useAsyncData('category', () =>
  fetch(`/api/categories?slug=${categorySlug}`).then(r => r.json())
)
const { data: productsData } = await useAsyncData('products', () =>
  fetch(`/api/products?category=${categorySlug}`).then(r => r.json())
)

const price = ref(50000)
const onlyInStock = ref(false)

const filteredProducts = computed(() => {
  if (!productsData.value) return []
  
  // Проверяем структуру данных - может быть массив или объект с полем products
  const products = Array.isArray(productsData.value) 
    ? productsData.value 
    : productsData.value?.products || []
    
  return products.filter(
    (p: Product) => p.price <= price.value && (!onlyInStock.value || p.stockQuantity > 0)
  )
})

const resetFilters = () => {
  price.value = 50000
  onlyInStock.value = false
}
</script>

<style scoped lang="scss">
.catalog-page {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  background: var(--color-bg);
  color: var(--color-text);
  &__sidebar {
    min-width: 240px;
    background: var(--color-card);
    border-radius: 18px;
    box-shadow: var(--color-shadow);
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    h2 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 18px;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label {
        font-size: 1rem;
        font-weight: 500;
      }
      input[type='range'] {
        width: 100%;
      }
    }
  }
  &__main {
    flex: 1;
  }
  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 32px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 32px;
  }
  &__empty {
    margin-bottom: 32px;
    font-size: 1.2rem;
    font-weight: 500;
  }
}
.product-skeleton {
  height: 380px;
  border-radius: 18px;
  background: linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-bg) 50%, var(--color-bg-secondary) 75%);
  animation: skeleton 1.2s infinite linear;
}
@keyframes skeleton {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
</style> 