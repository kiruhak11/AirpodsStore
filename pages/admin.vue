<template>
  <NuxtLayout name="default">
    <section class="admin-section">
      <div v-if="!isAuth" class="admin-auth">
        <h1>Вход в админ-панель</h1>
        <input v-model="password" type="password" placeholder="Пароль" />
        <button class="admin-btn" @click="login">Войти</button>
        <div v-if="authError" class="admin-error">Неверный пароль</div>
      </div>
      <div v-else class="admin-panel">
        <div class="admin-tabs">
          <button :class="{ active: tab === 'orders' }" @click="tab = 'orders'">Заказы</button>
          <button :class="{ active: tab === 'products' }" @click="tab = 'products'">Товары</button>
        </div>
        <div v-if="tab === 'orders'" class="admin-orders">
          <h2>Заказы</h2>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Адрес</th>
                <th>Товары</th>
                <th>Сумма</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.name }}</td>
                <td>{{ order.phone }}</td>
                <td>{{ order.email }}</td>
                <td>{{ order.address }}</td>
                <td>
                  <ul>
                    <li v-for="item in order.cart" :key="item.id">{{ item.name }} x{{ item.quantity }}</li>
                  </ul>
                </td>
                <td>{{ order.total }} ₽</td>
                <td>{{ order.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="tab === 'products'" class="admin-products">
          <h2>Товары</h2>
          <button class="admin-btn" @click="showAddProduct = true">Добавить товар</button>
          <ul class="product-list">
            <li v-for="product in products" :key="product.id" class="product-row">
              <img :src="product.image_url" :alt="product.name" class="product-img" />
              <span>{{ product.name }}</span>
              <span>{{ product.price }} ₽</span>
              <button class="admin-btn small" @click="startEditProduct(product)">Редактировать</button>
              <button class="admin-btn small red" @click="deleteProduct(product.id)">Удалить</button>
            </li>
          </ul>
          <div v-if="showAddProduct" class="modal">
            <div class="modal-content">
              <h3>Добавить товар</h3>
              <input v-model="newProduct.name" placeholder="Название" />
              <input v-model="newProduct.price" type="number" placeholder="Цена" />
              <input v-model="newProduct.image_url" placeholder="URL картинки" />
              <textarea v-model="newProduct.description" placeholder="Описание"></textarea>
              <button class="admin-btn" @click="addProduct">Добавить</button>
              <button class="admin-btn" @click="showAddProduct = false">Отмена</button>
            </div>
          </div>
          <div v-if="showEditProduct" class="modal">
            <div class="modal-content">
              <h3>Редактировать товар</h3>
              <input v-model="editProduct.name" placeholder="Название" />
              <input v-model="editProduct.price" type="number" placeholder="Цена" />
              <input v-model="editProduct.image_url" placeholder="URL картинки" />
              <textarea v-model="editProduct.description" placeholder="Описание"></textarea>
              <button class="admin-btn" @click="updateProduct">Сохранить</button>
              <button class="admin-btn" @click="showEditProduct = false">Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSupabaseClient } from '#imports';
const ADMIN_PASSWORD = 'appleadmin';
const isAuth = ref(false);
const password = ref('');
const authError = ref(false);
const tab = ref('orders');
const client = useSupabaseClient();

const login = () => {
  if (password.value === ADMIN_PASSWORD) {
    isAuth.value = true;
    authError.value = false;
    fetchOrders();
    fetchProducts();
  } else {
    authError.value = true;
  }
};

// --- ЗАКАЗЫ ---
const orders = ref<any[]>([]);
const fetchOrders = async () => {
  const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
  if (!error && data) {
    orders.value = data.map((order) => ({
      ...order,
      cart: typeof order.cart === 'string' ? JSON.parse(order.cart) : order.cart,
      date: order.created_at ? order.created_at.split('T')[0] : '',
      total: order.total || order.total_price || 0,
    }));
  }
};

// --- ТОВАРЫ ---
const products = ref<any[]>([]);
const fetchProducts = async () => {
  const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
  if (!error && data) products.value = data;
};

const showAddProduct = ref(false);
const showEditProduct = ref(false);
const newProduct = ref({ name: '', price: '', image_url: '', description: '' });
const editProduct = ref<any>(null);

const addProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price) return;
  const { error } = await client.from('products').insert([
    {
      name: newProduct.value.name,
      price: Number(newProduct.value.price),
      image_url: newProduct.value.image_url,
      description: newProduct.value.description,
    },
  ]);
  if (!error) {
    showAddProduct.value = false;
    newProduct.value = { name: '', price: '', image_url: '', description: '' };
    fetchProducts();
  } else {
    alert('Ошибка добавления товара: ' + error.message);
  }
};

const startEditProduct = (product: any) => {
  editProduct.value = { ...product };
  showEditProduct.value = true;
};
const updateProduct = async () => {
  const { id, name, price, image, description } = editProduct.value;
  const { error } = await client.from('products').update({ name, price, image, description }).eq('id', id);
  if (!error) {
    showEditProduct.value = false;
    editProduct.value = null;
    fetchProducts();
  } else {
    alert('Ошибка обновления товара: ' + error.message);
  }
};
const deleteProduct = async (id: number) => {
  if (!confirm('Удалить товар?')) return;
  const { error } = await client.from('products').delete().eq('id', id);
  if (!error) fetchProducts();
  else alert('Ошибка удаления товара: ' + error.message);
};

onMounted(() => {
  if (isAuth.value) {
    fetchOrders();
    fetchProducts();
  }
});
</script>

<style scoped>
.admin-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 0 32px 0;
}
.admin-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 40px 32px;
  max-width: 400px;
  margin: 0 auto;
}
.admin-auth input {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  background: #fafbfc;
  transition: border 0.2s;
}
.admin-auth input:focus {
  border: 1.5px solid #0071e3;
}
.admin-btn {
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
.admin-btn:hover {
  background: #005bb5;
}
.admin-btn.small {
  padding: 6px 16px;
  font-size: 0.95rem;
  margin-left: 8px;
}
.admin-btn.red {
  background: #ff3b30;
}
.admin-btn.red:hover {
  background: #c1271a;
}
.admin-error {
  color: #ff3b30;
  font-size: 1rem;
  margin-top: 8px;
}
.admin-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 32px 32px 24px 32px;
}
.admin-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}
.admin-tabs button {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  padding: 8px 18px;
  border-radius: 12px;
  transition: background 0.2s, color 0.2s;
}
.admin-tabs button.active {
  background: #0071e3;
  color: #fff;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
  background: #fafbfc;
  border-radius: 12px;
  overflow: hidden;
}
.admin-table th,
.admin-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.admin-table th {
  background: #f2f6fa;
  font-weight: 700;
}
.product-list {
  margin-top: 24px;
  list-style: none;
  padding: 0;
}
.product-row {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #fafbfc;
  border-radius: 12px;
  padding: 12px 18px;
  margin-bottom: 12px;
}
.product-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.12);
  padding: 32px 24px 24px 24px;
  min-width: 320px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.modal-content input,
.modal-content textarea {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 1rem;
  outline: none;
  background: #fafbfc;
  transition: border 0.2s;
}
.modal-content input:focus,
.modal-content textarea:focus {
  border: 1.5px solid #0071e3;
}
</style>
