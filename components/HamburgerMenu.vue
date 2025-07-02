<template>
  <div class="hamburger-menu" @click="toggleMenu">
    <div class="bar" :class="{ open: isOpen }"></div>
    <div class="bar" :class="{ open: isOpen }"></div>
    <div class="bar" :class="{ open: isOpen }"></div>
    <transition name="fade">
      <nav v-if="isOpen" class="mobile-nav">
        <ul>
          <li><nuxt-link to="/">Главная</nuxt-link></li>
          <li>
            <nuxt-link to="/products">Каталог</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/cart">Корзина ({{ formatPrice(totalPrice) }} руб.)</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/contact">О нас</nuxt-link>
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const cartStore = useCartStore();
const totalPrice = computed(() => cartStore.total);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
watch(isOpen, () => {
  if (isOpen.value) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
});
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll');
});
</script>

<style lang="scss" scoped>
.hamburger-menu {
  background-color: aquamarine;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  z-index: 3; /* Обеспечьте, чтобы бургер был выше остальных элементов */
}

.bar {
  width: 25px;
  height: 3px;
  background-color: var(--color-text); /* Замените на ваш основной цвет */
  margin: 4px;
  transition: all 0.3s ease;
}

.bar.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.bar.open:nth-child(2) {
  opacity: 0;
}

.bar.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.mobile-nav {
  position: fixed; /* Изменено на fixed для охвата всего экрана */
  top: 0;
  left: 0;
  background-color: var(--background-color); /* Полупрозрачный фон */
  width: 100vw; /* Занимает всю ширину */
  height: 100vh; /* Занимает всю высоту */
  display: flex;
  justify-content: center; /* Центрируем контент */
  align-items: center; /* Центрируем контент */
  z-index: 1000; /* Обеспечьте, чтобы меню было выше остальных элементов, но ниже модальных окон */
  transition: opacity 0.3s ease; /* Плавный переход для видимости */
}

.mobile-nav ul {
  flex-direction: column;
  list-style: none;
  padding: 0;
}

.mobile-nav li {
  margin: 16px 0;
  font-size: 32px; /* Увеличиваем размер шрифта для лучшей видимости */
}
</style>
