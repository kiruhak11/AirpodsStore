<template>
  <main>
    <div class="container">
      <div class="search-container">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          v-model="searchQuery"
          placeholder="Поиск продуктов..."
        />
        <USelectMenu v-model="selected" :options="options">
          <template #leading>
            <UIcon
              v-if="selected?.icon"
              :name="(selected.icon as string)"
              class="w-5 h-5"
            />
          </template>
        </USelectMenu>
      </div>
      <div class="product-list">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import ProductCard from "~/components/ProductCard.vue";
import { useCartStore } from "~/stores/cart";
import { products } from "~/data/products";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const options = ref([
  {
    id: "asc",
    label: "По возрастанию цены",
    icon: "i-heroicons-arrow-up-20-solid",
  },
  {
    id: "desc",
    label: "По убыванию цены",
    icon: "i-heroicons-arrow-down-20-solid",
  },
]);

const selected = ref(options.value[0]);

const cartStore = useCartStore();
const searchQuery = ref("");

const filteredProducts = computed(() => {
  let filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (selected.value.id === "asc") {
    filtered = filtered.sort((a, b) => a.price - b.price);
  } else {
    filtered = filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
});

const addToCart = (product: Product) => {
  cartStore.addToCart(product);
  alert(`${product.name} has been added to the cart!`);
};

const sortByPriceAsc = () => {
  sortOrder.value = "asc";
};

const sortByPriceDesc = () => {
  sortOrder.value = "desc";
};

onMounted(() => {
  cartStore.loadCart();
});
</script>

<style scoped>
.search-container {
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 14px;
  padding-top: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-buttons {
  margin-bottom: 1rem;
}

.filter-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
}

.product-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  gap: 1rem;
  padding-bottom: 24px;
}
</style>
