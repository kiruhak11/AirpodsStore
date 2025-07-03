<template>
  <div class="profile-page-pro">
    <div v-if="loading" class="profile-loading-pro">
      <Icon icon="lucide:loader" class="profile-loading-pro__icon" /> Загрузка...
    </div>
    <div v-else-if="user" class="profile-content-pro">
      <div class="profile-avatar-pro"><Icon icon="lucide:user-circle" /></div>
      <h1 class="profile-title-pro">Профиль</h1>
      <div class="profile-info-pro">
        <div class="profile-row-pro"><Icon icon="lucide:mail" /> <span class="profile-label-pro">Email:</span> <span>{{ user.email }}</span></div>
        <div class="profile-row-pro"><Icon icon="lucide:user" /> <span class="profile-label-pro">Имя:</span> <span>{{ user.fullName || '—' }}</span></div>
        <div class="profile-row-pro"><Icon icon="lucide:shield" /> <span class="profile-label-pro">Роль:</span> <span>{{ user.role }}</span></div>
      </div>
      <button class="profile-logout-pro" @click="logout"><Icon icon="lucide:log-out" /> Выйти</button>
      <button v-if="user.role === 'admin'" class="profile-admin-fill-btn" @click="fillDemoData" :disabled="filling">
        <Icon icon="lucide:database" /> Заполнить демо-товарами
      </button>
      <button v-if="user.role === 'admin'" class="profile-admin-delete-btn" @click="deleteDemoData" :disabled="filling || deleting">
        <Icon icon="lucide:trash-2" /> Удалить все демо-данные
      </button>
      <div v-if="filling || deleting" class="profile-admin-progress">
        <div class="profile-admin-progress-bar" :style="{ width: progress + '%' }"></div>
        <span>{{ progress }}%</span>
      </div>
    </div>
    <div v-else class="profile-unauth-pro">
      <div class="profile-avatar-pro"><Icon icon="lucide:user-x" /></div>
      <h2>Вы не авторизованы</h2>
      <NuxtLink to="/login" class="profile-login-link-pro"><Icon icon="lucide:log-in" /> Войти</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue';

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)
const loading = ref(true)
const filling = ref(false)
const deleting = ref(false)
const progress = ref(0)

onMounted(async () => {
  loading.value = true
  await authStore.checkAuth()
  loading.value = false
})

function logout() {
  authStore.logout()
  router.push('/login')
}

async function fillDemoData() {
  if (!confirm('Добавить 15 категорий и по 30 товаров в каждую?')) return;
  filling.value = true
  progress.value = 0
  try {
    const token = localStorage.getItem('auth_token') || ''
    const categories = Array.from({ length: 15 }, (_, i) => ({
      name: `Категория ${i + 1}`,
      slug: `category-${i + 1}`,
      description: `Описание для категории ${i + 1}`,
      image: `https://placehold.co/200x200/667eea/fff?text=Cat+${i + 1}`
    }))
    const createdCategories = []
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      const res = await fetch(`/api/admin/categories?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat)
      })
      if (res.ok) {
        const data = await res.json()
        createdCategories.push(data)
      }
      progress.value = Math.round(((i + 1) / (categories.length + 15 * 30)) * 100)
    }
    let total = categories.length + 15 * 30
    let done = categories.length
    for (let i = 0; i < createdCategories.length; i++) {
      const cat = createdCategories[i]
      for (let j = 1; j <= 30; j++) {
        const product = {
          name: `Товар ${j} (${cat.name})`,
          description: `Описание товара ${j} из ${cat.name}`,
          price: (Math.random() * 10000 + 1000).toFixed(2),
          image: `https://placehold.co/400x400/38f9d7/fff?text=Prod+${j}`,
          additionalImages: [],
          categoryId: cat.id,
          color: ["Белый", "Чёрный", "Серый", "Синий"][Math.floor(Math.random()*4)],
          model: `Model-${j}`,
          inStock: Math.random() > 0.1,
          specs: { bluetooth: '5.0', battery: `${Math.floor(Math.random()*10)+5} ч`, warranty: '12 мес' }
        }
        await fetch(`/api/admin/products?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        })
        done++
        progress.value = Math.round((done / total) * 100)
      }
    }
    progress.value = 100
    alert('Данные успешно добавлены!')
  } catch (e) {
    alert('Ошибка при добавлении демо-данных')
  } finally {
    filling.value = false
    setTimeout(() => progress.value = 0, 1200)
  }
}

async function deleteDemoData() {
  if (!confirm('Удалить все демо-товары и демо-категории?')) return;
  deleting.value = true
  progress.value = 0
  try {
    const token = localStorage.getItem('auth_token') || ''
    // Получаем все категории
    const catsRes = await fetch(`/api/categories`)
    const cats = (await catsRes.json()).filter((c: any) => c.slug && c.slug.startsWith('category-'))
    let total = cats.length
    let done = 0
    for (const cat of cats) {
      // Получаем все товары этой категории
      const prodsRes = await fetch(`/api/products?category=${cat.slug}`)
      const prods = await prodsRes.json()
      // Удаляем товары
      for (const prod of prods) {
        await fetch(`/api/admin/products?token=${token}&id=${prod.id}`, { method: 'DELETE' })
      }
      // Удаляем категорию
      await fetch(`/api/admin/categories?token=${token}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id })
      })
      done++
      progress.value = Math.round((done / total) * 100)
    }
    progress.value = 100
    alert('Демо-данные удалены!')
  } catch (e) {
    alert('Ошибка при удалении демо-данных')
  } finally {
    deleting.value = false
    setTimeout(() => progress.value = 0, 1200)
  }
}
</script>

