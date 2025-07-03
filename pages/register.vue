<template>
  <div class="auth-page-pro">
    <form class="auth-form-pro" @submit.prevent="onSubmit">
      <div class="auth-form-pro__icon"><Icon icon="lucide:user-plus" /></div>
      <h1 class="auth-form-pro__title">Регистрация</h1>
      <div class="form-group-pro">
        <label for="email">Email</label>
        <div class="input-wrap-pro">
          <Icon icon="lucide:mail" />
          <input v-model="email" id="email" type="email" required autocomplete="username" />
        </div>
      </div>
      <div class="form-group-pro">
        <label for="fullName">Имя</label>
        <div class="input-wrap-pro">
          <Icon icon="lucide:user" />
          <input v-model="fullName" id="fullName" type="text" autocomplete="name" />
        </div>
      </div>
      <div class="form-group-pro">
        <label for="password">Пароль</label>
        <div class="input-wrap-pro">
          <Icon icon="lucide:lock" />
          <input v-model="password" id="password" type="password" required autocomplete="new-password" />
        </div>
      </div>
      <div v-if="auth.error" class="form-error-pro"><Icon icon="lucide:alert-circle" /> {{ auth.error }}</div>
      <button type="submit" :disabled="auth.loading" class="auth-btn-pro"><Icon icon="lucide:user-plus" /> Зарегистрироваться</button>
      <p class="auth-link-pro">
        Уже есть аккаунт?
        <NuxtLink to="/login" class="auth-link-chip-pro">Войти</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue';

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const fullName = ref('')

const onSubmit = async () => {
  const ok = await auth.register(email.value, password.value, fullName.value)
  if (ok) {
    router.push('/')
  }
}
</script>

<style scoped lang="scss">
.auth-page-pro {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
.auth-form-pro {
  background: rgba(255,255,255,0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 48px rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
  padding: 2.5rem 2rem;
  min-width: 320px;
  max-width: 360px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
  backdrop-filter: blur(18px);
}
.auth-form-pro__icon {
  font-size: 2.5em;
  color: var(--color-primary);
  filter: drop-shadow(0 0 12px #38f9d7cc);
  margin-bottom: 0.5em;
}
.auth-form-pro__title {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5em;
}
.form-group-pro {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
}
.input-wrap-pro {
  display: flex;
  align-items: center;
  gap: 0.7em;
  background: rgba(255,255,255,0.45);
  border-radius: 0.7em;
  border: 1.5px solid var(--color-border, #ddd);
  padding: 0.5em 1em;
  font-size: 1rem;
  transition: border 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 4px rgba(56,249,215,0.04);
  &:focus-within {
    border-color: var(--color-primary, #38f9d7);
    box-shadow: 0 0 0 2px #38f9d7cc;
  }
  input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    font-size: 1rem;
    padding: 0.5em 0;
    color: var(--color-text, #222);
  }
}
.auth-btn-pro {
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  color: #fff;
  border: none;
  border-radius: 2em;
  padding: 0.9em 2.2em;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(56,249,215,0.10);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7em;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
    box-shadow: 0 8px 32px rgba(56,249,215,0.13);
    transform: translateY(-2px) scale(1.04);
  }
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.form-error-pro {
  color: var(--color-error, #e53e3e);
  font-size: 0.98rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.auth-link-pro {
  text-align: center;
  font-size: 0.98rem;
  margin-top: 0.5em;
}
.auth-link-chip-pro {
  display: inline-block;
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  color: #fff;
  border-radius: 1em;
  padding: 0.3em 1.2em;
  margin-left: 0.5em;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.18s, color 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
    color: #fff;
    transform: translateY(-2px) scale(1.04);
  }
}
@media (max-width: 600px) {
  .auth-form-pro {
    min-width: 0;
    padding: 1.2rem 0.5rem;
    border-radius: 1em;
  }
  .auth-form-pro__title {
    font-size: 1.3rem;
  }
}
</style> 