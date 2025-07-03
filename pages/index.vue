<template>
  <div class="main-page">
    <div class="main-content">
      <!-- Hero Banner -->
      <section class="hero">
        <div class="hero__content">
          <h1 class="hero__title">
            <span class="hero__brand">LexidShop</span> — <span>звук нового поколения</span>
          </h1>
          <p class="hero__desc">
            Магазин премиальных наушников и аксессуаров. Ощути разницу с LexidShop.
          </p>
          <div class="hero__actions">
            <NuxtLink to="/catalog" class="hero__btn">
              <Icon icon="lucide:shopping-bag" class="hero__btn-icon" />
              В каталог
            </NuxtLink>
          </div>
        </div>
        <img class="hero__img" src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=600&q=80" alt="AirPods Banner" loading="lazy" />
      </section>

      <!-- Категории -->
      <section class="categories-pro alt-bg">
        <div class="section-header-pro">
          <h2 class="categories-pro__title">
            <Icon icon="lucide:layers" class="categories-pro__icon" /> Категории
          </h2>
          <p class="section-subtitle-pro">Выберите категорию — найдите свой стиль</p>
        </div>
        <Swiper
          :slides-per-view="1.2"
          :space-between="18"
          :breakpoints="{ 600: { slidesPerView: 2.2 }, 900: { slidesPerView: 3.2 }, 1200: { slidesPerView: 4.2 } }"
          navigation
          pagination
          class="categories-swiper"
        >
          <SwiperSlide v-for="category in categories.slice(0, 12)" :key="category.id">
            <NuxtLink :to="`/catalog/${category.slug}`" class="categories-pro__item premium">
              <div class="categories-pro__img-wrap premium">
                <img v-if="category.image" :src="category.image" :alt="category.name" class="categories-pro__img premium" />
                <Icon v-else icon="lucide:folder-open" class="categories-pro__item-icon premium" />
              </div>
              <div class="categories-pro__item-content premium">
                <h3 class="categories-pro__name premium">{{ category.name }}</h3>
                <p class="categories-pro__description premium">{{ category.description }}</p>
              </div>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
        <div class="section-footer-pro">
          <NuxtLink to="/catalog" class="section-more-btn-pro"><Icon icon="lucide:chevron-right" /> Смотреть все категории</NuxtLink>
        </div>
      </section>
      <div class="section-divider-pro"></div>
      <!-- Новинки -->
      <section class="new-products-pro">
        <div class="section-header-pro">
          <h2 class="new-products-pro__title">
            <Icon icon="lucide:sparkles" class="new-products-pro__icon" /> Новинки
          </h2>
          <p class="section-subtitle-pro">Свежие поступления — не пропустите!</p>
        </div>
        <Swiper
          :slides-per-view="1.2"
          :space-between="18"
          :breakpoints="{ 600: { slidesPerView: 2.2 }, 900: { slidesPerView: 3.2 }, 1200: { slidesPerView: 4.2 } }"
          navigation
          pagination
          class="new-products-swiper"
        >
          <SwiperSlide v-for="product in newProducts.slice(0, 12)" :key="product.id">
            <div class="new-products-pro__item swiper-card">
              <div class="new-products-pro__img-badge">
                <span class="new-products-pro__badge"><Icon icon="lucide:sparkles" /> NEW</span>
              </div>
              <div class="new-products-pro__img-wrap">
                <img :src="product.image" :alt="product.name" class="new-products-pro__img" />
              </div>
              <div class="new-products-pro__info">
                <div class="new-products-pro__name">{{ product.name }}</div>
                <div class="new-products-pro__price">{{ product.price }} ₽</div>
              </div>
              <NuxtLink :to="`/catalog/${product.category?.slug || 'all'}/${product.slug || product.id}`" class="new-products-pro__btn" :aria-label="`Подробнее о ${product.name}`">
                <Icon icon="lucide:info" />
              </NuxtLink>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="section-footer-pro">
          <NuxtLink to="/catalog" class="section-more-btn-pro"><Icon icon="lucide:chevron-right" /> Смотреть все новинки</NuxtLink>
        </div>
      </section>
      <div class="section-divider-pro"></div>
      <!-- Популярные товары -->
      <section class="showcase-pro alt-bg">
        <div class="section-header-pro">
          <h2 class="showcase-pro__title">
            <Icon icon="lucide:star" class="showcase-pro__icon" /> Популярные товары
          </h2>
          <p class="section-subtitle-pro">Самое покупаемое — рекомендуем!</p>
        </div>
        <Swiper
          :slides-per-view="1.1"
          :space-between="24"
          :breakpoints="{ 600: { slidesPerView: 2.1 }, 900: { slidesPerView: 3.1 }, 1200: { slidesPerView: 4.1 } }"
          navigation
          pagination
          class="showcase-swiper"
        >
          <SwiperSlide v-for="product in groupedProducts.slice(0, 12)" :key="product.id">
            <div class="new-products-pro__item swiper-card">
              <div v-if="product.isBestSeller" class="new-products-pro__img-badge">
                <span class="new-products-pro__badge"><Icon icon="lucide:star" /> Top</span>
              </div>
              <div class="new-products-pro__img-wrap">
                <img :src="product.image" :alt="product.name" class="new-products-pro__img" />
              </div>
              <div class="new-products-pro__info">
                <div class="new-products-pro__name">{{ product.name }}</div>
                <div class="new-products-pro__price">{{ product.price }} ₽</div>
              </div>
              <NuxtLink :to="`/catalog/${product.category?.slug || 'all'}/${product.slug || product.id}`" class="new-products-pro__btn" :aria-label="`В корзину: ${product.name}`">
                <Icon icon="lucide:shopping-cart" />
              </NuxtLink>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="section-footer-pro">
          <NuxtLink to="/catalog" class="section-more-btn-pro"><Icon icon="lucide:chevron-right" /> Смотреть все популярные</NuxtLink>
        </div>
      </section>
      <div class="section-divider-pro"></div>

      <!-- Преимущества -->
      <section class="features-pro">
        <div class="features-pro__grid">
          <div class="feature-pro">
            <Icon icon="lucide:shield-check" class="feature-pro__icon" />
            <div class="feature-pro__title">Гарантия качества</div>
            <div class="feature-pro__desc">Только оригинальные товары и официальная гарантия на всю продукцию.</div>
          </div>
          <div class="feature-pro">
            <Icon icon="lucide:truck" class="feature-pro__icon" />
            <div class="feature-pro__title">Быстрая доставка</div>
            <div class="feature-pro__desc">Оперативная доставка по всей России и СНГ. Отправка в день заказа.</div>
          </div>
          <div class="feature-pro">
            <Icon icon="lucide:headphones" class="feature-pro__icon" />
            <div class="feature-pro__title">Экспертная поддержка</div>
            <div class="feature-pro__desc">Поможем выбрать и ответим на любые вопросы о товарах и заказах.</div>
          </div>
        </div>
      </section>

      <!-- Как купить -->
      <section class="how-to-buy-pro">
        <h2 class="how-to-buy-pro__title"><Icon icon="lucide:shopping-cart" /> Как купить?</h2>
        <div class="how-to-buy-pro__steps">
          <div class="how-to-buy-pro__step">
            <span class="how-to-buy-pro__step-num">1</span>
            <span class="how-to-buy-pro__step-text">Выберите товар</span>
            <Icon icon="lucide:chevron-right" class="how-to-buy-pro__arrow" />
          </div>
          <div class="how-to-buy-pro__step">
            <span class="how-to-buy-pro__step-num">2</span>
            <span class="how-to-buy-pro__step-text">Оформите заказ</span>
            <Icon icon="lucide:chevron-right" class="how-to-buy-pro__arrow" />
          </div>
          <div class="how-to-buy-pro__step">
            <span class="how-to-buy-pro__step-num">3</span>
            <span class="how-to-buy-pro__step-text">Получите заказ</span>
          </div>
        </div>
      </section>

      <!-- Форма для сотрудничества -->
      <section class="cooperation-form-pro">
        <h2 class="cooperation-form-pro__title">Сотрудничество</h2>
        <p class="cooperation-form-pro__desc">Хотите стать партнёром или предложить сотрудничество? Заполните форму — мы свяжемся с вами!</p>
        <form class="cooperation-form-pro__form" @submit.prevent="submitCoopForm">
          <input v-model="coopForm.name" type="text" placeholder="Ваше имя" required />
          <input v-model="coopForm.email" type="email" placeholder="Email для связи" required />
          <textarea v-model="coopForm.message" placeholder="Сообщение" required rows="3"></textarea>
          <button type="submit" :disabled="coopFormLoading">
            <Icon icon="lucide:send" /> Отправить
          </button>
          <div v-if="coopFormSuccess" class="cooperation-form-pro__success">Спасибо! Мы свяжемся с вами.</div>
          <div v-if="coopFormError" class="cooperation-form-pro__error">Ошибка отправки. Попробуйте позже.</div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProducts } from '~/composables/useProducts'
