<template>
  <header class="header">
    <Button v-if="isProductPage" class="btn-back" @click="$router.back()">Назад</Button>
    <div v-if="!isProductPage" class="logo">
      <nuxt-link to="/">
        <h1>AirPods Store</h1>
      </nuxt-link>
    </div>

    <nav v-if="!device.isMobile">
      <ul>
        <li><nuxt-link to="/">Главная</nuxt-link></li>
        <li><nuxt-link to="/products">Каталог</nuxt-link></li>
        <li>
          <nuxt-link to="/cart">Корзина ({{ formatPrice(cartStore.totalPrice) }} руб.)</nuxt-link>
        </li>
        <li><nuxt-link to="/contact">О нас</nuxt-link></li>
        <li v-if="user">
          <nuxt-link to="/profile" class="logout-btn">{{ user.user_metadata.username }}</nuxt-link>
        </li>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icon
                icon="radix-icons:sun"
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="colorMode.preference = 'light'"> Light </DropdownMenuItem>
            <DropdownMenuItem @click="colorMode.preference = 'dark'"> Dark </DropdownMenuItem>
            <DropdownMenuItem @click="colorMode.preference = 'system'"> System </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
    </nav>
    <HamburgerMenu v-if="device.isMobile" />
  </header>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const colorMode = useColorMode();
const cartStore = useCartStore();
const device = useDevice();
const user = useSupabaseUser();
const route = useRoute();
const isProductPage = computed(() => {
  return route.path.match(/^\/products\/\d+$/) !== null; // Проверка на наличие числового id в URL
});
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// // Функция выхода
// const logout = async () => {
//   await supabase.auth.signOut();
//   useRouter().push('/login');
// };
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
  color: var(--text-color);
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
  }
  li {
    margin: 0 16px;
  }

  a {
    color: var(--text-color);
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
    color: var(--text-color);
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
  color: var(--text-color); // Основной цвет текста на сайте
  border: 2px solid var(--text-color); // Цвет, который уже используется для кнопок
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--text-color); // Инверсия
    color: var(--background-color); // Белый текст
  }
}
</style>
