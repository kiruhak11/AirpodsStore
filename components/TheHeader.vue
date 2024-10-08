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
          <nuxt-link to="/cart"
            >Корзина ({{ formatPrice(totalPrice) }} руб.)</nuxt-link
          >
        </li>
        <li><nuxt-link to="/contact">О нас</nuxt-link></li>
      </ul>
    </nav>
    <HamburgerMenu v-if="device.isMobile" />
  </header>
</template>

<script lang="ts" setup>
const cartStore = useCartStore();
const device = useDevice();
const totalPrice = computed(() => cartStore.totalPrice);

onMounted(() => {
  cartStore.loadCart();
});

const formatPrice = (price: number) => {
  return price.toLocaleString("ru-RU", {
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
  background-color: white;
  color: $colorText;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo h1 {
  margin: 0;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  margin: 0 16px;
}

nav h1 {
  color: $colorText;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: $backgroundColorBtn;
  }
}

nav a {
  color: $colorText;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: $backgroundColorBtn;
  }
}
</style>
