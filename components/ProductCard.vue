<template>
  <nuxt-link class="product-card" :to="`/products/${product.id}`">
    <img :src="product.image" alt="Product Image" class="product-image" />
    <span>{{ product.name }}</span>
    <p>{{ formatPrice(product.price) }} руб.</p>
  </nuxt-link>
</template>

<script lang="ts" setup>
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}
const props = defineProps<{ product: Product }>();
const cartStore = useCartStore();
const device = useDevice();

const addToCart = () => {
  cartStore.addToCart(props.product);
};
const formatPrice = (price: number) => {
  return price.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<style lang="scss" scoped>
.product-card {
  border: 1px solid $borderColor;
  padding: 16px;
  text-align: center;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }

  span {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    color: #666;
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
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.btn {
  padding: 8px 16px;
  background-color: $backgroundColorBtn;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: $backgroundColorBtnHover;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
