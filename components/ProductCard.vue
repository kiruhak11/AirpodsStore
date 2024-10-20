<template>
  <nuxt-link class="product-card" :to="`/products/${product.id}`">
    <img :src="product.image" alt="Product Image" class="product-image" />
    <span>{{ product.name }}</span>
    <p>{{ formatPrice(product.price) }} руб.</p>
  </nuxt-link>
</template>

<script lang="ts" setup>
import type { Database } from '~/types/database.types';

defineProps<{ product: Database['public']['Tables']['products']['Row'] }>();

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<style lang="scss" scoped>
.product-card {
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.87, 0, 0.36, 1.58);
  padding: 16px;
  text-align: center;
  background-color: var(--background-color-card);
  color: var(--color-text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transform: translateY(0);

  &:hover {
    transform: translateY(-5px);
    border: 1px solid var(--color-text);
  }

  span {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    color: var(--price-color);
  }

  @media (max-width: 768px) {
    padding: 8px;

    span {
      font-size: 16px;
    }

    p {
      font-size: 15px;
    }
  }
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.btn {
  padding: 8px 16px;
  background-color: var(--background-color-btn);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--background-color-btn-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
