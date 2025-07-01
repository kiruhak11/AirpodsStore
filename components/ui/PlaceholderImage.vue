<template>
  <img
    :src="imageSrc"
    :alt="alt"
    :class="imageClass"
    @error="handleError"
    loading="lazy"
  />
</template>

<script setup lang="ts">
interface Props {
  src?: string | null
  alt: string
  width?: number
  height?: number
  imageClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 400,
  imageClass: ''
})

const imageSrc = computed(() => {
  if (props.src) {
    return props.src
  }
  return `https://placehold.co/${props.width}x${props.height}/6b7280/ffffff?text=${encodeURIComponent(props.alt)}`
})

const handleError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target.src.includes('placehold.co')) return
  target.src = `https://placehold.co/${props.width}x${props.height}/6b7280/ffffff?text=${encodeURIComponent(props.alt)}`
}
</script> 