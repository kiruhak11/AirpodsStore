<template>
  <section class="product-detail" v-if="product">
    <h1>{{ product.name }}</h1>
    <img :src="product.image || 'https://placehold.co/400x300/667eea/ffffff?text=KES+System'" :alt="product.name" class="prod-img" />
    <div class="prod-info">
      <p>{{ product.description }}</p>
      <div class="prod-price">Цена: {{ product.price }} ₽</div>
      <div v-if="product.specs && product.specs.length" class="prod-specs">
        <h3>Характеристики:</h3>
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
.product-detail {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 0;
}
.prod-img {
  width: 400px;
  height: 300px;
  object-fit: contain;
  margin-bottom: 24px;
  border-radius: 12px;
  background: #f7f7f7;
}
.prod-info {
  font-size: 1.1rem;
  color: #222;
}
.prod-price {
  font-weight: bold;
  font-size: 1.3rem;
  margin: 18px 0;
}
.prod-specs ul {
  margin: 0;
  padding: 0 0 0 18px;
}
</style> 