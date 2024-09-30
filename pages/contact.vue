<template>
  <main>
    <h2>Contact Us</h2>
    <p>Все новинки можно увидеть в нашем телеграмм канале!</p>
    <a href="https://t.me/kiruhak11" target="_blank" class="telegram-link"
      >Мы в телеграмм</a
    >
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContactPage",
});
</script>

<style lang="scss" scoped>
main {
  text-align: center;

  padding-top: 48px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.telegram-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: $backgroundColorBtn;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: $backgroundColorBtnHover;
    transform: translateY(-2px);
  }
}
</style>
