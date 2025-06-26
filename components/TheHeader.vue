<template>
  <header class="header">
    <Button v-if="isProductPage" class="btn-back" @click="$router.back()">Назад</Button>
    <div v-if="!isProductPage" class="logo">
      <nuxt-link to="/">
        <h1>LexidShop</h1>
      </nuxt-link>
    </div>

    <nav v-if="!device.isMobile">
      <ul>
        <li><nuxt-link to="/">Главная</nuxt-link></li>
        <li><nuxt-link to="/products">Каталог</nuxt-link></li>
        <li>
          <nuxt-link to="/cart">Корзина ({{ formatPrice(cartStore.total) }} руб.)</nuxt-link>
        </li>
        <li><nuxt-link to="/contact">О нас</nuxt-link></li>
        <li v-if="user">
          <nuxt-link to="/profile" class="logout-btn">{{ user.value.user_metadata.username }}</nuxt-link>
        </li>
        <li v-else>
          <nuxt-link to="/login" class="logout-btn">Login</nuxt-link>
        </li>
      </ul>
    </nav>
    <ThemeSwitcher class="ml-6" />
    <HamburgerMenu v-if="device.isMobile" />
  </header>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { useAuthStore } from '@/stores/auth'

const colorMode = useColorMode();
const cartStore = useCartStore();
const device = useDevice();
const route = useRoute();
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isProductPage = computed(() => {
  return route.path.match(/^\/products\/\d+$/) !== null; // Проверка на наличие числового id в URL
});
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: var(--background-color);
  color: var(--color-text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.logo {
  h1 {
    margin: 0;
  }
}

nav {
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
  }
  li {
    margin: 0 16px;
  }

  a {
    color: var(--color-text);
    font-weight: bold;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: var(--background-color-btn);
    }
  }

  .logout-btn {
    background: none;
    border: none;
    color: var(--color-text);
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--background-color-btn);
    }
  }
}
.btn-back {
  margin-right: auto;
  background-color: transparent;
  color: var(--color-text); // Основной цвет текста на сайте
  border: 2px solid var(--color-text); // Цвет, который уже используется для кнопок
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-text); // Инверсия
    color: var(--background-color); // Белый текст
  }
}
</style>
