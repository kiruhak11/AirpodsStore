import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  email: string
  fullName?: string | null
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  if (typeof window !== 'undefined' && window.localStorage) {
    token.value = localStorage.getItem('auth_token')
  }
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuth = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      token.value = String(res.token)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auth_token', String(res.token))
      }
      user.value = {
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: res.role
      }
      return true
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Ошибка входа'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, fullName?: string) {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password, fullName }
      })
      // После регистрации сразу логинимся
      return await login(email, password)
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Ошибка регистрации'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token')
    }
  }

  async function checkAuth() {
    const t = token.value || (typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('auth_token') : null)
    if (!t) {
      user.value = null
      return false
    }
    try {
      const res = await $fetch('/api/auth/me', {
        method: 'GET',
        params: { token: t }
      })
      user.value = res as User
      return true
    } catch {
      user.value = null
      token.value = null
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('auth_token')
      }
      return false
    }
  }

  return { user, token, loading, error, isAuth, isAdmin, login, register, logout, checkAuth }
}) 