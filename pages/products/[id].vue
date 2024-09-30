<template>
  <main>
    <div class="product-details" v-if="product">
      <img :src="product.image" alt="Product Image" class="product-image" />
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="product-price">
          <span class="original-price"
            >{{ formatPrice(originalPrice) }} руб.</span
          >
          <span class="discounted-price"
            >{{ formatPrice(product.price) }} руб.</span
          >
        </p>
        <h2>Описание</h2>
        <p class="product-description">{{ product.description }}</p>
        <div v-if="isInCart" class="quantity-controls__wpapper">
          <div class="quantity-controls">
            <button
              @click="decreaseQuantity"
              :class="[
                'quantity-button',
                { 'quantity-button_red': cartItem?.quantity === 1 },
              ]"
            >
              -
            </button>
            <span class="quantity">{{ cartItem?.quantity }}</span>
            <button @click="increaseQuantity" class="quantity-button">+</button>
          </div>
        </div>
        <button v-else @click="addToCart" class="btn">
          Добавить в корзину
        </button>
      </div>
    </div>
    <div v-else>
      <div class="not-found">
        <h2>Product not found</h2>
        <p>Sorry, we couldn't find the product you were looking for.</p>
        <p>Please check the URL and try again.</p>
        <p>Product not found.</p>
        <nuxt-link :to="`/product`" class="btn">Назад</nuxt-link>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { products } from "~/data/products";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
}

const route = useRoute();
const cartStore = useCartStore();
const productId = parseInt(route.params.id as string);
const product = computed(
  () => products.find((p) => p.id === productId) as Product
);
const cartItem = computed(() =>
  cartStore.cart.find((item) => item.product.id === productId)
);
const isInCart = computed(() => !!cartItem.value);

const formatPrice = (price: number) => {
  return price.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const addToCart = () => {
  cartStore.addToCart(product.value);
};

const removeFromCart = () => {
  cartStore.removeFromCart(productId);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  color: $colorText;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 1290px;
  margin: 50px auto;
}

.product-image {
  max-width: 50%;
  border-radius: 8px;
}

.product-info {
  max-width: 45%;
}

.product-price {
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  width: 300px;
  border-radius: 8px;
  flex-direction: column;
  background-color: $priceBackgroundColor;
  margin: 1rem 0;
  position: relative;
}

.original-price {
  padding: 0.5rem 1rem;
  text-decoration: line-through;
  color: $originalPriceColor;
  font-size: 1rem;
}

.discounted-price {
  color: $discountedPriceColor;
  padding: 0.5rem 1rem;
  display: inline-block;
}

.product-description {
  margin: 1rem 0;
}

.btn {
  padding: 0.75rem 1.5rem;
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

.quantity-controls {
  display: flex;
  align-items: center;

  &__wpapper {
    height: 42px;
  }
}

.quantity-button {
  padding: 0.5rem;
  background-color: $backgroundColorBtn;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: $backgroundColorBtnHover;
  }

  &_red {
    background-color: $backgroundColorBtnRemove;

    &:hover {
      background-color: $backgroundColorBtnRemoveHover;
    }
  }
}
.quantity {
  margin: 0 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
