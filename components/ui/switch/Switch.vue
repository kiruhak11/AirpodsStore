<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  SwitchRoot,
  type SwitchRootEmits,
  type SwitchRootProps,
  SwitchThumb,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="cn(
      'peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-primary)] data-[state=unchecked]:bg-[var(--color-border)]',
      props.class,
    )"
  >
    <SwitchThumb
      :class="cn('pointer-events-none block h-7 w-7 rounded-full bg-[var(--color-bg-secondary)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0')"
    />
  </SwitchRoot>
</template>
