<template>
  <header class="main-header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="logo-icon" xmlns="http://www.w3.org/2000/svg">
          <g>
            <rect x="2" y="2" width="28" height="28" rx="14" fill="url(#g)"/>
            <rect x="10.5" y="7" width="3" height="16" rx="1.5" fill="#fff"/>
            <rect x="18.5" y="7" width="3" height="16" rx="1.5" fill="#fff"/>
            <circle cx="12" cy="23.5" r="1" fill="#38f9d7"/>
            <circle cx="20" cy="23.5" r="1" fill="#38f9d7"/>
            <rect x="11.5" y="7.5" width="1" height="6" rx="0.5" fill="#c6f7e2"/>
            <rect x="19.5" y="7.5" width="1" height="6" rx="0.5" fill="#c6f7e2"/>
          </g>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#667eea"/>
              <stop offset="1" stop-color="#38f9d7"/>
            </linearGradient>
          </defs>
        </svg>
        <span>LexidShop</span>
      </NuxtLink>
      <nav v-if="!device.isMobile" class="main-nav">
        <NuxtLink to="/" class="nav-link">Главная</NuxtLink>
        <NuxtLink to="/catalog" class="nav-link">Каталог</NuxtLink>
        <NuxtLink to="/cart" class="nav-link">Корзина ({{ formatPrice(cartStore.total) }} ₽)</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">О нас</NuxtLink>
        <div v-if="user && (user.fullName || user.email)" class="profile-menu">
          <button class="profile-menu__trigger">
            <span class="profile-menu__avatar">{{ (user.fullName || user.email)?.charAt(0).toUpperCase() }}</span>
            <span class="profile-menu__name">{{ user.fullName || user.email }}</span>
            <span class="profile-menu__arrow">▼</span>
          </button>
          <div class="profile-menu__dropdown">
            <div class="profile-menu__info">
              <div class="profile-menu__name">{{ user.fullName || 'Без имени' }}</div>
              <div class="profile-menu__email">{{ user.email }}</div>
            </div>
            <NuxtLink to="/profile" class="profile-menu__link">Личный кабинет</NuxtLink>
            <button class="profile-menu__logout" @click="authStore.logout(); $router.push('/login')">Выйти</button>
          </div>
        </div>
        <NuxtLink v-else to="/login" class="nav-link nav-link--login">Войти</NuxtLink>
      </nav>
      <HamburgerMenu v-if="device.isMobile" />
    </div>
  </header>
</template>

<script lang="ts" setup>
const cartStore = useCartStore();
const device = useDevice();
const route = useRoute();
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<style lang="scss" scoped>
.main-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px rgba(56,249,215,0.08), 0 1.5px 8px rgba(67,233,123,0.08);
  border-bottom: 1.5px solid rgba(102,126,234,0.08);
  transition: background 0.3s, box-shadow 0.3s;
}
.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 2vw;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.7em;
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--color-primary);
  text-decoration: none;
  background: var(--gradient2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity 0.2s;
  .logo-icon {
    width: 2.1em;
    height: 2.1em;
    display: block;
  }
  span {
    font-family: 'Poppins', 'Inter', Arial, sans-serif;
    font-weight: 800;
    font-size: 1.25em;
    letter-spacing: 0.03em;
  }
  &:hover {
    opacity: 0.8;
  }
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 2.2em;
}
.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.08rem;
  padding: 0.5em 1.2em;
  border-radius: 2em;
  background: none;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  position: relative;
  &:hover, &.router-link-exact-active {
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    box-shadow: 0 2px 12px rgba(56,249,215,0.08);
  }
}
.nav-link--login {
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(56,249,215,0.08);
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
    color: #fff;
  }
}
.profile-menu {
  position: relative;
  display: inline-block;
  margin-left: 1.2em;
  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.5em;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: var(--color-text);
    font-size: 1.08rem;
    border-radius: 2em;
    padding: 0.5em 1.2em;
    transition: background 0.18s, color 0.18s;
    &:hover, &:focus {
      background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
      color: #fff;
    }
  }
  &__avatar {
    width: 2em;
    height: 2em;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1em;
    margin-right: 0.5em;
    box-shadow: 0 2px 8px rgba(56,249,215,0.08);
  }
  &__dropdown {
    display: none;
    position: absolute;
    right: 0;
    top: 120%;
    min-width: 200px;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 1em;
    box-shadow: 0 8px 32px rgba(56,249,215,0.13);
    z-index: 10;
    padding: 1.2em 1em;
    animation: fadeInUp 0.3s cubic-bezier(.23,1.02,.32,1) both;
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
@media (max-width: 900px) {
  .header-inner {
    padding: 0 1vw;
  }
  .main-nav {
    gap: 1.2em;
  }
}
@media (max-width: 600px) {
  .header-inner {
    height: 56px;
    padding: 0 0.5vw;
  }
  .logo {
    font-size: 1.1rem;
    .logo-icon {
      width: 1.5em;
      height: 1.5em;
    }
  }
}
:global(.dark) {
  .main-header {
    background: rgba(17, 24, 39, 0.85);
    border-bottom: 1.5px solid rgba(255, 255, 255, 0.08);
  }
  .profile-menu__dropdown {
    background: #23272f;
    border: 1px solid #333;
  }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(-24px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}
</style>
