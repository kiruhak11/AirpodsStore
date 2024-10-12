<template>
  <NuxtLayout>
    <main>
      <div class="hero">
        <h2>Welcome to AirPods Store</h2>
        <p>Discover the best AirPods for you.</p>
        <div class="features">
          <div v-for="feature in features" :key="feature.name" class="feature">
            <img :src="feature.image" :alt="feature.name" />
            <h3>{{ feature.name }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
        <nuxt-link to="/products" class="btn">Shop Now</nuxt-link>
      </div>

      <section class="popular-products-section">
        <h2>Популярные товары</h2>
        <div class="product-carousel">
          <div class="product-list">
            <Swiper
              :modules="[SwiperNavigation, SwiperMousewheel, SwiperPagination]"
              :mousewheel="{ invert: false, forceToAxis: true }"
              :slides-per-view="$device.isMobile ? 2 : 4"
              :slides-per-group="$device.isMobile ? 2 : 4"
              :space-between="20"
              :navigation="{
                prevEl: '.arrow_prev_slots',
                nextEl: '.arrow_next_slots',
              }"
              :watch-slides-progress="true"
              :pagination="{
                clickable: true,
                el: '.custom-pagination_high-tech',
              }"
              class="product-list__swiper"
            >
              <SwiperSlide v-for="product in popularProducts" :key="product.id">
                <ProductCard :product="product" />
              </SwiperSlide>
            </Swiper>
          </div>
          <div class="custom-pagination custom-pagination_high-tech"></div>
        </div>
      </section>

      <section class="about-us">
        <h2>О нас</h2>
        <p>
          Мы предлагаем широкий ассортимент высококачественной продукции, которая удовлетворит все ваши потребности. Наша миссия -
          обеспечить лучший опыт покупок для наших клиентов.
        </p>
      </section>
    </main>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { Database } from '~/types/database.types';
const client = useSupabaseClient<Database>();

const { data: products } = await useAsyncData('products', async () => {
  const { data } = await client.from('products').select('created_at, description, id, image, name, price').order('created_at');

  return data ?? [];
});

const popularProducts: Database['public']['Tables']['products']['Row'][] = products.value?.slice(0, 8) ?? [];
const features: Database['public']['Tables']['products']['Row'][] = products.value?.slice(0, 3) ?? [];
</script>

<style lang="scss" scoped>
main {
  padding: 32px;
  text-align: center;
  background-color: #fff;
  margin: 32px auto;
  max-width: 1200px;
  border-radius: 8px;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: white;
  color: #333;
  padding: 32px;
  border-radius: 8px;
  margin-bottom: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.popular-products-section {
  margin: 32px 0;
}

.product-carousel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.product-list {
  overflow: hidden;

  &__swiper {
    width: 100%;
    padding: 10px 0;

    & .swiper-slide {
      height: auto;
    }
  }
}

.about-us {
  text-align: center;
  margin: 32px 0;
  padding: 32px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  p {
    text-wrap: balance;
  }
}

.features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $backgroundColorFeature;
  padding: 16px;
  margin: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;

  img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 16px;
    aspect-ratio: 1;
    object-fit: contain;
  }

  h3 {
    font-size: 24px;
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    color: #666;
    text-wrap: balance;
  }
}

.btn {
  margin: 20px;
  padding: 12px 24px;
  background-color: $backgroundColorBtn;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: $backgroundColorBtnHover;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
}

/* Media Queries for Mobile Responsiveness */
@media (max-width: 768px) {
  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature {
    max-width: 100%;
    margin: 8px 0;
  }

  .hero {
    padding: 16px;
  }

  .btn {
    width: 100%;
  }
}
</style>
