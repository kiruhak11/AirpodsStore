<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
  </ul>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { supabase } from "@/utils/supabase";
const todos = ref<any>([]);

async function getTodos() {
  const { data } = await supabase.from("todos").select();
  todos.value = data;
}

onMounted(() => {
  getTodos();
});
</script>

<style lang="scss">
@import "assets/styles/index";
</style>
