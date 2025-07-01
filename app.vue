<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { getProducts, getCategories } = useProducts()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])

const loadData = async () => {
  products.value = await getProducts()
  categories.value = await getCategories()
  console.log('Все товары:', products.value)
  console.log('Все категории:', categories.value)
}

onMounted(loadData)

</script>

<style></style>
