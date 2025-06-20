<template>
  <NuxtLayout name="default">
    <section v-if="product" class="product-section">
      <div class="product-main">
        <img :src="product.image_url" :alt="product.name" class="product-img" />
        <div class="product-content">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-price-block">
            <span class="product-price">{{ product.price.toLocaleString('ru-RU') }} ₽</span>
            <span class="product-old-price">{{ (product.price * 1.15).toLocaleString('ru-RU') }} ₽</span>
          </div>
          <p class="product-desc">{{ product.description }}</p>
          <div v-if="isInCart" class="product-controls">
            <button class="qty-btn" @click="decreaseQuantity">-</button>
            <span class="qty">{{ cartItem?.quantity }}</span>
            <button class="qty-btn" @click="increaseQuantity">+</button>
            <NuxtLink to="/cart" class="to-cart-btn">В корзину</NuxtLink>
          </div>
          <button v-else class="add-btn" @click="addToCart">Добавить в корзину</button>
        </div>
      </div>
    </section>
    <section v-else class="not-found">
      <h2>Товар не найден</h2>
      <NuxtLink to="/products" class="back-btn">Назад к каталогу</NuxtLink>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import type { Database } from '~/types/database.types';
const client = useSupabaseClient<Database>();

const route = useRoute();
const cartStore = useCartStore();
const productId = route.params.id;
const product = ref<any>(null);
const cartItem = computed(() => cartStore.cart.find((item) => item.product.id === productId));
const isInCart = computed(() => !!cartItem.value);

const fetchProduct = async () => {
  const { data } = await client.from('products').select('*').eq('id', productId).single();
  product.value = data;
};
onMounted(fetchProduct);

const addToCart = () => {
  cartStore.addToCart(product.value);
};
const increaseQuantity = () => {
  cartStore.increaseQuantity(product.value.id);
};
const decreaseQuantity = () => {
  cartStore.decreaseQuantity(product.value.id);
};
</script>

<style scoped>
.product-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 0 32px 0;
}
.product-main {
  display: flex;
  gap: 64px;
  align-items: flex-start;
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.06);
  padding: 48px 40px;
  flex-wrap: wrap;
}
.product-img {
  width: 380px;
  height: 380px;
  object-fit: contain;
  border-radius: 24px;
  background: #fafafa;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #111;
}
.product-price-block {
  display: flex;
  align-items: baseline;
  gap: 18px;
}
.product-price {
  font-size: 2rem;
  font-weight: 700;
  color: #0071e3;
}
.product-old-price {
  font-size: 1.2rem;
  color: #bbb;
  text-decoration: line-through;
}
.product-desc {
  color: #444;
  font-size: 1.2rem;
  margin-bottom: 18px;
}
.product-controls {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 12px;
}
.qty-btn {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 12px;
  padding: 8px 18px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.qty-btn:hover {
  background: #ddd;
}
.qty {
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 32px;
  text-align: center;
}
.to-cart-btn {
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.to-cart-btn:hover {
  background: #005bb5;
}
.add-btn {
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 16px 38px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 18px;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #005bb5;
}
.not-found {
  text-align: center;
  padding: 80px 0;
}
.back-btn {
  display: inline-block;
  margin-top: 32px;
  background: #eee;
  color: #333;
  border-radius: 16px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #ddd;
}
@media (max-width: 900px) {
  .product-main {
    flex-direction: column;
    align-items: center;
    gap: 32px;
    padding: 32px 10px;
  }
  .product-img {
    width: 90vw;
    height: 260px;
  }
}
</style>
