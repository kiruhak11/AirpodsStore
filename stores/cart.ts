import { defineStore } from 'pinia';
import type { Product } from '~/composables/useProducts'
import { ref, watch } from 'vue'

export interface CartItem {
  id: string
  productId: number
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

  // Загрузка из localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('cart_items')
    if (saved) items.value = JSON.parse(saved)
  }

  // Сохранять корзину в localStorage
  watch(items, (val) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart_items', JSON.stringify(val))
    }
  }, { deep: true })

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
  const addItem = (item: { productId: number; quantity: number; product: Product }) => {
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
        removeItem(item.productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const removeItem = (productId: number) => {
    items.value = items.value.filter(i => i.productId !== productId)
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
  const isInCart = (productId: number) => {
    return items.value.some(item => item.productId === productId)
  }

  // Получение количества товара в корзине
  const getItemQuantity = (productId: number) => {
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
