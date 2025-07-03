<template>
  <div class="cart-page-pro scroll-reveal">
    <h1 class="cart-title-pro"><Icon icon="lucide:shopping-cart" /> Корзина</h1>
    <ClientOnly>
      <template #default>
        <div v-if="cart.items.length === 0" class="cart-empty-pro">
          <Icon icon="lucide:shopping-bag" class="cart-empty-pro__icon" />
          <p>Ваша корзина пуста</p>
          <NuxtLink to="/catalog" class="cart-back-pro">Перейти в каталог</NuxtLink>
        </div>
        <div v-else class="cart-content-pro">
          <div class="cart-list-pro">
            <transition-group name="fade-slide-pro" tag="div">
              <div v-for="item in cart.items" :key="item.productId" class="cart-item-pro">
                <div class="cart-item-pro__img-wrap">
                  <img :src="item.product.image || 'https://placehold.co/80x80'" :alt="item.product.name" class="cart-item-pro__img" />
                </div>
                <div class="cart-item-pro__info">
                  <div class="cart-item-pro__name">{{ item.product.name }}</div>
                  <div class="cart-item-pro__price">{{ item.product.price.toFixed(2) }} ₽</div>
                  <div class="cart-item-pro__quantity">
                    <button @click="changeQty(item, item.quantity - 1)"><Icon icon="lucide:minus" /></button>
                    <input
                      type="number"
                      :value="item.quantity"
                      @change="onInputQty(item, $event)"
                      min="1"
                    />
                    <button @click="changeQty(item, item.quantity + 1)"><Icon icon="lucide:plus" /></button>
                  </div>
                  <div class="cart-item-pro__sum">Сумма: {{ (item.product.price * item.quantity).toFixed(2) }} ₽</div>
                </div>
                <button class="cart-item-pro__remove" @click="cart.removeItem(item.productId)"><Icon icon="lucide:x" /></button>
              </div>
            </transition-group>
          </div>
          <div class="cart-summary-pro">
            <div class="cart-total-pro">Итого: <b>{{ cart.total.toFixed(2) }} ₽</b></div>
            <form @submit.prevent="order" class="cart-order-form-pro">
              <label for="phone" class="cart-phone-label-pro">Ваш телефон для связи:</label>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                class="cart-phone-input-pro"
                placeholder="+7 999 123-45-67"
                required
              />
              <button class="cart-order-pro" type="submit"><Icon icon="lucide:send" /> Оформить заказ</button>
            </form>
            <button class="cart-clear-pro" @click="cart.clearCart"><Icon icon="lucide:trash-2" /> Очистить корзину</button>
          </div>
        </div>
      </template>
      <template #fallback>
        <div class="cart-empty-pro">Загрузка корзины...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
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

