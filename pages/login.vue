<template>
  <form @submit.prevent="signIn">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Sign In</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

const signIn = async () => {
  const { $supabase } = useNuxtApp(); // Подключаем Supabase через Nuxt контекст

  const { data, error } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    console.error("Ошибка входа:", error.message);
  } else {
    console.log("Пользователь успешно вошел:", data);
  }
};
</script>
