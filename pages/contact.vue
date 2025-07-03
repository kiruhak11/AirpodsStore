<template>
    <main class="about-contact-page">
      <!-- Hero -->
      <section class="about-hero">
        <div class="about-hero__icon">
          <Icon icon="lucide:headphones" />
        </div>
        <h1 class="about-hero__title">О нас</h1>
        <p class="about-hero__desc">AirpodsStore — это магазин, где вы всегда найдёте оригинальные наушники Apple и аксессуары по лучшим ценам. Мы работаем для вашего комфорта и уверенности в покупке!</p>
      </section>

      <!-- Миссия и ценности -->
      <section class="about-values">
        <div class="about-values__grid">
          <div class="about-value">
            <Icon icon="lucide:shield-check" class="about-value__icon" />
            <div class="about-value__title">Гарантия оригинала</div>
            <div class="about-value__desc">Только официальные поставки и подлинная продукция Apple.</div>
          </div>
          <div class="about-value">
            <Icon icon="lucide:truck" class="about-value__icon" />
            <div class="about-value__title">Быстрая доставка</div>
            <div class="about-value__desc">Отправляем заказы по всей России и СНГ в день оформления.</div>
          </div>
          <div class="about-value">
            <Icon icon="lucide:smile" class="about-value__icon" />
            <div class="about-value__title">Забота о клиентах</div>
            <div class="about-value__desc">Всегда поможем с выбором и поддержим на каждом этапе покупки.</div>
          </div>
        </div>
      </section>

      <!-- Контакты -->
      <section class="about-contacts">
        <h2 class="about-contacts__title">Контакты</h2>
        <div class="about-contacts__list">
          <a href="https://t.me/kiruhak11" target="_blank" class="about-contacts__item about-contacts__item--tg">
            <Icon icon="lucide:send" /> Наш Telegram-канал
          </a>
          <a href="mailto:info@airpodsstore.ru" class="about-contacts__item">
            <Icon icon="lucide:mail" /> info@airpodsstore.ru
          </a>
        </div>
      </section>
    </main>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>

<style lang="scss" scoped>
.about-contact-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  padding: 48px 0 64px 0;
}
.about-hero {
  background: rgba(255,255,255,0.18);
  border-radius: 2rem;
  box-shadow: 0 8px 48px rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
  backdrop-filter: blur(18px);
  padding: 48px 32px 36px 32px;
  max-width: 700px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  &__icon {
    font-size: 3.2em;
    color: var(--color-primary);
    filter: drop-shadow(0 0 12px #38f9d7cc);
    margin-bottom: 0.5em;
  }
  &__title {
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: 0.01em;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
  &__desc {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    opacity: 0.9;
    margin: 0 auto;
    max-width: 520px;
  }
}
.about-values {
  width: 100%;
  display: flex;
  justify-content: center;
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 32px;
    max-width: 900px;
    width: 100%;
  }
}
.about-value {
  background: rgba(255,255,255,0.18);
  border-radius: 1.2rem;
  box-shadow: 0 4px 32px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  padding: 32px 24px;
  text-align: center;
  transition: box-shadow 0.22s, transform 0.22s;
  border: 1.5px solid rgba(102,126,234,0.10);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
  &:hover {
    box-shadow: 0 8px 40px 0 rgba(56,249,215,0.18), 0 2px 16px rgba(67,233,123,0.13);
    transform: translateY(-4px) scale(1.045);
  }
  &__icon {
    font-size: 2.1rem;
    margin-bottom: 10px;
    color: var(--color-primary);
    filter: drop-shadow(0 0 8px #38f9d7cc);
  }
  &__title {
    font-size: 1.13rem;
    font-weight: 700;
    margin-bottom: 0.2em;
  }
  &__desc {
    color: var(--color-text-secondary);
    font-size: 1.01rem;
  }
}
.about-contacts {
  background: rgba(255,255,255,0.18);
  border-radius: 1.2rem;
  box-shadow: 0 4px 32px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  padding: 32px 24px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1.5px solid rgba(102,126,234,0.10);
  backdrop-filter: blur(12px);
  &__title {
    font-size: 1.3rem;
    font-weight: 800;
    margin-bottom: 1.2em;
    color: var(--color-primary);
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
  &__item {
    display: flex;
    align-items: center;
    gap: 0.7em;
    font-size: 1.13rem;
    font-weight: 600;
    color: var(--color-primary);
    background: rgba(56,249,215,0.08);
    border-radius: 1em;
    padding: 0.7em 1.5em;
    text-decoration: none;
    transition: background 0.18s, color 0.18s, transform 0.18s;
    &:hover {
      background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
      color: #fff;
      transform: translateY(-2px) scale(1.04);
    }
    &--tg {
      background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
      color: #fff;
      &:hover {
        background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
        color: #fff;
      }
    }
  }
}
@media (max-width: 700px) {
  .about-hero {
    padding: 24px 8px 18px 8px;
    border-radius: 1rem;
  }
  .about-values__grid {
    gap: 14px;
  }
  .about-value {
    padding: 18px 8px;
    border-radius: 0.7rem;
  }
  .about-contacts {
    padding: 18px 8px;
    border-radius: 0.7rem;
  }
}
</style>