<style scoped lang="scss">
.cart-page-pro {
  max-width: 980px;
  margin: 2.5rem auto;
  padding: 2.5rem 1.5rem;
  background: rgba(255,255,255,0.18);
  border-radius: 2rem;
  box-shadow: 0 8px 48px rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
  backdrop-filter: blur(18px);
}
.cart-title-pro {
  font-size: 2.3rem;
  font-weight: 900;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.6em;
  justify-content: center;
}
.cart-empty-pro {
  text-align: center;
  color: #888;
  padding: 3rem 0 2rem 0;
  &__icon {
    font-size: 3.5em;
    color: var(--color-primary);
    margin-bottom: 1.2em;
    filter: drop-shadow(0 0 8px #38f9d7cc);
  }
}
.cart-back-pro {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--color-primary, #38f9d7);
  text-decoration: underline;
  font-weight: 700;
  font-size: 1.1em;
  transition: color 0.18s;
  &:hover {
    color: #667eea;
  }
}
.cart-content-pro {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
}
.cart-list-pro {
  flex: 2;
  min-width: 0;
}
.cart-item-pro {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  background: rgba(255,255,255,0.22);
  border-radius: 1.2rem;
  padding: 1.2rem 1.2rem 1.2rem 1.2rem;
  position: relative;
  box-shadow: 0 2px 16px rgba(56,249,215,0.08);
  border: 2px solid rgba(102,126,234,0.10);
  transition: box-shadow 0.22s, transform 0.22s, border 0.22s;
  backdrop-filter: blur(10px);
  &:hover {
    box-shadow: 0 8px 32px rgba(56,249,215,0.13), 0 2px 16px rgba(67,233,123,0.13);
    transform: translateY(-4px) scale(1.03);
    border: 2px solid #38f9d7;
    z-index: 2;
  }
  &__img-wrap {
    width: 80px;
    height: 80px;
    border-radius: 1em;
    background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px #38f9d733;
  }
  &__img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 0.8em;
  }
  &__info {
    flex: 1;
    min-width: 0;
  }
  &__name {
    font-weight: 700;
    font-size: 1.15rem;
    margin-bottom: 0.5rem;
  }
  &__price {
    color: #667eea;
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 1.08rem;
  }
  &__quantity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    button {
      width: 2.2rem;
      height: 2.2rem;
      border: none;
      background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
      color: #fff;
      border-radius: 0.7em;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
      &:hover {
        background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
        box-shadow: 0 2px 8px #38f9d7cc;
        transform: scale(1.08);
      }
    }
    input {
      width: 3rem;
      text-align: center;
      border: 1.5px solid #cbd5e1;
      border-radius: 0.5em;
      font-size: 1.08rem;
      background: rgba(255,255,255,0.7);
      color: #222;
      transition: border 0.18s, box-shadow 0.18s;
      &:focus {
        border-color: #38f9d7;
        outline: none;
        box-shadow: 0 0 0 2px #38f9d7cc;
      }
    }
  }
  &__sum {
    color: #222;
    font-weight: 600;
    font-size: 1.05rem;
  }
  &__remove {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: #e53e3e;
    font-size: 1.3em;
    cursor: pointer;
    opacity: 0.7;
    transition: color 0.18s, opacity 0.18s, transform 0.18s;
    &:hover {
      color: #ff4d4f;
      opacity: 1;
      transform: scale(1.15);
    }
  }
}
.cart-summary-pro {
  flex: 1;
  min-width: 260px;
  background: rgba(255,255,255,0.22);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(56,249,215,0.08);
  border: 2px solid rgba(102,126,234,0.10);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.2rem;
  backdrop-filter: blur(10px);
}
.cart-total-pro {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  color: #222;
  text-align: left;
}
.cart-order-form-pro {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.cart-phone-label-pro {
  font-size: 1.05em;
  color: #7b8a9c;
  margin-bottom: 0.2em;
}
.cart-phone-input-pro {
  width: 100%;
  padding: 0.9em 1.1em;
  border-radius: 1em;
  border: 1.5px solid var(--color-border, #cbd5e1);
  background: rgba(255,255,255,0.45);
  font-size: 1.08em;
  color: var(--color-text, #222);
  transition: border 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 4px rgba(56,249,215,0.04);
  &:focus {
    border-color: var(--color-primary, #38f9d7);
    outline: none;
    box-shadow: 0 0 0 2px #38f9d7cc;
  }
}
.cart-order-pro {
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.15rem;
  border: none;
  border-radius: 2em;
  padding: 0.9em 2.2em;
  box-shadow: 0 4px 16px rgba(56,249,215,0.10);
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.7em;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
    box-shadow: 0 8px 32px rgba(56,249,215,0.13);
    transform: translateY(-2px) scale(1.04);
  }
}
.cart-clear-pro {
  background: none;
  border: none;
  color: #e53e3e;
  font-weight: 700;
  font-size: 1.08em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  margin-top: 0.7em;
  opacity: 0.7;
  transition: color 0.18s, opacity 0.18s, transform 0.18s;
  &:hover {
    color: #ff4d4f;
    opacity: 1;
    transform: scale(1.08);
  }
}
// Анимации
.fade-slide-pro-enter-active, .fade-slide-pro-leave-active {
  transition: all 0.7s cubic-bezier(.23,1,.32,1);
}
.fade-slide-pro-enter-from, .fade-slide-pro-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}
// Адаптивность
@media (max-width: 900px) {
  .cart-content-pro {
    flex-direction: column;
    gap: 1.5rem;
  }
  .cart-summary-pro {
    margin-top: 1.5rem;
    min-width: 0;
  }
}
@media (max-width: 600px) {
  .cart-page-pro {
    padding: 1rem 0.2rem;
    border-radius: 1rem;
  }
  .cart-title-pro {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }
  .cart-item-pro {
    padding: 0.7rem 0.5rem;
    border-radius: 0.7rem;
    gap: 0.7rem;
  }
  .cart-item-pro__img-wrap {
    width: 48px;
    height: 48px;
  }
  .cart-item-pro__img {
    width: 40px;
    height: 40px;
  }
  .cart-summary-pro {
    padding: 1rem 0.5rem;
    border-radius: 0.7rem;
  }
}
</style>