import ProductCard from '@/components/ProductCard.vue'
import { Icon } from '@iconify/vue'
import type { Product, Category } from '~/composables/useProducts'
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// SEO
useHead({
  title: 'LexidShop - Лучшие наушники и аксессуары',
  meta: [
    { name: 'description', content: 'Магазин качественных наушников и аксессуаров. AirPods, беспроводные наушники, чехлы и многое другое.' },
    { property: 'og:title', content: 'LexidShop - Лучшие наушники и аксессуары' },
    { property: 'og:description', content: 'Магазин качественных наушников и аксессуаров' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://lexid.shop' }
  ]
})

const { getProducts, getCategories } = useProducts()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])

const loadData = async () => {
  products.value = await getProducts()
  categories.value = await getCategories()
  console.log('Все товары:', products.value)
  console.log('Все категории:', categories.value)
}

onMounted(loadData)

const groupedProducts = computed(() => {
  if (!products.value) return [];
  const map = new Map();
  products.value.forEach(product => {
    const key = `${product.name}_${product.categoryId}`;
    if (!map.has(key)) {
      map.set(key, { ...product, colors: [product.color], colorVariants: [product] });
    } else {
      const group = map.get(key);
      if (!group.colors.includes(product.color)) group.colors.push(product.color);
      group.colorVariants.push(product);
    }
  });
  return Array.from(map.values());
});

