import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      user_metadata: { username: 'Гость' }
    }
  })
}) 