<template>
  <div class="category-page">
    <!-- Breadcrumbs -->
    <nav class="category-page__breadcrumbs">
      <NuxtLink to="/" class="breadcrumb-link">Главная</NuxtLink>
      <span class="breadcrumb-separator">/</span>
      <NuxtLink to="/catalog" class="breadcrumb-link">Каталог</NuxtLink>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ category?.name || 'Категория' }}</span>
    </nav>

    <div class="category-page__content">
      <!-- Sidebar -->
      <aside class="category-page__sidebar">
        <div class="sidebar-card">
          <h2 class="sidebar-title">Фильтры</h2>
          
          <!-- Price Filter -->
          <div class="filter-group">
            <label class="filter-label">Цена до</label>
            <div class="price-input">
              <input 
                type="number" 
                v-model="maxPrice" 
                min="0" 
                max="100000"
                class="price-field"
                placeholder="Макс. цена"
              />
              <span class="price-currency">₽</span>
            </div>
          </div>

          <!-- Stock Filter -->
          <div class="filter-group">
            <label class="filter-checkbox">
              <input type="checkbox" v-model="onlyInStock" />
              <span class="checkmark"></span>
              Только в наличии
            </label>
          </div>

          <!-- Sort -->
          <div class="filter-group">
            <label class="filter-label">Сортировка</label>
            <select v-model="sortBy" class="sort-select">
              <option value="name">По названию</option>
              <option value="price-asc">По цене (возрастание)</option>
              <option value="price-desc">По цене (убывание)</option>
              <option value="newest">Сначала новые</option>
            </select>
          </div>

          <button @click="resetFilters" class="reset-btn">
            Сбросить фильтры
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="category-page__main">
        <!-- Error State -->
        <div v-if="!category && !pending" class="category-error">
          <div class="error-icon">❌</div>
          <h2 class="error-title">Категория не найдена</h2>
          <p class="error-description">
            Категория "{{ categorySlug }}" не существует
          </p>
          <NuxtLink to="/catalog" class="error-btn">
            Вернуться к каталогу
          </NuxtLink>
        </div>

        <!-- Category Content -->
        <div v-else-if="category" class="category-content">
          <header class="category-header">
            <h1 class="category-title">{{ category.name }}</h1>
            <p class="category-description">{{ category.description || 'Товары в этой категории' }}</p>
            <div class="category-stats">
              <span class="stats-item">{{ filteredProducts.length }} товаров</span>
              <span v-if="maxPrice < 100000" class="stats-item">до {{ maxPrice }}₽</span>
              <span v-if="onlyInStock" class="stats-item">в наличии</span>
            </div>
          </header>

          <!-- Loading State -->
          <div v-if="pending" class="products-loading">
            <div v-for="i in 6" :key="i" class="product-skeleton"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <h3 class="empty-title">Товары не найдены</h3>
            <p class="empty-description">
              Попробуйте изменить фильтры или вернитесь позже
            </p>
            <button @click="resetFilters" class="empty-btn">
              Сбросить фильтры
            </button>
          </div>

          <!-- Products Grid -->
          <div v-else class="products-grid">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              :colors="product.colors"
              :colorVariants="product.colorVariants"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="pending" class="category-loading">
          <div class="loading-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-description"></div>
            <div class="skeleton-products">
              <div v-for="i in 6" :key="i" class="product-skeleton"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Category } from '~/composables/useProducts'
import { Icon } from '@iconify/vue'

const route = useRoute()
const categorySlug = route.params.category as string

// Data fetching
const { data: category, pending: categoryPending } = await useAsyncData(
  `category-${categorySlug}`,
  () => $fetch(`/api/categories?slug=${categorySlug}`).then(res => Array.isArray(res) ? res[0] : res)
)

const { data: products, pending: productsPending } = await useAsyncData(
  `products-${categorySlug}`,
  () => $fetch(`/api/products?category=${categorySlug}`).then((res: any) => Array.isArray(res) ? res : res?.products || [])
)

const pending = computed(() => categoryPending.value || productsPending.value)