<style scoped lang="scss">
.profile-page-pro {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2.5rem 1.5rem;
  background: rgba(255,255,255,0.18);
  border-radius: 2rem;
  box-shadow: 0 8px 48px rgba(56,249,215,0.10), 0 2px 12px rgba(67,233,123,0.08);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.profile-avatar-pro {
  font-size: 3.2em;
  color: var(--color-primary);
  filter: drop-shadow(0 0 12px #38f9d7cc);
  margin-bottom: 0.5em;
}
.profile-title-pro {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1em;
}
.profile-info-pro {
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1em;
}
.profile-row-pro {
  display: flex;
  align-items: center;
  gap: 0.7em;
  font-size: 1.1rem;
  color: var(--color-text, #222);
}
.profile-label-pro {
  font-weight: 600;
  color: var(--color-primary, #38f9d7);
}
.profile-logout-pro {
  background: linear-gradient(90deg, #e53e3e 0%, #ff4d4f 100%);
  color: #fff;
  border: none;
  padding: 0.85rem 2rem;
  border-radius: 2em;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7em;
  box-shadow: 0 4px 16px rgba(229,62,62,0.10);
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #ff4d4f 0%, #e53e3e 100%);
    box-shadow: 0 8px 32px rgba(229,62,62,0.13);
    transform: translateY(-2px) scale(1.04);
  }
}
.profile-unauth-pro {
  text-align: center;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2em;
}
.profile-login-link-pro {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 1rem;
  color: #fff;
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  border-radius: 1em;
  padding: 0.5em 1.5em;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.18s, color 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
    color: #fff;
    transform: translateY(-2px) scale(1.04);
  }
}
.profile-loading-pro {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-secondary, #888);
  display: flex;
  align-items: center;
  gap: 0.7em;
  justify-content: center;
}
.profile-loading-pro__icon {
  font-size: 1.5em;
  color: var(--color-primary);
  animation: spin 1.2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@media (max-width: 600px) {
  .profile-page-pro {
    padding: 1.2rem 0.5rem;
    border-radius: 1em;
  }
  .profile-title-pro {
    font-size: 1.3rem;
  }
}
.profile-admin-fill-btn, .profile-admin-delete-btn {
  margin-top: 1.2em;
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
  &:hover:enabled {
    background: linear-gradient(90deg, #38f9d7 0%, #667eea 100%);
    box-shadow: 0 8px 32px rgba(56,249,215,0.13);
    transform: translateY(-2px) scale(1.04);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
.profile-admin-delete-btn {
  background: linear-gradient(90deg, #e53e3e 0%, #ff4d4f 100%);
  margin-left: 0.7em;
}
.profile-admin-progress {
  width: 100%;
  max-width: 400px;
  margin: 1.2em auto 0 auto;
  background: rgba(56,249,215,0.08);
  border-radius: 1em;
  height: 1.5em;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-size: 1em;
  box-shadow: 0 2px 8px #38f9d7cc;
}
.profile-admin-progress-bar {
  background: linear-gradient(90deg, #667eea 0%, #38f9d7 100%);
  height: 100%;
  transition: width 0.3s;
  border-radius: 1em 0 0 1em;
}
.profile-admin-progress span {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  color: #fff;
  font-weight: 700;
  text-shadow: 0 1px 4px #38f9d7cc;
}
</style>