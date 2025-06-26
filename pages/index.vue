<template>
  <div class="main-page">
    <!-- Hero Banner -->
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">
          LexidShop — <span>звук нового поколения</span>
        </h1>
        <p class="hero__desc">
          Магазин премиальных наушников и аксессуаров. Ощути разницу с LexidShop.
        </p>
        <div class="hero__actions">
          <Button size="lg" @click="navigateToCategory('all')">Смотреть каталог</Button>
          <Button variant="outline" size="lg" @click="scrollToFeatured">Новинки</Button>
        </div>
      </div>
      <img class="hero__img" src="" alt="LexidShop Banner" loading="lazy" />
    </section>

    <!-- Categories -->
    <section class="categories">
      <h2 class="categories__title">Категории</h2>
      <div class="categories__grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="categories__item"
          @click="navigateToCategory(category.slug)"
        >
          <div class="categories__icon">
            <Icon icon="lucide:headphones" />
          </div>
          <div class="categories__name">{{ category.name }}</div>
          <div class="categories__count">{{ category._count.products }} товаров</div>
        </div>
      </div>
    </section>

    <!-- Новинки -->
    <section ref="featuredSection" class="showcase showcase--new">
      <div class="showcase__header">
        <h2>Новинки</h2>
        <Button variant="link" @click="navigateToCategory('new')">Все новинки</Button>
      </div>
      <div class="showcase__grid">
        <ProductCard
          v-for="product in newProducts"
          :key="product.id"
          :product="product"
          v-motion-fade-visible
        />
      </div>
    </section>

    <!-- Хиты продаж -->
    <section class="showcase showcase--hits">
      <div class="showcase__header">
        <h2>Хиты продаж</h2>
        <Button variant="link" @click="navigateToCategory('bestSeller')">Все хиты</Button>
      </div>
      <div class="showcase__grid">
        <ProductCard
          v-for="product in bestSellers"
          :key="product.id"
          :product="product"
          v-motion-fade-visible
        />
      </div>
    </section>

    <!-- Преимущества -->
    <section class="features">
      <div class="feature">
        <Icon icon="lucide:truck" />
        <h3>Быстрая доставка</h3>
        <p>Доставим по всей России за 1-3 дня</p>
      </div>
      <div class="feature">
        <Icon icon="lucide:shield-check" />
        <h3>Гарантия качества</h3>
        <p>Официальная гарантия на все товары</p>
      </div>
      <div class="feature">
        <Icon icon="lucide:headphones" />
        <h3>Премиум звук</h3>
        <p>Только лучшие бренды и модели</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProducts } from '~/composables/useProducts'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard.vue'
import { Icon } from '@iconify/vue'
import type { Category, Product } from '~/composables/useProducts'

// SEO
useHead({
  title: 'LexidShop - Лучшие наушники и аксессуары',
  meta: [
    { name: 'description', content: 'Магазин качественных наушников и аксессуаров. AirPods, беспроводные наушники, чехлы и многое другое.' },
    { property: 'og:title', content: 'LexidShop - Лучшие наушники и аксессуары' },
    { property: 'og:description', content: 'Магазин качественных наушников и аксессуаров' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lexid.shop' }
  ]
})

const { getProducts, getCategories, getFeaturedProducts, getNewProducts, getBestSellers } = useProducts()
const categories = ref<Category[]>([])
const newProducts = ref<Product[]>([])
const bestSellers = ref<Product[]>([])
const featuredSection = ref()

const loadData = async () => {
  categories.value = await getCategories()
  newProducts.value = await getNewProducts(8)
  bestSellers.value = await getBestSellers(8)
}

const navigateToCategory = (slug: string) => {
  if (slug === 'all') navigateTo('/products')
  else if (slug === 'new') navigateTo('/products?new=true')
  else if (slug === 'bestSeller') navigateTo('/products?bestSeller=true')
  else navigateTo(`/products?category=${slug}`)
}

const scrollToFeatured = () => {
  featuredSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.main-page {
  background: var(--color-bg);
  color: var(--color-text);
}
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 64px 0 48px 0;
  gap: 48px;
  background: var(--color-bg-secondary);
  border-radius: 32px;
  box-shadow: var(--color-shadow);
  margin-bottom: 48px;
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  &__title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 12px;
    span {
      color: var(--color-primary);
    }
  }
  &__desc {
    font-size: 1.5rem;
    color: var(--color-text-secondary);
    max-width: 520px;
    margin-bottom: 24px;
  }
  &__actions {
    display: flex;
    gap: 24px;
  }
  &__img {
    width: 420px;
    max-width: 40vw;
    border-radius: 24px;
    box-shadow: var(--color-shadow);
    object-fit: cover;
    background: var(--color-bg);
  }
}
.categories {
  margin-bottom: 56px;
  &__title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 32px;
    text-align: center;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 32px;
  }
  &__item {
    background: var(--color-card);
    border-radius: 18px;
    box-shadow: var(--color-shadow);
    padding: 32px 24px;
    text-align: center;
    cursor: pointer;
    transition: box-shadow var(--transition-main), transform var(--transition-main);
    &:hover {
      box-shadow: 0 8px 32px rgba(80, 80, 120, 0.12);
      transform: translateY(-4px) scale(1.03);
    }
  }
  &__icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
    color: var(--color-primary);
  }
  &__name {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 6px;
  }
  &__count {
    color: var(--color-text-secondary);
    font-size: 1rem;
  }
}
.showcase {
  margin-bottom: 56px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    h2 {
      font-size: 2rem;
      font-weight: 700;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 32px;
  }
}
.features {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin: 64px 0 0 0;
  flex-wrap: wrap;
}
.feature {
  background: var(--color-card);
  border-radius: 18px;
  box-shadow: var(--color-shadow);
  padding: 32px 40px;
  min-width: 260px;
  max-width: 340px;
  text-align: center;
  transition: box-shadow var(--transition-main), transform var(--transition-main);
  &:hover {
    box-shadow: 0 8px 32px rgba(80, 80, 120, 0.12);
    transform: translateY(-4px) scale(1.03);
  }
  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--color-primary);
  }
  p {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
  }
  .icon {
    font-size: 2.2rem;
    margin-bottom: 16px;
    color: var(--color-primary);
  }
}
</style>
