<template>
  <NuxtLayout>
    <main>
      <h2>Contact Us</h2>
      <p>Все новинки можно увидеть в нашем телеграмм канале!</p>
      <a href="https://t.me/kiruhak11" target="_blank" class="telegram-link">Мы в телеграмм</a>
    </main>
  </NuxtLayout>
</template>

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
  padding: 12px 24px;
  background-color: var(--background-color-btn);
  color: var(--text-color);
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: var(--background-color-btn-hover);
    transform: translateY(-2px);
  }
}
</style>
