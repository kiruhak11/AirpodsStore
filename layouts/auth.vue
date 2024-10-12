<template>
  <div class="app">
    <div class="content"><slot></slot></div>
  </div>
</template>

<style scoped lang="scss">
body {
  background-color: $backgroundColor;
}
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
}
</style>
