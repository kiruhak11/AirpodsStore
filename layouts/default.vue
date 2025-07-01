<template>
  <div>
    <header class="main-header fade-in">
      <div class="header-gradient"></div>
      <div class="container header-flex">
        <ClientOnly>
          <NuxtLink to="/" class="logo">LexidShop</NuxtLink>
          <nav>
            <NuxtLink to="/catalog" class="nav-link">Каталог</NuxtLink>
            <NuxtLink to="/cart" class="nav-link">Корзина</NuxtLink>
            <NuxtLink to="/profile" class="nav-link">Профиль</NuxtLink>
            <NuxtLink to="/admin" class="nav-link">Админка</NuxtLink>
          </nav>
          <template #fallback>
            <div class="logo">LexidShop</div>
            <nav>
              <a href="/catalog" class="nav-link">Каталог</a>
              <a href="/cart" class="nav-link">Корзина</a>
              <a href="/profile" class="nav-link">Профиль</a>
              <a href="/admin" class="nav-link">Админка</a>
            </nav>
          </template>
        </ClientOnly>
      </div>
    </header>
    <main class="container">
      <slot />
    </main>
    <footer class="main-footer fade-in">
      <div class="footer-gradient"></div>
      <div class="container footer-flex">
        <span>© {{ new Date().getFullYear() }} LexidShop</span>
        <div class="footer-socials">
          <a href="#" class="footer-icon" title="Telegram"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M21.8 4.6c-.2-.2-.5-.3-.8-.2L3.6 10.7c-.3.1-.5.4-.5.7 0 .3.2.6.5.7l4.2 1.3 1.6 5.1c.1.3.4.5.7.5h.1c.3 0 .6-.2.7-.5l2-3.2 4.2 3.1c.2.2.5.2.7.1.2-.1.4-.3.4-.6l2.5-13.2c.1-.3 0-.6-.2-.8z" fill="#38f9d7"/></svg></a>
          <a href="#" class="footer-icon" title="Instagram"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" fill="url(#ig)"/><defs><linearGradient id="ig" x1="3" x2="21" y1="3" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#667eea"/><stop offset="1" stop-color="#38f9d7"/></linearGradient></defs><circle cx="12" cy="12" r="4" fill="#fff"/><circle cx="17" cy="7" r="1" fill="#fff"/></svg></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeInUp 0.8s cubic-bezier(.23,1.02,.32,1) both;
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(-24px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}
.main-header {
  background: rgba(255,255,255,0.85);
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}
.header-gradient {
  height: 4px;
  width: 100%;
  background: var(--gradient2);
  border-radius: 0 0 12px 12px;
  margin-bottom: -4px;
}
.header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.logo {
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--color-primary);
  text-decoration: none;
  letter-spacing: 1px;
  background: var(--gradient2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
nav {
  display: flex;
  gap: 32px;
}
.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.08rem;
  transition: color 0.2s;
  position: relative;
}
.nav-link::after {
  content: '';
  display: block;
  height: 2.5px;
  width: 0;
  background: var(--gradient2);
  border-radius: 2px;
  transition: width 0.25s;
  margin-top: 2px;
}
.nav-link:hover {
  color: var(--color-primary);
}
.nav-link:hover::after {
  width: 100%;
}
.main-footer {
  background: rgba(255,255,255,0.95);
  color: var(--color-muted);
  text-align: center;
  padding: 38px 0 22px 0;
  margin-top: 64px;
  font-size: 1.08rem;
  border-top: 1px solid #eee;
  position: relative;
}
.footer-gradient {
  height: 3px;
  width: 100%;
  background: var(--gradient2);
  border-radius: 0 0 12px 12px;
  margin-bottom: 18px;
}
.footer-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.footer-socials {
  display: flex;
  gap: 18px;
}
.footer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--gradient2);
  box-shadow: 0 2px 8px rgba(56,249,215,0.08);
  transition: box-shadow 0.2s, transform 0.18s;
  text-decoration: none;
}
.footer-icon:hover {
  box-shadow: 0 8px 24px rgba(67,233,123,0.13);
  transform: scale(1.12) rotateZ(-3deg);
}
.footer-icon svg {
  display: block;
}
</style>
