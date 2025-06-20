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
import type { Database } from '~/types/database.types';
const client = useSupabaseClient<Database>();

const { data: products } = await useAsyncData('products', async () => {
  const { data } = await client.from('products').select('created_at, description, id, image_url, name, price').order('created_at');

  return data ?? [];
});

const popularProducts: Database['public']['Tables']['products']['Row'][] = products.value?.slice(0, 8) ?? [];
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