// Новые товары (последние 8 по дате, из сгруппированных)
const newProducts = computed(() => {
  if (!groupedProducts.value) return [];
  return [...groupedProducts.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
});

// Форма для сотрудничества
const coopForm = ref({ name: '', email: '', message: '' })
const coopFormLoading = ref(false)
const coopFormSuccess = ref(false)
const coopFormError = ref(false)

const submitCoopForm = async () => {
  coopFormLoading.value = true
  coopFormSuccess.value = false
  coopFormError.value = false
  try {
    // Отправка в Telegram (аналогично корзине)
    await $fetch('/api/telegram-coop', {
      method: 'POST',
      body: {
        name: coopForm.value.name,
        email: coopForm.value.email,
        message: coopForm.value.message
      }
    })
    coopFormSuccess.value = true
    coopForm.value = { name: '', email: '', message: '' }
  } catch (e) {
    coopFormError.value = true
  } finally {
    coopFormLoading.value = false
  }
}

defineExpose({ categories, groupedProducts, newProducts })
</script>

<style scoped lang="scss">
.main-page {
  position: relative;
  min-height: 100vh;
  z-index: 0;
  overflow-x: hidden;
}
.main-content, .categories-pro {
  min-width: 900px !important;
  width: 100% !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 0 !important;
}
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 64px 48px 48px 48px;
  gap: 48px;
  background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
  border-radius: 32px;
  box-shadow: var(--color-shadow);
  margin-bottom: 56px;
  position: relative;
  overflow: hidden;
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
    z-index: 2;
  }
  &__brand {
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 900;
    font-size: 1.1em;
    letter-spacing: 0.03em;
  }
  &__title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 12px;
    span {
      color: var(--color-primary);
    }
  }
  &__desc {
    font-size: 1.5rem;
    color: var(--color-text-secondary);
    max-width: 520px;
    margin-bottom: 24px;
  }
  &__actions {
    display: flex;
    gap: 24px;
  }
  &__btn {
    display: flex;
    align-items: center;
    gap: 0.7em;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    font-weight: 700;
    font-size: 1.15rem;
    border: none;
    border-radius: 2em;
    padding: 0.9em 2.2em;
    box-shadow: 0 4px 16px rgba(56,249,215,0.10);
    cursor: pointer;
    text-decoration: none;
    transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
    &:hover {
      background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
      box-shadow: 0 8px 32px rgba(56,249,215,0.13);
      transform: translateY(-2px) scale(1.04);
    }
    &-icon {
      font-size: 1.3em;
    }
  }
  &__img {
    width: 420px;
    max-width: 40vw;
    border-radius: 24px;
    box-shadow: var(--color-shadow);
    object-fit: cover;
    background: var(--color-bg);
    z-index: 1;
  }
}
.features {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin: 48px 0 56px 0;
  flex-wrap: wrap;
}
.feature {
  background: rgba(255,255,255,0.18);
  border-radius: 18px;
  box-shadow: 0 4px 32px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  padding: 28px 28px;
  min-width: 180px;
  max-width: 320px;
  text-align: center;
  transition: box-shadow 0.22s, transform 0.22s;
  border: 1.5px solid rgba(102,126,234,0.10);
  backdrop-filter: blur(12px);
  &:hover {
    box-shadow: 0 8px 40px 0 rgba(56,249,215,0.18), 0 2px 16px rgba(67,233,123,0.13);
    transform: translateY(-4px) scale(1.045);
  }
  h3 {
    font-size: 1.18rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--color-primary);
  }
  p {
    color: var(--color-text-secondary);
    font-size: 1.05rem;
  }
  .feature__icon {
    font-size: 2.1rem;
    margin-bottom: 14px;
    color: var(--color-primary);
    filter: drop-shadow(0 0 8px #38f9d7cc);
  }
}
.section-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 18px;
  gap: 0.2em;
  @media (max-width: 600px) {
    align-items: center;
    text-align: center;
  }
}
.section-subtitle {
  font-size: 1.02em;
  color: var(--color-text-secondary);
  opacity: 0.8;
  margin: 0 0 0 2px;
}

