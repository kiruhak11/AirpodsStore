<template>
  <form @submit.prevent="signUp">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Sign Up</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
const email = ref("");
const password = ref("");

const signUp = async () => {
  const { data, error } = await useNuxtApp().$supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    console.error("Ошибка регистрации:", error.message);
  } else {
    console.log("Пользователь успешно зарегистрирован:", data);
  }
};
</script>
