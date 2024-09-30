<template>
  <main class="cart-container">
    <h2>Shopping Cart</h2>
    {{ cartStore.cart.length }}
    <transition-group name="fade" tag="ul" class="cart-list">
      <li
        href="#"
        v-for="item in cart"
        :key="item.product.id"
        class="cart-item"
      >
        <nuxt-link :to="`/products/${item.product.id}`"
          ><img
            :src="item.product.image"
            alt="Product Image"
            class="cart-item-image"
        /></nuxt-link>
        <nuxt-link
          :to="`/products/${item.product.id}`"
          class="cart-item-details"
          ><div class="cart-item-details">
            <h3>{{ item.product.name }}</h3>
            <p>{{ formatPrice(item.product.price * item.quantity) }} руб.</p>
          </div></nuxt-link
        >
        <div class="quantity-controls">
          <button
            @click="decreaseQuantity(item.product.id)"
            class="quantity-button"
          >
            -
          </button>
          <span class="quantity">{{ item.quantity }}</span>
          <button
            @click="increaseQuantity(item.product.id)"
            class="quantity-button"
          >
            +
          </button>
        </div>
        <button @click="removeFromCart(item.product.id)" class="remove-button">
          Удалить
        </button>
      </li>
    </transition-group>
    <div class="cart-summary">
      <p class="total-price">Итого: {{ formatPrice(totalPrice) }} руб.</p>
      <button @click="clearCart" class="clear-button">Очистить корзину</button>

      <button @click="" class="offer-button">Оформить заказ</button>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
const cart = computed(() => cartStore.cart);
const totalPrice = computed(() => cartStore.totalPrice);

const removeFromCart = (productId: number) => {
  cartStore.removeFromCart(productId);
};

const clearCart = () => {
  cartStore.clearCart();
};

const increaseQuantity = (productId: number) => {
  cartStore.increaseQuantity(productId);
};

const decreaseQuantity = (productId: number) => {
  cartStore.decreaseQuantity(productId);
};

const formatPrice = (price: number) => {
  return price.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

onMounted(() => {
  cartStore.loadCart();

  if (cartStore.cart.length === 0) {
    return navigateTo("/products");
  }
});
</script>

<style lang="scss" scoped>
.cart-container {
  padding: 2rem;
  background-color: $cartBackgroundColor;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 800px;
  border-radius: 8px;
  font-family: "Arial", sans-serif;
}
.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cart-item {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.cart-item:hover {
  transform: translateY(-5px);
}
.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}
.cart-item-details {
  flex-grow: 1;
}
.quantity-controls {
  display: flex;
  align-items: center;
  padding-right: 10px;
}
.quantity-button {
  padding: 0.5rem;
  background-color: $backgroundColorBtn;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.quantity-button:hover {
  background-color: $backgroundColorBtnHover;
}
.quantity {
  margin: 0 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.remove-button {
  padding: 0.5rem 1rem;
  background-color: $backgroundColorBtnRemove;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.remove-button:hover {
  background-color: $backgroundColorBtnRemoveHover;
}
.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.total-price {
  font-size: 1.5rem;
  font-weight: bold;
}
.clear-button {
  padding: 0.75rem 1.5rem;
  background-color: $backgroundColorBtnRemove;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.clear-button:hover {
  background-color: $backgroundColorBtnRemoveHover;
}
.offer-button {
  padding: 0.75rem 1.5rem;
  background-color: $backgroundColorBtnOffer;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.offer-button:hover {
  background-color: $backgroundColorBtnOfferHover;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