.section-divider {
  width: 100vw;
  min-width: 100%;
  height: 60px;
  display: block;
  margin: -24px 0 0 0;
  pointer-events: none;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.7s cubic-bezier(.23,1,.32,1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

// Категории
.categories-pro {
  max-width: 1200px;
  margin: 0 auto 64px auto;
  width: 100%;
  padding: 0 16px;
  &__grid {
    min-width: 900px !important;
    width: 100% !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
    gap: 36px !important;
    margin-top: 32px;
    justify-items: center;
    align-items: stretch;
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, minmax(160px, 1fr));
      gap: 18px;
    }
    @media (max-width: 600px) {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
      gap: 10px;
    }
  }
  &__item.premium {
    background: rgba(255,255,255,0.22);
    border-radius: 2.2em;
    box-shadow: 0 8px 32px rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
    padding: 2.2em 1.7em 2em 1.7em;
    min-height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    border: 2.5px solid rgba(102,126,234,0.10);
    backdrop-filter: blur(18px);
    transition: box-shadow 0.28s, transform 0.28s, border 0.28s;
    &:hover {
      box-shadow: 0 18px 48px 0 rgba(56,249,215,0.18), 0 4px 24px rgba(67,233,123,0.13);
      transform: translateY(-7px) scale(1.045);
      border: 2.5px solid #38f9d7;
      background: rgba(255,255,255,0.32);
      z-index: 2;
    }
  }
  &__img-wrap.premium {
    width: 84px;
    height: 84px;
    border-radius: 1.5em;
    background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.2em;
    box-shadow: 0 2px 12px #38f9d733;
    border: 2.5px solid #fff;
    overflow: hidden;
    position: relative;
    img.premium {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 1.2em;
      box-shadow: 0 2px 8px #38f9d733;
    }
    .categories-pro__item-icon.premium {
      font-size: 2.8em;
      color: var(--color-primary);
      filter: drop-shadow(0 0 8px #38f9d7cc);
    }
  }
  &__item-content.premium {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
    width: 100%;
  }
  &__name.premium {
    font-size: 1.32rem;
    font-weight: 900;
    letter-spacing: 0.01em;
    margin-bottom: 0.2em;
    color: var(--color-primary);
    text-align: center;
  }
  &__description.premium {
    font-size: 1.01rem;
    color: var(--color-text-secondary);
    opacity: 0.8;
    margin-bottom: 0.2em;
    text-align: center;
    max-width: 90%;
    line-height: 1.4;
  }
}

// Новинки — горизонтальный скролл
.new-products-pro {
  margin: 0 auto 64px auto;
  max-width: 1200px;
  &__carousel {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  &__scroll {
    min-width: 100%;
    overflow-x: auto;
  }
  &__row {
    display: flex;
    gap: 28px;
    min-width: 600px;
    padding-bottom: 4px;
  }
  &__item {
    background: rgba(255,255,255,0.18);
    border-radius: 22px;
    box-shadow: 0 2px 12px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
    padding: 24px 18px 18px 18px;
    min-width: 220px;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border: 2px solid rgba(102,126,234,0.13);
    backdrop-filter: blur(18px);
    transition: box-shadow 0.28s, transform 0.28s, border 0.28s;
    &:hover {
      box-shadow: 0 8px 32px 0 rgba(56,249,215,0.13), 0 2px 16px rgba(67,233,123,0.13);
      transform: translateY(-4px) scale(1.04);
      border: 2px solid #38f9d7;
      z-index: 2;
    }
  }
  &__img-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
  }
  &__badge {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    font-weight: 700;
    font-size: 0.95em;
    border-radius: 1.5em;
    padding: 0.2em 0.9em;
    box-shadow: 0 0 8px #38f9d7cc, 0 2px 8px #38f9d722;
    letter-spacing: 0.04em;
    filter: drop-shadow(0 0 6px #38f9d7cc);
    gap: 0.4em;
  }
  &__img-wrap {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.1em;
    box-shadow: 0 0 0 0 #38f9d700;
    border: 2.5px solid #fff;
    overflow: hidden;
  }
  &__img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 2px 8px #38f9d733;
  }
  &__info {
    width: 100%;
    text-align: center;
    margin-bottom: 0.7em;
  }
  &__name {
    font-size: 1.08rem;
    font-weight: 700;
    margin-bottom: 0.2em;
  }
  &__price {
    color: #667eea;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.7em;
  }
  &__btn {
    position: absolute;
    right: 18px;
    bottom: 18px;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    box-shadow: 0 2px 8px rgba(56,249,215,0.10);
    cursor: pointer;
    transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
    &:hover {
      background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
      box-shadow: 0 4px 16px rgba(56,249,215,0.13);
      transform: translateY(-2px) scale(1.08);
    }
  }
}

// Популярные товары
.showcase-pro {
  margin: 0 auto 64px auto;
  max-width: 1200px;
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 36px;
    margin-top: 24px;
  }
  &__item {
    background: linear-gradient(120deg, #f7faff 60%, #e0f7fa 100%);
    border-radius: 28px;
    box-shadow: 0 6px 32px 0 rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
    padding: 36px 24px 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    border: 2.5px solid rgba(102,126,234,0.10);
    backdrop-filter: blur(18px);
    transition: box-shadow 0.28s, transform 0.28s, border 0.28s;
    min-height: 260px;
    &:hover {
      box-shadow: 0 12px 48px 0 rgba(56,249,215,0.18), 0 4px 24px rgba(67,233,123,0.13);
      transform: translateY(-6px) scale(1.045);
      border: 2.5px solid #38f9d7;
      z-index: 2;
      .showcase-pro__btn {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1.1);
      }
    }
  }
  &__badge {
    position: absolute;
    top: 18px;
    left: 18px;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    font-weight: 700;
    font-size: 0.98em;
    border-radius: 50%;
    padding: 0.5em 1.1em;
    box-shadow: 0 0 8px #38f9d7cc, 0 2px 8px #38f9d722;
    z-index: 3;
    letter-spacing: 0.04em;
    filter: drop-shadow(0 0 6px #38f9d7cc);
    display: flex;
    align-items: center;
    gap: 0.3em;
  }
  &__img-wrap {
    width: 100px;
    height: 100px;
    border-radius: 18px;
    background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.1em;
    box-shadow: 0 0 0 0 #38f9d700;
    border: 2.5px solid #fff;
    overflow: hidden;
  }
  &__img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 2px 8px #38f9d733;
  }
  &__info {
    width: 100%;
    text-align: left;
    margin-bottom: 0.7em;
  }
  &__name {
    font-size: 1.18rem;
    font-weight: 800;
    margin-bottom: 0.2em;
  }
  &__price {
    color: #667eea;
    font-size: 1.18rem;
    font-weight: 700;
    margin-bottom: 0.7em;
  }
  &__btn {
    position: absolute;
    right: 24px;
    bottom: 24px;
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3em;
    box-shadow: 0 2px 8px rgba(56,249,215,0.10);
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s, background 0.18s, box-shadow 0.18s, transform 0.18s;
    &:hover {
      background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
      box-shadow: 0 4px 16px rgba(56,249,215,0.13);
      transform: translateY(-2px) scale(1.13);
    }
  }
}

