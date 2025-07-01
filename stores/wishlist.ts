import type { Product } from '~/composables/useProducts'

export interface WishlistItem {
  id: string
  product: Product
  addedAt: Date
}

export const useWishlistStore = defineStore('wishlist', () => {
  // Состояние
  const items = ref<WishlistItem[]>([])

  // Computed свойства
  const totalItems = computed(() => items.value.length)
  const isEmpty = computed(() => items.value.length === 0)

  // Методы
  const addItem = (product: Product) => {
    if (!isInWishlist(product.id)) {
      items.value.push({
        id: `${product.id}-${Date.now()}`,
        product,
        addedAt: new Date()
      })
    }
  }

  const removeItem = (productId: number) => {
    const index = items.value.findIndex(i => i.product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const clearWishlist = () => {
    items.value = []
  }

  const isInWishlist = (productId: number) => {
    return items.value.some(item => item.product.id === productId)
  }

  const toggleItem = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  return {
    // Состояние
    items: readonly(items),
    
    // Computed
    totalItems,
    isEmpty,
    
    // Методы
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    toggleItem
  }
}, {
  persist: {
    storage: persistedState.localStorage,
    paths: ['items']
  }
}) 