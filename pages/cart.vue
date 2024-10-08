<template>
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
          <button @click="decreaseQuantity(item.product.id)" class="quantity-button">-</button>
          <span class="quantity">{{ item.quantity }}</span>
          <button @click="increaseQuantity(item.product.id)" class="quantity-button">+</button>
        </div>
        <button @click="removeFromCart(item.product.id)" class="remove-button">Удалить</button>
      </li>
    </transition-group>
    <div class="cart-summary">
      <p class="total-price">Итого: {{ formatPrice(totalPrice) }} руб.</p>
      <div class="summary-buttons">
        <button @click="clearCart" class="clear-button">Очистить корзину</button>
        <button @click="checkout" class="offer-button">Оформить заказ</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
const cartStore = useCartStore();
const router = useRouter();
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
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const checkout = () => {
  alert('Функция оформления заказа пока недоступна.');
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
  background-color: $cartBackgroundColor;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: white;
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
  background-color: $backgroundColorBtn;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: $backgroundColorBtnHover;
  }
}

.quantity {
  margin: 0 16px;
  font-size: 19px;
  font-weight: bold;
}

.remove-button {
  padding: 8px 16px;
  background-color: $backgroundColorBtnRemove;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: $backgroundColorBtnRemoveHover;
  }
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 16px;
  background-color: white;
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
  background-color: $backgroundColorBtnRemove;
  color: white;

  &:hover {
    background-color: $backgroundColorBtnRemoveHover;
  }
}

.offer-button {
  background-color: $backgroundColorBtnOffer;
  color: white;

  &:hover {
    background-color: $backgroundColorBtnOfferHover;
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
    min-width: 40px; /* Увеличиваем минимальную ширину кнопок */
  }
  .quantity {
    font-size: 24px; /* Увеличиваем размер текста для количества */
  }
  .quantity-controls {
    justify-content: center; /* Центрируем кнопки */
    margin: 8px 0; /* Увеличиваем отступы для улучшения читаемости */
  }
  .clear-button,
  .offer-button {
    padding: 12px 16px; /* Увеличиваем размер кнопок */
    font-size: 19px; /* Увеличиваем размер шрифта для кнопок */
  }
  .item-link {
    display: flex;
    align-items: center; /* Центрируем элементы в строке */
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
