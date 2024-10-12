<template>
  <NuxtLayout name="default">
    <main>
      <div class="container">
        <div class="search-container">
          <div class="relative w-full max-w-sm items-center">
            <Input id="search" v-model="searchQuery" type="text" placeholder="Поиск продуктов..." class="pl-10" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
              <MagnifyingGlassIcon class="size-6 text-muted-foreground" />
            </span>
          </div>
          <Select v-model="selected">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Сортировать" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="option in options" :key="option.id" :value="option.id">{{ option.label }}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="product-list">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" @add-to-cart="addToCart" />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@radix-icons/vue';
// @ts-ignore
import debounce from 'lodash/debounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '~/types/database.types';

const client = useSupabaseClient<Database>();

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const options = ref([
  {
    id: 'asc',
    label: 'По возрастанию цены',
  },
  {
    id: 'desc',
    label: 'По убыванию цены',
  },
]);

const selected = ref<string>(options.value[0].id);

const cartStore = useCartStore();
const searchQuery = ref('');

const { data: filteredProducts, refresh: refreshProducts } = await useAsyncData(
  'products',
  async () => {
    const { data } = await client
      .from('products')
      .select('created_at, description, id, image, name, price')
      .ilike('name', `%${searchQuery.value}%`)
      .order('price', { ascending: selected.value === 'asc' });

    return data ?? [];
  },
  {
    watch: [selected],
  },
);

const addToCart = (product: Product) => {
  cartStore.addToCart(product);
  alert(`${product.name} добавлен в корзину!`);
};

const debouncedSearch = debounce(() => {
  refreshProducts();
}, 500);

watch(
  () => searchQuery.value,
  () => debouncedSearch(),
);
</script>

<style scoped>
.search-container {
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 14px;
  padding-top: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Адаптивное количество колонок */
  justify-content: center;
  gap: 16px;
  padding-bottom: 24px;
}
</style>
