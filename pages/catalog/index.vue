<template>
  <section class="categories-list">
    <h1 class="categories-list__title">Категории</h1>
    <div v-if="!categories || categories.length === 0" class="categories-list__empty">Нет категорий</div>
    <div class="categories-list__grid">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/catalog/${cat.slug}`"
        class="categories-list__item"
      >
        <img :src="cat.image || '/img/category-placeholder.png'" :alt="cat.name" class="categories-list__img" />
        <div class="categories-list__name">{{ cat.name }}</div>
        <div class="categories-list__desc">{{ cat.description }}</div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useProducts'
const { data: categories } = await useAsyncData('categories', () =>
  fetch('/api/categories').then(r => r.json())
)
</script>

<style scoped lang="scss">
.categories-list {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 0;
  &__title {
    font-size: 2.4rem;
    font-weight: 800;
    margin-bottom: 40px;
    text-align: center;
  }
  &__empty {
    text-align: center;
    color: #aaa;
    font-size: 1.2rem;
    margin-bottom: 32px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 40px;
  }
  &__item {
    background: var(--color-card);
    border-radius: 18px;
    box-shadow: var(--color-shadow);
    padding: 38px 18px 28px 18px;
    min-height: 220px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow 0.25s, transform 0.18s, background 0.3s;
    &:hover {
      box-shadow: 0 24px 64px rgba(102,126,234,0.18), 0 8px 32px rgba(67,233,123,0.12);
      transform: translateY(-10px) scale(1.06) rotateZ(-1deg);
      background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
    }
  }
  &__img {
    width: 120px;
    height: 90px;
    object-fit: contain;
    margin-bottom: 18px;
    border-radius: 12px;
    background: #f7f8fa;
  }
  &__name {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  &__desc {
    color: var(--color-text-secondary);
    font-size: 1rem;
    min-height: 32px;
  }
}
</style> 