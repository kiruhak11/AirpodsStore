<template>
  <section class="container">
    <h1 class="page-title">Товары категории</h1>
    <div class="products-grid">
      <div v-for="(product, i) in products" :key="product.id" class="card prod-card" :style="{ animationDelay: (i * 0.08) + 's' }">
        <NuxtLink :to="`/catalog/${categoryId}/${product.id}`" class="prod-link">
          <div class="prod-img-wrap">
            <img :src="product.image || 'https://placehold.co/400x300/667eea/ffffff?text=KES+System'" :alt="product.name" class="prod-img" />
          </div>
          <div class="prod-name">{{ product.name }}</div>
          <div class="prod-price-gradient">{{ product.price }} ₽</div>
          <button class="btn">Подробнее</button>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const categoryId = route.params.category
const products = ref<any[]>([])
onMounted(async () => {
  const res = await fetch(`/api/products?categoryId=${categoryId}`)
  products.value = await res.json()
})
</script>
<style scoped>
.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 36px;
  text-align: center;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 44px;
}
.prod-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 38px 18px 28px 18px;
  min-height: 340px;
  cursor: pointer;
  background: linear-gradient(120deg, #f7f8fa 60%, #e0f7fa 100%);
  box-shadow: 0 8px 32px rgba(102,126,234,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  transition: box-shadow 0.25s, transform 0.18s, background 0.3s;
  will-change: transform;
  animation: fadeInUp 0.7s cubic-bezier(.23,1.02,.32,1) both;
}
.prod-card:hover {
  box-shadow: 0 24px 64px rgba(102,126,234,0.18), 0 8px 32px rgba(67,233,123,0.12);
  transform: translateY(-10px) scale(1.06) rotateZ(-1deg);
  background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
}
.prod-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}
.prod-img-wrap {
  background: linear-gradient(120deg, #667eea 0%, #38f9d7 100%);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 18px;
  box-shadow: 0 2px 12px rgba(102,126,234,0.10);
  transition: box-shadow 0.2s;
}
.prod-card:hover .prod-img-wrap {
  box-shadow: 0 8px 32px rgba(67,233,123,0.13);
}
.prod-img {
  width: 160px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  background: #f7f7f7;
  box-shadow: 0 2px 8px rgba(56,249,215,0.08);
}
.prod-name {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
}
.prod-price-gradient {
  font-size: 1.25rem;
  font-weight: 800;
  background: var(--gradient2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 14px;
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}
</style> 