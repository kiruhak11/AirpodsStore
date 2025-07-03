<template>
  <section class="categories-list-pro">
    <div class="categories-list-pro__header">
      <Icon icon="lucide:layers" class="categories-list-pro__icon" />
      <h1 class="categories-list-pro__title">Категории</h1>
    </div>
    <div v-if="!categories" class="categories-list-pro__loading">Загрузка категорий...</div>
    <div v-else-if="categories.length === 0" class="categories-list-pro__empty">Нет категорий</div>
    <div class="categories-list-pro__grid">
      <ClientOnly>
        <transition-group name="fade-slide-pro" tag="div">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/catalog/${cat.slug}`"
            class="categories-list-pro__item"
          >
            <div class="categories-list-pro__img-wrap">
              <img
                :src="cat.image || `https://placehold.co/120x120/6b7280/ffffff?text=${encodeURIComponent(cat.name)}`"
                :alt="cat.name"
                class="categories-list-pro__img"
              />
            </div>
            <div class="categories-list-pro__content">
              <div class="categories-list-pro__name">{{ cat.name }}</div>
              <div class="categories-list-pro__desc">{{ cat.description }}</div>
            </div>
            <span class="categories-list-pro__arrow">
              <Icon icon="lucide:arrow-right" />
            </span>
          </NuxtLink>
        </transition-group>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Category } from '~/composables/useProducts'
const { getCategories } = useProducts()
const categories = ref<Category[]>([])

const loadData = async () => {
  categories.value = await getCategories()
}
onMounted(loadData)
</script>

<style scoped lang="scss">
.categories-list-pro {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 0 64px 0;
  &__header {
    display: flex;
    align-items: center;
    gap: 0.7em;
    justify-content: center;
    margin-bottom: 36px;
  }
  &__icon {
    font-size: 2.2em;
    color: var(--color-primary);
    filter: drop-shadow(0 0 8px #38f9d7cc);
  }
  &__title {
    font-size: 2.3rem;
    font-weight: 900;
    letter-spacing: 0.01em;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
  &__loading, &__empty {
    text-align: center;
    color: #aaa;
    font-size: 1.2rem;
    margin-bottom: 32px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 44px;
  }
  &__item {
    background: linear-gradient(120deg, #f7faff 60%, #e0f7fa 100%);
    border-radius: 28px;
    box-shadow: 0 6px 32px 0 rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
    padding: 38px 24px 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    border: 2.5px solid rgba(102,126,234,0.10);
    backdrop-filter: blur(18px);
    transition: box-shadow 0.28s, transform 0.28s, border 0.28s;
    min-height: 220px;
    &:hover {
      box-shadow: 0 12px 48px 0 rgba(56,249,215,0.18), 0 4px 24px rgba(67,233,123,0.13);
      transform: translateY(-6px) scale(1.045);
      border: 2.5px solid #38f9d7;
      z-index: 2;
      .categories-list-pro__arrow {
        opacity: 1;
        transform: translateX(8px);
      }
    }
  }
  &__img-wrap {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.2em;
    box-shadow: 0 0 0 0 #38f9d700;
    position: relative;
    overflow: hidden;
    border: 2.5px solid #fff;
  }
  &__img {
    width: 54px;
    height: 54px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 2px 8px #38f9d733;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }
  &__name {
    font-size: 1.22rem;
    font-weight: 800;
    letter-spacing: 0.01em;
    margin-bottom: 0.1em;
  }
  &__desc {
    font-size: 1.01rem;
    color: var(--color-text-secondary);
    opacity: 0.8;
    margin-bottom: 0.2em;
  }
  &__arrow {
    position: absolute;
    right: 24px;
    bottom: 24px;
    opacity: 0.5;
    font-size: 1.3em;
    transition: opacity 0.18s, transform 0.18s;
    pointer-events: none;
  }
}

// Анимации
.fade-slide-pro-enter-active, .fade-slide-pro-leave-active {
  transition: all 0.7s cubic-bezier(.23,1,.32,1);
}
.fade-slide-pro-enter-from, .fade-slide-pro-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

// Адаптивность
@media (max-width: 900px) {
  .categories-list-pro__grid {
    gap: 18px;
  }
}
@media (max-width: 600px) {
  .categories-list-pro__grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .categories-list-pro__item {
    padding: 12px 6px;
    border-radius: 10px;
    min-width: 0;
    max-width: 100%;
  }
  .categories-list-pro__img-wrap {
    width: 44px;
    height: 44px;
  }
}
</style> 