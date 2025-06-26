<template>
  <section class="container">
    <h1 class="page-title">Категории</h1>
    <div class="categories-grid">
      <div v-for="(cat, i) in categories" :key="cat.id" class="card cat-card" :style="{ animationDelay: (i * 0.08) + 's' }">
        <NuxtLink :to="`/catalog/${cat.id}`" class="cat-link">
          <div class="cat-img-wrap">
            <img :src="cat.image || 'https://placehold.co/400x300/667eea/ffffff?text=KES+System'" :alt="cat.name" class="cat-img" />
          </div>
          <div class="cat-name">{{ cat.name }}</div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const categories = ref<any[]>([])
onMounted(async () => {
  const res = await fetch('/api/categories')
  categories.value = await res.json()
})
</script>
<style scoped>
.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 36px;
  text-align: center;
}
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 40px;
}
.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 38px 18px 28px 18px;
  min-height: 260px;
  cursor: pointer;
  background: linear-gradient(120deg, #f7f8fa 60%, #e0f7fa 100%);
  box-shadow: 0 8px 32px rgba(102,126,234,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  transition: box-shadow 0.25s, transform 0.18s, background 0.3s;
  will-change: transform;
  animation: fadeInUp 0.7s cubic-bezier(.23,1.02,.32,1) both;
}
.cat-card:hover {
  box-shadow: 0 24px 64px rgba(102,126,234,0.18), 0 8px 32px rgba(67,233,123,0.12);
  transform: translateY(-10px) scale(1.06) rotateZ(-1deg);
  background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
}
.cat-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}
.cat-img-wrap {
  background: linear-gradient(120deg, #667eea 0%, #38f9d7 100%);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 18px;
  box-shadow: 0 2px 12px rgba(102,126,234,0.10);
  transition: box-shadow 0.2s;
}
.cat-card:hover .cat-img-wrap {
  box-shadow: 0 8px 32px rgba(67,233,123,0.13);
}
.cat-img {
  width: 120px;
  height: 90px;
  object-fit: contain;
  border-radius: 12px;
  background: #f7f7f7;
  box-shadow: 0 2px 8px rgba(56,249,215,0.08);
}
.cat-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-top: 8px;
  letter-spacing: 0.5px;
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}
</style> 