// Преимущества
.features-pro {
  margin: 0 auto 64px auto;
  max-width: 1200px;
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 36px;
    margin-top: 24px;
  }
}
.feature-pro {
  background: rgba(255,255,255,0.18);
  border-radius: 18px;
  box-shadow: 0 4px 32px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  padding: 32px 24px;
  min-width: 180px;
  max-width: 340px;
  text-align: center;
  transition: box-shadow 0.22s, transform 0.22s;
  border: 1.5px solid rgba(102,126,234,0.10);
  backdrop-filter: blur(12px);
  &:hover {
    box-shadow: 0 8px 40px 0 rgba(56,249,215,0.18), 0 2px 16px rgba(67,233,123,0.13);
    transform: translateY(-4px) scale(1.045);
  }
  &__icon {
    font-size: 2.3rem;
    margin-bottom: 14px;
    color: var(--color-primary);
    filter: drop-shadow(0 0 8px #38f9d7cc);
  }
  &__title {
    font-size: 1.18rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--color-primary);
  }
  &__desc {
    color: var(--color-text-secondary);
    font-size: 1.05rem;
  }
}

// Как купить
.how-to-buy-pro {
  background: rgba(255,255,255,0.18);
  border-radius: 18px;
  box-shadow: 0 4px 32px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  padding: 36px 32px;
  margin: 0 auto 48px auto;
  max-width: 700px;
  text-align: left;
  border: 1.5px solid rgba(102,126,234,0.10);
  backdrop-filter: blur(12px);
  &__title {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 18px;
    color: var(--color-primary);
  }
  &__steps {
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }
  &__step {
    display: flex;
    align-items: center;
    gap: 0.7em;
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    position: relative;
    .how-to-buy-pro__step-num {
      background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
      color: #fff;
      font-weight: 700;
      font-size: 1.1em;
      border-radius: 50%;
      width: 2.1em;
      height: 2.1em;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 8px #38f9d7cc, 0 2px 8px #38f9d722;
      margin-right: 0.3em;
    }
    .how-to-buy-pro__arrow {
      font-size: 1.5em;
      color: #38f9d7;
      opacity: 0.7;
      margin: 0 0.2em;
    }
  }
}

