<template>
  <main>
    <div class="container">
      <div class="search-container">
        <input
          v-model="searchQuery"
          placeholder="Поиск продуктов..."
          class="search-input"
        />
      </div>
      <div class="filter-buttons">
        <button @click="sortByPriceAsc" class="filter-button">
          Цена по возрастанию
        </button>
        <button @click="sortByPriceDesc" class="filter-button">
          Цена по убыванию
        </button>
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

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
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

export default defineComponent({
  components: {
    ProductCard,
  },
  setup() {
    const cartStore = useCartStore();
    const searchQuery = ref("");
    const sortOrder = ref<"asc" | "desc" | null>(null);

    const filteredProducts = computed(() => {
      let filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );

      if (sortOrder.value === "asc") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } else if (sortOrder.value === "desc") {
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

    return {
      products,
      searchQuery,
      filteredProducts,
      addToCart,
      sortByPriceAsc,
      sortByPriceDesc,
    };
  },
});
</script>

<style scoped>
.search-container {
  display: flex;
  padding-top: 10px;
  justify-content: center;
  margin-bottom: 1rem;
}

.search-input {
  padding: 0.75rem 1rem;
  width: 100%;
  max-width: 1290px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
  outline: none;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
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
}

.filter-button:hover {
  background-color: #0056b3;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
