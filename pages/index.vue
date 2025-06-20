<template>
  <NuxtLayout name="default">
    <section class="hero">
      <img src="/images/airpods-pro.png" alt="AirPods Pro" class="hero-img" />
      <h1 class="hero-title">AirPods Pro</h1>
      <p class="hero-desc">Погрузитесь в звук нового поколения. Ощутите магию Apple в каждом моменте.</p>
      <NuxtLink to="/products" class="hero-btn">В магазин</NuxtLink>
    </section>
    <section class="features">
      <div class="feature">
        <h2>Оригинальные товары</h2>
        <p>Только официальная продукция Apple с гарантией.</p>
      </div>
      <div class="feature">
        <h2>Быстрая доставка</h2>
        <p>Доставим ваш заказ в кратчайшие сроки по всей России.</p>
      </div>
      <div class="feature">
        <h2>Поддержка 24/7</h2>
        <p>Всегда готовы помочь вам с любым вопросом.</p>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0 48px 0;
  background: #fff;
}
.hero-img {
  width: 340px;
  max-width: 90vw;
  margin-bottom: 32px;
  filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.08));
}
.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #111;
}
.hero-desc {
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 32px;
  max-width: 600px;
  text-align: center;
}
.hero-btn {
  background: #0071e3;
  color: #fff;
  font-size: 1.25rem;
  padding: 16px 40px;
  border-radius: 32px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.hero-btn:hover {
  background: #005bb5;
}
.features {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin: 64px 0 0 0;
  flex-wrap: wrap;
}
.feature {
  background: #fafafa;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 32px 40px;
  min-width: 260px;
  max-width: 340px;
  text-align: center;
}
.feature h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #222;
}
.feature p {
  color: #666;
  font-size: 1.1rem;
}
</style>
