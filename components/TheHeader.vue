<template>
  <header class="header">
    <div class="logo">
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
      </ul>
    </nav>
    <HamburgerMenu v-if="device.isMobile" />
  </header>
</template>

<script lang="ts" setup>
const cartStore = useCartStore();
const device = useDevice();
const user = useSupabaseUser();

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
  background-color: white;
  color: $colorText;
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
    color: $colorText;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: $backgroundColorBtn;
    }
  }

  .logout-btn {
    background: none;
    border: none;
    color: $colorText;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: $backgroundColorBtn;
    }
  }
}
</style>
