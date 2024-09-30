<template>
  <main>
    <div class="hero">
      <h2>Welcome to AirPods Store</h2>
      <p>Discover the best AirPods for you.</p>
      <div class="features">
        <div class="feature">
          <img src="/images/airpods-pro.png" alt="AirPods Pro" />
          <h3>AirPods Pro</h3>
          <p>Experience the best sound quality with AirPods Pro.</p>
        </div>
        <div class="feature">
          <img src="/images/airpods-max.png" alt="AirPods Max" />
          <h3>AirPods Max</h3>
          <p>Immerse yourself in high-fidelity sound with AirPods Max.</p>
        </div>
        <div class="feature">
          <img src="/images/airpods-3rd-gen.png" alt="AirPods 3rd Generation" />
          <h3>AirPods (3rd Generation)</h3>
          <p>Enjoy the latest technology with AirPods (3rd Generation).</p>
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
            :mousewheel="{
              invert: false,
              forceToAxis: true,
            }"
            :slides-per-view="5"
            :slides-per-group="5"
            :space-between="20"
            :navigation="{
              prevEl: `.arrow_prev_slots`,
              nextEl: `.arrow_next_slots`,
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
        Мы предлагаем широкий ассортимент высококачественной продукции, которая
        удовлетворит все ваши потребности. Наша миссия - обеспечить лучший опыт
        покупок для наших клиентов.
      </p>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductCard from "~/components/ProductCard.vue";
import { products } from "~/data/products";
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default defineComponent({
  components: {
    ProductCard,
  },
  setup() {
    const popularProducts: Product[] = products.slice(0, 7); // Выбираем первые 5 продуктов как популярные

    return { popularProducts };
  },
});
</script>

<style lang="scss" scoped>
main {
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  margin: 2rem auto;
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
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.popular-products-section {
  margin: 2rem 0;
}

.product-carousel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
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
  margin: 2rem 0;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.feature {
  background-color: $backgroundColorFeature;
  padding: 1rem;
  margin: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
}
.feature img {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.feature p {
  font-size: 1rem;
  color: #666;
}
.btn {
  margin: 20px;
  padding: 0.75rem 1.5rem;
  background-color: $backgroundColorBtn;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  background-color: $backgroundColorBtnHover;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
</style>