// Форма сотрудничества
.cooperation-form-pro {
  background: rgba(255,255,255,0.18);
  border-radius: 18px;
  box-shadow: 0 4px 32px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  padding: 36px 32px;
  margin: 0 auto 48px auto;
  max-width: 700px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1.5px solid rgba(102,126,234,0.10);
  backdrop-filter: blur(12px);
  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--color-primary);
  }
  &__desc {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    margin-bottom: 18px;
    text-align: center;
  }
  &__form {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  &__form input,
  &__form textarea {
    width: 100%;
    padding: 0.9em 1.1em;
    border-radius: 1em;
    border: 1.5px solid var(--color-border);
    background: rgba(255,255,255,0.45);
    font-size: 1.08em;
    color: var(--color-text);
    transition: border 0.18s, box-shadow 0.18s;
    box-shadow: 0 1px 4px rgba(56,249,215,0.04);
    &:focus {
      border-color: var(--color-primary);
      outline: none;
      box-shadow: 0 0 0 2px #38f9d7cc;
    }
  }
  &__form button {
    background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
    color: #fff;
    font-weight: 700;
    font-size: 1.15rem;
    border: none;
    border-radius: 2em;
    padding: 0.9em 2.2em;
    box-shadow: 0 4px 16px rgba(56,249,215,0.10);
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.7em;
    transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
    &:hover {
      background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
      box-shadow: 0 8px 32px rgba(56,249,215,0.13);
      transform: translateY(-2px) scale(1.04);
    }
  }
  &__success {
    color: #38f9d7;
    font-weight: 600;
    margin-top: 8px;
    background: rgba(56,249,215,0.08);
    border-radius: 0.7em;
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
    gap: 0.5em;
    animation: fadeInPro 0.7s;
  }
  &__error {
    color: #e53e3e;
    font-weight: 600;
    margin-top: 8px;
    background: rgba(229,62,62,0.08);
    border-radius: 0.7em;
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
    gap: 0.5em;
    animation: fadeInPro 0.7s;
  }
}

