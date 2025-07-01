<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode({
  selector: 'html',
  attribute: 'data-theme',
  modes: {
    light: 'light',
    dark: 'dark',
  },
  storageKey: 'lexidshop-theme',
  emitAuto: true,
})

const isDark = ref(colorMode.value === 'dark')

watchEffect(() => {
  colorMode.value = isDark.value ? 'dark' : 'light'
})
</script>

<template>
  <div class="theme-switcher">
    <span class="theme-switcher__icon">🌞</span>
    <Switch v-model:checked="isDark" />
    <span class="theme-switcher__icon">🌚</span>
  </div>
</template>

<style scoped lang="scss">
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  &__icon {
    font-size: 1.3em;
    opacity: 0.7;
  }
}
</style> 