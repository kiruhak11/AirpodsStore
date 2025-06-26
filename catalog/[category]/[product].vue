<template>
  <section class="container">
    <div v-if="product" class="card product-detail fade-in">
      <div class="prod-detail-flex">
        <div class="prod-img-gradient">
          <img :src="product.image || 'https://placehold.co/400x300/667eea/ffffff?text=KES+System'" :alt="product.name" class="prod-img" />
        </div>
        <div class="prod-info">
          <h1 class="prod-title">{{ product.name }}</h1>
          <div class="prod-price-gradient">{{ product.price }} ₽</div>
          <div class="prod-desc">{{ product.description }}</div>
          <button class="btn">В корзину</button>
        </div>
      </div>
      <div v-if="product.specs && product.specs.length" class="prod-specs fade-in">
        <h3>Характеристики</h3>
        <ul>
          <li v-for="(spec, i) in product.specs" :key="i">{{ spec.key }}: {{ spec.value }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const productId = route.params.product
const products = ref<any[]>([])
const product = ref<any>(null)
onMounted(async () => {
  const res = await fetch('/api/products')
  products.value = await res.json()
  product.value = products.value.find((p: any) => String(p.id) === String(productId))
  if (product.value && typeof product.value.specs === 'string') {
    try { product.value.specs = JSON.parse(product.value.specs) } catch {}
  }
})
</script>
<style scoped>
.fade-in {
  animation: fadeInUp 0.8s cubic-bezier(.23,1.02,.32,1) both;
}
.product-detail {
  max-width: 950px;
  margin: 0 auto;
  padding: 38px 0;
}
.prod-detail-flex {
  display: flex;
  gap: 56px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.prod-img-gradient {
  background: var(--gradient2);
  border-radius: 24px;
  padding: 12px;
  box-shadow: 0 8px 32px rgba(102,126,234,0.10);
  margin-bottom: 18px;
}
.prod-img {
  width: 420px;
  height: 320px;
  object-fit: contain;
  border-radius: 16px;
  background: #f7f7f7;
  box-shadow: 0 2px 8px rgba(56,249,215,0.08);
}
.prod-info {
  flex: 1;
  min-width: 260px;
}
.prod-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 18px;
  letter-spacing: 0.5px;
}
.prod-price-gradient {
  font-size: 1.6rem;
  font-weight: 800;
  background: var(--gradient2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 18px;
}
.prod-desc {
  font-size: 1.13rem;
  color: #222;
  margin-bottom: 28px;
}
.prod-specs {
  margin-top: 38px;
  background: #f7f8fa;
  border-radius: 16px;
  padding: 24px 32px;
  box-shadow: 0 2px 12px rgba(102,126,234,0.06);
  animation-delay: 0.2s;
}
.prod-specs h3 {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 14px;
}
.prod-specs ul {
  margin: 0;
  padding: 0 0 0 18px;
  font-size: 1.08rem;
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}
</style> 