<template>
  <NuxtLayout>
    <main class="cart-container">
      <h2>Корзина</h2>
      <transition-group name="fade" tag="ul" class="cart-list">
        <li v-for="item in cart" :key="item.product.id" class="cart-item">
          <nuxt-link :to="`/products/${item.product.id}`" class="item-link">
            <img :src="item.product.image" alt="Product Image" class="cart-item-image" />
          </nuxt-link>
          <nuxt-link :to="`/products/${item.product.id}`" class="cart-item-details">
            <div>
              <h3>{{ item.product.name }}</h3>
              <p>{{ formatPrice(item.product.price) }} руб.</p>
            </div>
          </nuxt-link>
          <div class="quantity-controls">
            <button class="quantity-button" @click="decreaseQuantity(item.product.id)">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button class="quantity-button" @click="increaseQuantity(item.product.id)">+</button>
          </div>
          <button class="remove-button" @click="removeFromCart(item.product.id)">Удалить</button>
        </li>
      </transition-group>
      <div class="cart-summary">
        <p class="total-price">Итого: {{ formatPrice(totalPrice) }} руб.</p>
        <div class="summary-buttons">
          <button class="clear-button" @click="clearCart">Очистить корзину</button>
          <button class="offer-button" @click="checkout">Оформить заказ</button>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useSupabaseClient } from '#imports';

const cartStore = useCartStore();
const router = useRouter();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = useSupabaseClient();
const cart = computed(() => cartStore.cart);
const totalPrice = computed(() => cartStore.totalPrice);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const user = useSupabaseUser();
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
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const checkout = async () => {
  try {
    // Собираем данные заказа
    const orderData = {
      name: '123', // Можно добавить форму для имени
      phone: '123', // Можно добавить форму для телефона
      address: '123', // Можно добавить форму для адреса
      email: '123', // Можно добавить форму для email
      cart: cart.value.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    };

    // Отправляем заказ на сервер
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();

    if (data.status !== 'ok') {
      alert('Ошибка оформления заказа: ' + (data.detail ? JSON.stringify(data.detail) : data.message));
      return;
    }

    clearCart();
    alert('Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.');
    router.push('/products');
  } catch (err) {
    alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
  }
};

onMounted(() => {
  if (cartStore.cart.length === 0) {
    router.push('/products');
  }
});
</script>

<style lang="scss" scoped>
.cart-container {
  padding: 32px;
  background-color: var(--background-color-cart);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--color-text);
  margin: 32px auto;
  max-width: 800px;
  border-radius: 8px;
  font-family: 'Arial', sans-serif;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  margin: 16px 0;
  padding: 16px;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}

.cart-item-details {
  flex-grow: 1;
}
.price {
  font-size: 20px;
  font-weight: bold;
}
.quantity-controls {
  display: flex;
  align-items: center;
  padding-right: 10px;
}

.quantity-button {
  padding: 8px;
  background-color: var(--background-color-btn);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--background-color-btn-hover);
  }
}

.quantity {
  margin: 0 16px;
  font-size: 19px;
  font-weight: bold;
}

.remove-button {
  padding: 8px 16px;
  background-color: var(--background-color-btn-remove);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--background-color-btn-remove-hover);
  }
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 16px;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.total-price {
  font-size: 24px;
  font-weight: bold;
}

.summary-buttons {
  display: flex;
  gap: 16px; /* Расстояние между кнопками */
}

.clear-button,
.offer-button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-button {
  background-color: var(--background-color-btn-remove);
  color: var(--color-text);

  &:hover {
    background-color: var(--background-color-btn-remove-hover);
  }
}

.offer-button {
  background-color: var(--background-color-btn-offer);
  color: white;

  &:hover {
    background-color: var(--background-color-btn-offer-hover);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
@media (max-width: 768px) {
  .cart-container {
    padding: 16px;
  }
  .cart-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .cart-item-image {
    width: 100px;
    height: 100px;
  }
  .cart-summary {
    flex-direction: column;
    align-items: center;
  }
  .cart-item {
    flex-direction: column;
    margin: 8px 0;
    align-items: stretch;
  }

  .cart-item-image {
    margin-bottom: 16px;
    display: flex;
  }
  .quantity-button {
    min-width: 40px;
  }
  .quantity {
    font-size: 24px;
  }
  .quantity-controls {
    justify-content: center;
    margin: 8px 0;
  }
  .clear-button,
  .offer-button {
    padding: 12px 16px;
    font-size: 19px;
  }
  .item-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cart-item-details {
    text-align: center;
  }
  .summary-buttons {
    flex-direction: column;
    width: 100%;
    margin-top: 16px;
  }
}
</style>
