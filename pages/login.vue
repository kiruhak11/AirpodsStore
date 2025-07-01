<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="onSubmit">
      <h1>Вход</h1>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" id="email" type="email" required autocomplete="username" />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input v-model="password" id="password" type="password" required autocomplete="current-password" />
      </div>
      <div v-if="auth.error" class="form-error">{{ auth.error }}</div>
      <button type="submit" :disabled="auth.loading">Войти</button>
      <p class="auth-link">Нет аккаунта? <NuxtLink to="/register">Зарегистрироваться</NuxtLink></p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const onSubmit = async () => {
  const ok = await auth.login(email.value, password.value)
  if (ok) {
    router.push('/')
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-form {
  background: var(--color-card, #fff);
  border-radius: 1rem;
  box-shadow: var(--color-shadow, 0 2px 12px rgba(0,0,0,0.04));
  padding: 2.5rem 2rem;
  min-width: 320px;
  max-width: 360px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
input {
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border, #ddd);
  font-size: 1rem;
}
button[type="submit"] {
  background: var(--color-primary, #6b7280);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.form-error {
  color: var(--color-error, #e53e3e);
  font-size: 0.98rem;
  margin-bottom: 0.5rem;
}
.auth-link {
  text-align: center;
  font-size: 0.98rem;
}
</style> 