<template>
  <div class="profile-page">
    <div v-if="loading" class="profile-loading">Загрузка...</div>
    <div v-else-if="user" class="profile-content">
      <h1 class="profile-title">Профиль</h1>
      <div class="profile-info">
        <div class="profile-row"><span class="profile-label">Email:</span> <span>{{ user.email }}</span></div>
        <div class="profile-row"><span class="profile-label">Имя:</span> <span>{{ user.fullName || '—' }}</span></div>
        <div class="profile-row"><span class="profile-label">Роль:</span> <span>{{ user.role }}</span></div>
      </div>
      <button class="profile-logout" @click="logout">Выйти</button>
    </div>
    <div v-else class="profile-unauth">
      <h2>Вы не авторизованы</h2>
      <NuxtLink to="/login" class="profile-login-link">Войти</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  await authStore.checkAuth()
  loading.value = false
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-page {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background: var(--color-card, #fff);
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
.profile-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-text, #222);
}
.profile-info {
  margin-bottom: 2rem;
}
.profile-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.profile-label {
  font-weight: 500;
  color: var(--color-primary, #0070f3);
}
.profile-logout {
  background: var(--color-error, #e53e3e);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.profile-logout:hover {
  background: #c53030;
}
.profile-unauth {
  text-align: center;
  padding: 2rem 0;
}
.profile-login-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary, #0070f3);
  text-decoration: underline;
  font-weight: 500;
}
.profile-loading {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-secondary, #888);
}
</style>