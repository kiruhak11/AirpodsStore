<template>
  <main>
    <div class="container">
      <div class="search-container">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          placeholder="Поиск продуктов..."
        />
        <USelectMenu v-model="selected" :options="options">
          <template #leading>
            <UIcon v-if="selected?.icon" :name="(selected.icon as string)" class="w-5 h-5" />
          </template>
        </USelectMenu>
      </div>
      <div class="product-list">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" @add-to-cart="addToCart" />
      </div>
    </div>
  </main>
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

const options = ref([
  {
    id: 'asc',
    label: 'По возрастанию цены',
    icon: 'i-heroicons-arrow-up-20-solid',
  },
  {
    id: 'desc',
    label: 'По убыванию цены',
    icon: 'i-heroicons-arrow-down-20-solid',
  },
]);

const selected = ref(options.value[0]);

const cartStore = useCartStore();
const searchQuery = ref('');

const filteredProducts = computed(() => {
  const filtered = products.filter((product) => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()));

  // Сортировка продуктов по цене
  filtered.sort((a, b) => {
    return selected.value.id === 'asc' ? a.price - b.price : b.price - a.price;
  });

  return filtered;
});

const addToCart = (product: Product) => {
  cartStore.addToCart(product);
  alert(`${product.name} добавлен в корзину!`);
};
</script>

<style scoped>
.search-container {
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 14px;
  padding-top: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Адаптивное количество колонок */
  justify-content: center;
  gap: 16px;
  padding-bottom: 24px;
}
</style>
