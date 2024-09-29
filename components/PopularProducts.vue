<template>
  <div class="popular-products">
    <h2>Популярные товары</h2>
    <div class="product-carousel">
      <div class="product-list">
        <ProductCard
          v-for="product in popularProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductCard from "~/components/ProductCard.vue";
import { products } from "~/data/products";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default defineComponent({
  components: {
    ProductCard,
  },
  setup() {
    const popularProducts: Product[] = products.slice(0, 5); // Выбираем первые 5 продуктов как популярные

    return { popularProducts };
  },
});
</script>

<style lang="scss" scoped>
.popular-products {
  margin: 2rem 0;
}

.product-carousel {
  overflow-x: auto;
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
}

.product-list {
  display: flex;
  gap: 1rem;
}
</style>