// Debug logging
watchEffect(() => {
  console.log('Category slug:', categorySlug)
  console.log('Category data:', category.value)
  console.log('Products data:', products.value)
})

// Meta - moved after data fetching
useHead({
  title: computed(() => `Категория ${category.value?.name || ''} - LexidShop`),
  meta: [
    { name: 'description', content: computed(() => category.value?.description || 'Товары в категории') }
  ]
})

// Filters
const maxPrice = ref(100000)
const onlyInStock = ref(false)
const sortBy = ref('name')

// Computed
const groupedProducts = computed(() => {
  if (!products.value) return [];
  const map = new Map();
  products.value.forEach((product: Product) => {
    const key = `${product.name}_${product.categoryId}`;
    if (!map.has(key)) {
      map.set(key, { ...product, colors: [product.color], colorVariants: [product] });
    } else {
      const group = map.get(key);
      if (!group.colors.includes(product.color)) group.colors.push(product.color);
      group.colorVariants.push(product);
    }
  });
  return Array.from(map.values());
});

const filteredProducts = computed(() => {
  if (!groupedProducts.value) return [];
  let filtered = groupedProducts.value.filter((product: Product & { colors: string[]; colorVariants: Product[] }) => {
    const priceMatch = product.price <= maxPrice.value;
    const stockMatch = !onlyInStock.value || product.inStock;
    return priceMatch && stockMatch;
  });
  // Sorting
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'name':
    default:
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return filtered;
});

// Methods
const resetFilters = () => {
  maxPrice.value = 100000
  onlyInStock.value = false
  sortBy.value = 'name'
}
</script>

<style scoped lang="scss">
.category-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: 2rem 0;
}

.category-page__breadcrumbs {
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

.category-page__content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.category-page__sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.sidebar-card {
  background: var(--color-card);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--color-shadow);
  border: 1px solid var(--color-border);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.price-input {
  position: relative;
  
  .price-field {
    width: 100%;
    padding: 0.75rem;
    padding-right: 2rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.1);
    }
  }
  
  .price-currency {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text);
  
  input[type="checkbox"] {
    display: none;
  }
  
  .checkmark {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--color-border);
    border-radius: 0.25rem;
    position: relative;
    transition: all var(--transition-main);
  }
  
  input:checked + .checkmark {
    background: var(--color-primary);
    border-color: var(--color-primary);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
    }
  }
}

.sort-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.1);
  }
}

.reset-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-main);
  
  &:hover {
    background: var(--color-border);
  }
}

.category-header {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.category-description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.category-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stats-item {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
}

.products-loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-skeleton {
  height: 400px;
  border-radius: 1rem;
  background: linear-gradient(90deg, var(--color-bg) 25%, var(--color-card) 50%, var(--color-bg) 75%);
  background-size: 200px 100%;
  animation: skeleton 1.5s infinite linear;
}

@keyframes skeleton {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.category-error {
  text-align: center;
  padding: 4rem 2rem;
  
  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .error-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
  
  .error-description {
    font-size: 1.1rem;
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
    font-weight: 500;
    transition: background var(--transition-main);
    
    &:hover {
      background: var(--color-primary-dark);
    }
  }
}

.category-loading {
  .loading-skeleton {
    .skeleton-title {
      height: 2.5rem;
      background: linear-gradient(90deg, var(--color-bg) 25%, var(--color-card) 50%, var(--color-bg) 75%);
      background-size: 200px 100%;
      animation: skeleton 1.5s infinite linear;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .skeleton-description {
      height: 1.5rem;
      width: 60%;
      background: linear-gradient(90deg, var(--color-bg) 25%, var(--color-card) 50%, var(--color-bg) 75%);
      background-size: 200px 100%;
      animation: skeleton 1.5s infinite linear;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .skeleton-products {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.empty-description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.empty-btn {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-main);
  
  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

// Responsive
@media (max-width: 1024px) {
  .category-page__content {
    grid-template-columns: 1fr;
  }
  
  .category-page__sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .category-page {
    padding: 1rem 0;
  }
  
  .category-page__content {
    padding: 0 0.5rem;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style> 