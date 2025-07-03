<template>
  <div class="product-image">
    <NuxtImg
      :src="imageUrl"
      :alt="alt"
      :class="imageClass"
      :loading="loading"
      @error="handleImageError"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string | null
  alt?: string
  class?: string
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Product image',
  loading: 'lazy'
})

// Computed
const imageUrl = computed(() => {
  if (!props.src) return 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'
  
  // Если это уже API URL, используем как есть
  if (props.src.startsWith('/api/file/')) {
    return props.src
  }
  
  // Если это старый формат /uploads/, конвертируем в API URL
  if (props.src.startsWith('/uploads/')) {
    const filename = props.src.replace('/uploads/', '')
    return `/api/file/${filename}`
  }
  
  // Если это внешний URL, используем как есть
  if (props.src.startsWith('http')) {
    return props.src
  }
  
  // По умолчанию возвращаем placeholder
  return 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'
})

const imageClass = computed(() => {
  return ['product-image__img', props.class].filter(Boolean).join(' ')
})

// Methods
const handleImageError = (payload: string | Event) => {
  if (payload instanceof Event) {
    const img = payload.target as HTMLImageElement
    img.src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'
  }
}
</script>

<style scoped lang="scss">
.product-image {
  display: block;
  width: 100%;
  height: 100%;
  
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style> 