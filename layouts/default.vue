<template>
  <div class="apple-layout">
    <header class="apple-header">
      <NuxtLink to="/" class="apple-logo"> AirPods Store</NuxtLink>
      <nav class="apple-nav">
        <NuxtLink to="/products">Магазин</NuxtLink>
        <NuxtLink to="/cart">Корзина</NuxtLink>
        <NuxtLink to="/contact">О нас</NuxtLink>
        <NuxtLink to="/admin">Админка</NuxtLink>
      </nav>
    </header>
    <main class="apple-main">
      <slot />
    </main>
    <footer class="apple-footer">
      <div>© 2024 AirPods Store. Inspired by apple.com</div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.apple-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.apple-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 48px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  font-size: 20px;
  font-weight: 500;
}
.apple-logo {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #111;
  text-decoration: none;
}
.apple-nav {
  display: flex;
  gap: 32px;
  a {
    color: #222;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    &:hover {
      color: #0071e3;
    }
  }
}
.apple-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 16px 32px 16px;
  background: #fff;
}
.apple-footer {
  text-align: center;
  padding: 32px 0 16px 0;
  color: #888;
  font-size: 16px;
  background: #fafafa;
  border-top: 1px solid #eee;
}
</style>
