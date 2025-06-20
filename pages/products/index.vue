<template>
  <NuxtLayout name="default">
    <section class="catalog">
      <h1 class="catalog-title">Каталог AirPods</h1>
      <div class="catalog-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <NuxtLink :to="`/products/${product.id}`" class="product-link">
            <img :src="product.image_url" :alt="product.name" class="product-img" />
            <div class="product-info">
              <h2 class="product-name">{{ product.name }}</h2>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-bottom">
                <span class="product-price">{{ product.price.toLocaleString('ru-RU') }} ₽</span>
              </div>
            </div>
          </NuxtLink>
          <button class="add-btn" @click="addToCart(product)">В корзину</button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import type { Database } from '~/types/database.types';
const client = useSupabaseClient<Database>();

const { data: products } = await useAsyncData('products', async () => {
  const { data } = await client.from('products').select('id, name, price, image_url, description').order('created_at');
  return data ?? [];
});

const cartStore = useCartStore();
const addToCart = (product: any) => {
  cartStore.addToCart(product);
};
</script>

<style scoped>
.catalog {
  padding: 32px 0 0;
}
.catalog-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: #111;
}
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.product-card {
  position: relative;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 24px 24px;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}
.product-card:hover {
  box-shadow: 0 8px 32px rgba(0, 113, 227, 0.1);
  transform: translateY(-4px) scale(1.02);
}
.product-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.08));
}
.product-info {
  width: 100%;
  text-align: center;
}
.product-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222;
}
.product-desc {
  color: #666;
  font-size: 1rem;
  margin-bottom: 18px;
  min-height: 40px;
}
.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
}
.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0071e3;
}
.product-link {
  display: block;
  width: 100%;
  text-decoration: none;
  color: inherit;
}
.add-btn {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 2;
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #005bb5;
}
</style>
