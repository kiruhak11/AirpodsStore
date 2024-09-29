<template>
  <div class="app">
    <TheHeader />
    <div class="content"><slot></slot></div>
    <TheFooter />
  </div>
</template>

<style scoped lang="scss">
.content {
  flex-grow: 1;
}
body {
  background-color: $backgroundColor;
}
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
