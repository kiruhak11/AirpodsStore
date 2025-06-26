export interface ModalState {
  isOpen: boolean
  type: string | null
  data: any
}

export const useModalStore = defineStore('modal', () => {
  // Состояние
  const isOpen = ref(false)
  const type = ref<string | null>(null)
  const data = ref<any>(null)

  // Методы
  const open = (modalType: string, modalData?: any) => {
    type.value = modalType
    data.value = modalData || null
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    type.value = null
    data.value = null
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    // Состояние
    isOpen: readonly(isOpen),
    type: readonly(type),
    data: readonly(data),
    
    // Методы
    open,
    close,
    toggle
  }
}) 