<template>
  <header class="header">
    <button v-if="isProductPage" class="btn-back" @click="$router.back()">Назад</button>
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
        <li v-if="user && (user.fullName || user.email)" class="profile-menu">
          <div class="profile-menu__trigger">
            <span>{{ user.fullName || user.email }}</span>
            <span class="profile-menu__arrow">▼</span>
          </div>
          <div class="profile-menu__dropdown">
            <div class="profile-menu__info">
              <div class="profile-menu__name">{{ user.fullName || 'Без имени' }}</div>
              <div class="profile-menu__email">{{ user.email }}</div>
            </div>
            <NuxtLink to="/profile" class="profile-menu__link">Личный кабинет</NuxtLink>
            <button class="profile-menu__logout" @click="authStore.logout(); $router.push('/login')">Выйти</button>
          </div>
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

.profile-menu {
  position: relative;
  display: inline-block;
  &__trigger {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3em;
    font-weight: 600;
    color: var(--color-text);
    user-select: none;
  }
  &__arrow {
    font-size: 0.8em;
  }
  &__dropdown {
    display: none;
    position: absolute;
    right: 0;
    top: 120%;
    min-width: 180px;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    z-index: 10;
    padding: 1em 0.7em;
  }
  &:hover .profile-menu__dropdown, &:focus-within .profile-menu__dropdown {
    display: block;
  }
  &__info {
    margin-bottom: 0.7em;
    font-size: 0.95em;
    color: var(--color-text-secondary);
  }
  &__name {
    font-weight: 600;
    color: var(--color-text);
  }
  &__email {
    font-size: 0.9em;
    color: var(--color-text-secondary);
  }
  &__link {
    display: block;
    margin-bottom: 0.7em;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
  &__logout {
    width: 100%;
    background: none;
    border: none;
    color: var(--color-error, #e53e3e);
    font-weight: 600;
    cursor: pointer;
    padding: 0.4em 0;
    text-align: left;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
