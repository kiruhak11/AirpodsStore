<template>
  <NuxtLayout name="default">
    <main>
      <div class="product-details container" v-if="product">
        <img :src="product.image" alt="Product Image" class="product-image" />
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="product-price">
            <span class="original-price">{{ formatPrice(originalPrice) }} руб.</span>
            <span class="discounted-price">{{ formatPrice(product.price) }} руб.</span>
          </p>
          <h2>Описание</h2>
          <p class="product-description">{{ product.description }}</p>

          <div v-if="isInCart" class="quantity-controls__wrapper">
            <div class="quantity-controls">
              <button @click="decreaseQuantity" :class="['quantity-button', { 'quantity-button_red': cartItem?.quantity === 1 }]">-</button>
              <span class="quantity">{{ cartItem?.quantity }}</span>
              <button @click="increaseQuantity" class="quantity-button">+</button>
            </div>
            <nuxt-link :to="`/cart`" class="btn-cart">Перейти в корзину</nuxt-link>
          </div>

          <button v-if="!isInCart" class="btn-add" :class="{ compressed: buttonCompressed }" @click="addToCart">Добавить в корзину</button>
        </div>
      </div>
      <div v-else>
        <div class="not-found">
          <h2>Товар не найден</h2>
          <p>Извините, мы не смогли найти запрашиваемый вами товар.</p>
          <p>Пожалуйста, проверьте URL и попробуйте снова.</p>
          <p>Товар не найден.</p>
          <nuxt-link :to="`/products`" class="btn">Назад</nuxt-link>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Database } from '~/types/database.types';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
}

const client = useSupabaseClient<Database>();
const { data: products } = await useAsyncData('products', async () => {
  const { data } = await client.from('products').select('created_at, description, id, image, name, price').order('created_at');
  return data ?? [];
});

const route = useRoute();
const cartStore = useCartStore();
const productId = parseInt(route.params.id as string);
const product = computed(() => products.value?.find((p) => p.id === productId) as Product);
const cartItem = computed(() => cartStore.cart.find((item) => item.product.id === productId));
const isInCart = computed(() => !!cartItem.value);

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Локальная переменная для отслеживания сжатия кнопки
const buttonCompressed = ref(false);

const addToCart = () => {
  buttonCompressed.value = true;
  setTimeout(() => {
    cartStore.addToCart(product.value);
  }, 400); // Задержка анимации
};

const increaseQuantity = () => {
  cartStore.increaseQuantity(productId);
};

const decreaseQuantity = () => {
  cartStore.decreaseQuantity(productId);
};

const originalPrice = computed(() => product.value.price * 1.15);
</script>

<style lang="scss" scoped>
.product-details {
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background-color);
  color: var(--color-text);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1290px;
  margin: 50px auto;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
}

.product-image {
  border-radius: 8px;
}

.product-info {
  padding-left: 40px;
  max-width: 100%;

  h1 {
    font-size: 32px;
    font-weight: bold;
  }

  h2 {
    font-size: 24px;
    font-weight: bold;
  }
}

.product-price {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  width: 300px;
  border-radius: 8px;
  flex-direction: column;
  background-color: var(--background-color-price);
  margin: 16px 0;
  position: relative;
}

.original-price {
  padding: 8px 16px;
  text-decoration: line-through;
  color: var(--original-price-color);
  font-size: 16px;
}

.discounted-price {
  color: var(--discounted-price-color);
  padding: 8px 16px;
  display: inline-block;
}

.product-description {
  text-wrap: balance;
  margin: 1rem 0;
}

.btn {
  &-add {
    padding: 12px 24px;
    background-color: var(--background-color-btn);
    color: var(--color-text);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%; // Ширина на 100%

    &:hover {
      background-color: var(--background-color-btn-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
  }

  &-cart {
    padding: 12px 24px;
    background-color: var(--background-color-btn);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.quantity-controls__wrapper {
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;

  .quantity-button {
    padding: 8px;
    background-color: var(--background-color-btn);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--background-color-btn-hover);
    }

    &_red {
      background-color: var(--background-color-btn-remove);

      &:hover {
        background-color: var(--background-color-btn-remove-hover);
      }
    }
  }

  .quantity {
    margin: 0 16px;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
