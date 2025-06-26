import { defineStore } from 'pinia';
import type { Product } from '~/composables/useProducts'

export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export const useCartStore = defineStore('cart', () => {
  // Состояние
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  // Computed свойства
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() => 
    items.value.reduce((sum, item) => {
      const price = item.product.price
      return sum + (price * item.quantity)
    }, 0)
  )

  const total = computed(() => {
    // Здесь можно добавить логику скидок и доставки
    return subtotal.value
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Методы
  const addItem = (item: { productId: string; quantity: number; product: Product }) => {
    const existingItem = items.value.find(i => i.productId === item.productId)
    
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      items.value.push({
        id: `${item.productId}-${Date.now()}`,
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
        addedAt: new Date()
      })
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const removeItem = (itemId: string) => {
    const index = items.value.findIndex(i => i.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const openCart = () => {
    isOpen.value = true
  }

  const closeCart = () => {
    isOpen.value = false
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  // Проверка наличия товара в корзине
  const isInCart = (productId: string) => {
    return items.value.some(item => item.productId === productId)
  }

  // Получение количества товара в корзине
  const getItemQuantity = (productId: string) => {
    const item = items.value.find(i => i.productId === productId)
    return item ? item.quantity : 0
  }

  return {
    // Состояние
    items: readonly(items),
    isOpen: readonly(isOpen),
    
    // Computed
    totalItems,
    subtotal,
    total,
    isEmpty,
    
    // Методы
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    isInCart,
    getItemQuantity
  }
}, {
  persist: {
    storage: persistedState.localStorage,
    paths: ['items']
  }
})
