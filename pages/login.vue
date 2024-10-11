<template>
  <form @submit.prevent="signIn">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Sign In</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const signIn = async () => {
  const client = useSupabaseClient()  // Используем функцию для получения клиента Supabase

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      console.error('Ошибка входа:', error.message)
    } else {
      console.log('Пользователь успешно вошел:', data)
    }
  } catch (err) {
    console.error('Ошибка при попытке входа:', err)
  }
}
</script>
