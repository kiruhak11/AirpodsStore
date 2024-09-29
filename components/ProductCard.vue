<template>
  <div class="product-card">
    <nuxt-link :to="`/products/${product.id}`">
      <img :src="product.image" alt="Product Image" class="product-image" />
      <h3>{{ product.name }}</h3>
      <p>{{ formatPrice(product.price) }} руб.</p></nuxt-link
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useCartStore } from "~/stores/cart";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default defineComponent({
  name: "ProductCard",
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },

  setup(props) {
    const cartStore = useCartStore();

    const addToCart = () => {
      cartStore.addToCart(props.product);
    };
    const formatPrice = (price: number) => {
      return price.toLocaleString("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };
    return {
      addToCart,
      formatPrice,
    };
  },
});
</script>

<style lang="scss" scoped>
.product-card {
  border: 1px solid $borderColor;
  padding: 1rem;
  margin: 1rem;
  text-align: center;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-card:hover {
  transform: translateY(-5px);
}
.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.btn {
  padding: 0.5rem 1rem;
  background-color: $backgroundColorBtn;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  background-color: $backgroundColorBtnHover;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
</style>
