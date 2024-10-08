<template>
  <div class="popular-products">
    <h2>Популярные товары</h2>
    <div class="product-carousel">
      <div class="product-list">
        <ProductCard v-for="product in popularProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { products } from '~/data/products';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const popularProducts: Product[] = products.slice(0, 5); // Выбираем первые 5 продуктов как популярные
</script>

<style lang="scss" scoped>
.popular-products {
  margin: 32px 0;
}

.product-carousel {
  overflow-x: auto;
  display: flex;
  gap: 16px;
  padding: 16px 0;
}

.product-list {
  display: flex;
  gap: 16px;
}
</style>