// Общие стили для секций
.section-header-pro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 18px;
  gap: 0.2em;
  @media (max-width: 600px) {
    align-items: center;
    text-align: center;
  }
}
.section-title-pro {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 0.2em;
  color: #222;
  letter-spacing: 0.01em;
}
.section-subtitle-pro {
  color: #7b8a9c;
  font-size: 1.1rem;
  margin-bottom: 2em;
}

// Анимации
.fade-slide-pro-enter-active, .fade-slide-pro-leave-active {
  transition: all 0.7s cubic-bezier(.23,1,.32,1);
}
.fade-slide-pro-enter-from, .fade-slide-pro-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}
@keyframes fadeInPro {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

// Адаптивность
@media (max-width: 1024px) {
  .categories-pro__grid, .features-pro__grid, .showcase-pro__grid {
    gap: 18px;
  }
  .new-products-pro__row {
    gap: 14px;
  }
}
@media (max-width: 600px) {
  .categories-pro__grid, .features-pro__grid, .showcase-pro__grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .new-products-pro__row {
    flex-direction: row;
    gap: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
  .categories-pro__item, .showcase-pro__item, .feature-pro {
    padding: 12px 6px;
    border-radius: 10px;
    min-width: 0;
    max-width: 100%;
  }
  .new-products-pro__item {
    padding: 8px 2px 2px 2px;
    border-radius: 12px;
    max-width: 100%;
  }
  .categories-pro__img-wrap, .showcase-pro__img-wrap {
    width: 44px;
    height: 44px;
  }
  .alt-bg {
    padding: 0.7em 0.2em 0.5em 0.2em;
    border-radius: 0.7em;
  }
  .how-to-buy-pro, .cooperation-form-pro {
    padding: 12px 2px;
    border-radius: 8px;
  }
  .how-to-buy-pro__steps {
    flex-direction: column;
    gap: 18px;
  }
}
.alt-bg {
  background: rgba(255,255,255,0.13);
  border-radius: 2em;
  box-shadow: 0 2px 16px rgba(56,249,215,0.06);
  padding: 2.5em 1.5em 2em 1.5em;
  margin-bottom: 2.5em;
}
.section-divider-pro {
  width: 100%;
  height: 2.5em;
  background: linear-gradient(90deg, #e0e7ff 0%, #c6f7e2 100%);
  opacity: 0.18;
  border-radius: 1em;
  margin: 2em 0;
}
.section-footer-pro {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.2em;
}
.section-more-btn-pro {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  color: #fff;
  border-radius: 1em;
  padding: 0.5em 1.5em;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.18s, color 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
    color: #fff;
    transform: translateY(-2px) scale(1.04);
  }
}
.new-products-swiper,
.showcase-swiper {
  width: 100%;
  margin-bottom: 1.5em;
  .swiper {
    padding-bottom: 2.5em;
  }
  .swiper-pagination-bullet {
    background: #38f9d7;
    opacity: 0.7;
    &-active {
      background: #667eea;
      opacity: 1;
    }
  }
  .swiper-button-next, .swiper-button-prev {
    color: #667eea;
    background: rgba(255,255,255,0.7);
    border-radius: 50%;
    width: 2.2em;
    height: 2.2em;
    box-shadow: 0 2px 8px #38f9d7cc;
    transition: background 0.18s;
    &:hover {
      background: #38f9d7;
      color: #fff;
    }
  }
}
.swiper-card {
  background: rgba(255,255,255,0.18);
  border-radius: 22px;
  box-shadow: 0 2px 12px 0 rgba(56,249,215,0.10), 0 1.5px 8px rgba(67,233,123,0.08);
  padding: 24px 18px 18px 18px;
  min-width: 220px;
  max-width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 2px solid rgba(102,126,234,0.13);
  backdrop-filter: blur(18px);
  transition: box-shadow 0.28s, transform 0.28s, border 0.28s;
  &:hover {
    box-shadow: 0 8px 32px 0 rgba(56,249,215,0.13), 0 2px 16px rgba(67,233,123,0.13);
    transform: translateY(-4px) scale(1.04);
    border: 2px solid #38f9d7;
    z-index: 2;
  }
}
.showcase-card-premium {
  min-width: 260px;
  max-width: 320px;
  padding: 36px 24px 28px 24px;
  .showcase-pro__img-wrap--big {
    width: 120px;
    height: 120px;
    border-radius: 24px;
    margin-bottom: 1.2em;
  }
  .showcase-pro__img {
    width: 100px;
    height: 100px;
    border-radius: 18px;
  }
}
@media (max-width: 900px) {
  .new-products-swiper, .showcase-swiper {
    .swiper-slide {
      min-width: 180px;
      max-width: 220px;
    }
  }
  .showcase-card-premium {
    min-width: 180px;
    max-width: 220px;
    padding: 18px 8px 12px 8px;
    .showcase-pro__img-wrap--big {
      width: 70px;
      height: 70px;
      border-radius: 12px;
    }
    .showcase-pro__img {
      width: 54px;
      height: 54px;
      border-radius: 10px;
    }
  }
}
.categories-bubble-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 36px;
  margin-top: 32px;
  justify-items: center;
  align-items: stretch;
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 18px;
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
.category-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(120deg, #e0e7ff 0%, #c6f7e2 100%);
  border-radius: 50%;
  width: 140px;
  height: 140px;
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(56,249,215,0.10);
  position: relative;
  transition: box-shadow 0.22s, transform 0.22s, border 0.22s;
  cursor: pointer;
  border: 3px solid transparent;
  &:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 48px rgba(56,249,215,0.18);
    border: 3px solid #38f9d7;
    .category-bubble__icon-wrap {
      transform: scale(1.12) translateY(-6px);
    }
  }
  &__icon-wrap {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 18px;
    margin-bottom: 12px;
    font-size: 2.5em;
    transition: transform 0.22s;
    box-shadow: 0 2px 8px #38f9d733;
    position: relative;
    overflow: hidden;
    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 50%;
      box-shadow: 0 2px 8px #38f9d733;
    }
    svg {
      width: 2.2em;
      height: 2.2em;
      color: var(--color-primary);
      filter: drop-shadow(0 0 8px #38f9d7cc);
    }
  }
  &__name {
    font-size: 1.08em;
    font-weight: 800;
    color: var(--color-primary);
    margin-top: 0.2em;
    text-align: center;
  }
}
</style>
