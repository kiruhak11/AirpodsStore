<template>
  <div class="cart-page">
    <h1 class="cart-title">Корзина</h1>
    <ClientOnly>
      <template #default>
        <div v-if="cart.items.length === 0" class="cart-empty">
          <p>Ваша корзина пуста</p>
          <NuxtLink to="/catalog" class="cart-back">Перейти в каталог</NuxtLink>
        </div>
        <div v-else class="cart-content">
          <div class="cart-list">
            <div v-for="item in cart.items" :key="item.productId" class="cart-item">
              <img :src="item.product.image || 'https://placehold.co/80x80'" :alt="item.product.name" class="cart-item__img" />
              <div class="cart-item__info">
                <div class="cart-item__name">{{ item.product.name }}</div>
                <div class="cart-item__price">{{ item.product.price.toFixed(2) }} ₽</div>
                <div class="cart-item__quantity">
                  <button @click="changeQty(item, item.quantity - 1)">−</button>
                  <input
                    type="number"
                    :value="item.quantity"
                    @change="onInputQty(item, $event)"
                    min="1"
                  />
                  <button @click="changeQty(item, item.quantity + 1)">+</button>
                </div>
                <div class="cart-item__sum">Сумма: {{ (item.product.price * item.quantity).toFixed(2) }} ₽</div>
              </div>
              <button class="cart-item__remove" @click="cart.removeItem(item.productId)">✕</button>
            </div>
          </div>
          <div class="cart-summary">
            <div class="cart-total">Итого: <b>{{ cart.total.toFixed(2) }} ₽</b></div>
            <form @submit.prevent="order" class="cart-order-form">
              <label for="phone" class="cart-phone-label">Ваш телефон для связи:</label>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                class="cart-phone-input"
                placeholder="+7 999 123-45-67"
                required
              />
              <button class="cart-order" type="submit">Оформить заказ</button>
            </form>
            <button class="cart-clear" @click="cart.clearCart">Очистить корзину</button>
          </div>
        </div>
      </template>
      <template #fallback>
        <div class="cart-empty">Загрузка корзины...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()
const phone = ref('')

function changeQty(item: any, qty: number) {
  if (qty < 1) return
  cart.updateQuantity(item.id, qty)
}

function onInputQty(item: any, event: Event) {
  const qty = Number((event.target as HTMLInputElement).value)
  if (qty > 0) changeQty(item, qty)
}

function order() {
  if (!phone.value.trim()) {
    alert('Пожалуйста, введите номер телефона для связи!')
    return
  }
  // Формируем текст заказа
  const orderText = [
    '🛒 Новый заказ!',
    '',
    ...cart.items.map((item, idx) =>
      `${idx + 1}. ${item.product.name} x${item.quantity} — ${(item.product.price * item.quantity).toFixed(2)} ₽`
    ),
    '',
    `Итого: ${cart.total.toFixed(2)} ₽`,
    `Телефон: ${phone.value}`
  ].join('\n')

  // Telegram Bot API
  const botToken = '7813684314:AAGkfwukYo4dUIAac2Sh2sz0xfGG78rZHlA'
  const chatIds = ['641028028', '502773482']

  Promise.all(chatIds.map(chatId =>
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: orderText
      })
    })
  ))
    .then(() => {
      alert('Заказ отправлен! Мы свяжемся с вами для подтверждения.')
      cart.clearCart()
      phone.value = ''
    })
    .catch(() => {
      alert('Ошибка отправки заказа. Попробуйте позже.')
    })
}
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-card, #fff);
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
.cart-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.cart-empty {
  text-align: center;
  color: #888;
}
.cart-back {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary, #0070f3);
  text-decoration: underline;
}
.cart-content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.cart-list {
  flex: 2;
}
.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  background: #f7f8fa;
  border-radius: 0.75rem;
  padding: 1rem;
  position: relative;
}
.cart-item__img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  background: #fff;
}
.cart-item__info {
  flex: 1;
}
.cart-item__name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.cart-item__price {
  color: #888;
  margin-bottom: 0.5rem;
}
.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.cart-item__quantity button {
  width: 2rem;
  height: 2rem;
  border: none;
  background: #e2e8f0;
  border-radius: 0.3rem;
  font-size: 1.2rem;
  cursor: pointer;
}
.cart-item__quantity input {
  width: 3rem;
  text-align: center;
  border: 1px solid #cbd5e1;
  border-radius: 0.3rem;
  font-size: 1rem;
}
.cart-item__sum {
  font-size: 1rem;
  color: #222;
}
.cart-item__remove {
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.cart-summary {
  flex: 1;
  background: #f1f5f9;
  border-radius: 0.75rem;
  padding: 1.5rem;
  height: fit-content;
}
.cart-total {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}
.cart-order {
  background: var(--color-primary, #0070f3);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  width: 100%;
}
.cart-clear {
  background: #e2e8f0;
  color: #222;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}
.cart-order-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.cart-phone-label {
  font-size: 1rem;
  font-weight: 500;
}
.cart-phone-input {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
}
</style>
