<template>
  <NuxtLayout name="default">
    <section class="container admin-section">
      <div v-if="!isAuth" class="admin-auth card">
        <h1>Вход в админ-панель</h1>
        <input v-model="password" type="password" placeholder="Пароль" />
        <button class="btn" @click="login">Войти</button>
        <div v-if="authError" class="admin-error">Неверный пароль</div>
      </div>
      <div v-else class="admin-panel card">
        <div class="admin-tabs">
          <button :class="['btn', { active: tab === 'orders' }]" @click="tab = 'orders'">Заказы</button>
          <button :class="['btn', { active: tab === 'products' }]" @click="tab = 'products'">Товары</button>
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
                <td>{{ order.user?.fullName || '-' }}</td>
                <td>{{ order.user?.phone || '-' }}</td>
                <td>{{ order.user?.email || '-' }}</td>
                <td>{{ order.deliveryAddress }}</td>
                <td>
                  <ul>
                    <li v-for="item in order.items" :key="item.id">{{ item.product?.name }} x{{ item.quantity }}</li>
                  </ul>
                </td>
                <td>{{ order.totalAmount }} ₽</td>
                <td>{{ order.createdAt?.split('T')[0] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="tab === 'products'" class="admin-products">
          <h2>Товары</h2>
          <button class="btn" @click="showAddProduct = true">Добавить товар</button>
          <ul class="product-list">
            <li v-for="product in products" :key="product.id" class="product-row card">
              <img :src="product.image || 'https://placehold.co/400x300/667eea/ffffff?text=KES+System'" :alt="product.name" class="product-img" />
              <span>{{ product.name }}</span>
              <span>{{ product.price }} ₽</span>
              <button class="btn small" @click="startEditProduct(product)">Редактировать</button>
              <button class="btn small red" @click="deleteProduct(product.id)">Удалить</button>
            </li>
          </ul>
          <div v-if="showAddProduct" class="modal">
            <div class="modal-content card">
              <h3>Добавить товар</h3>
              <input v-model="newProduct.name" placeholder="Название" />
              <input v-model="newProduct.price" type="number" placeholder="Цена" />
              <input v-model="newProduct.image" placeholder="URL картинки" />
              <select v-model="newProduct.categoryId">
                <option value="">Категория</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <input v-model="newProduct.color" placeholder="Цвет" />
              <input v-model="newProduct.model" placeholder="Модель" />
              <label class="checkbox-label">
                <input type="checkbox" v-model="newProduct.inStock" /> В наличии
              </label>
              <textarea v-model="newProduct.description" placeholder="Описание"></textarea>
              <textarea v-model="newProduct.additionalImages" placeholder='Доп. изображения (JSON: ["url1","url2"])'></textarea>
              <textarea v-model="newProduct.specs" placeholder='Характеристики (JSON: [{"key":"Bluetooth","value":"5.0"}])'></textarea>
              <button class="btn" @click="addProduct">Добавить</button>
              <button class="btn" @click="showAddProduct = false">Отмена</button>
            </div>
          </div>
          <div v-if="showEditProduct" class="modal">
            <div class="modal-content card">
              <h3>Редактировать товар</h3>
              <input v-model="editProduct.name" placeholder="Название" />
              <input v-model="editProduct.price" type="number" placeholder="Цена" />
              <input v-model="editProduct.image" placeholder="URL картинки" />
              <select v-model="editProduct.categoryId">
                <option value="">Категория</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <input v-model="editProduct.color" placeholder="Цвет" />
              <input v-model="editProduct.model" placeholder="Модель" />
              <label class="checkbox-label">
                <input type="checkbox" v-model="editProduct.inStock" /> В наличии
              </label>
              <textarea v-model="editProduct.description" placeholder="Описание"></textarea>
              <textarea v-model="editProduct.additionalImages" placeholder='Доп. изображения (JSON: ["url1","url2"])'></textarea>
              <textarea v-model="editProduct.specs" placeholder='Характеристики (JSON: [{"key":"Bluetooth","value":"5.0"}])'></textarea>
              <button class="btn" @click="updateProduct">Сохранить</button>
              <button class="btn" @click="showEditProduct = false">Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const ADMIN_PASSWORD = 'appleadmin';
const isAuth = ref(false);
const password = ref('');
const authError = ref(false);
const tab = ref('orders');
const token = ref('');

const login = async () => {
  if (password.value === ADMIN_PASSWORD) {
    isAuth.value = true;
    authError.value = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', 'admin');
      token.value = 'admin';
    }
    fetchOrders();
    fetchProducts();
  } else {
    authError.value = true;
  }
};

// --- ЗАКАЗЫ ---
const orders = ref<any[]>([]);
const fetchOrders = async () => {
  const res = await fetch('/api/order', {
    headers: { Authorization: `Bearer ${token.value}` }
  });
  if (res.ok) orders.value = await res.json();
};

// --- ТОВАРЫ ---
const products = ref<any[]>([]);
const fetchProducts = async () => {
  const res = await fetch('/api/products');
  if (res.ok) products.value = await res.json();
};

const showAddProduct = ref(false);
const showEditProduct = ref(false);
const newProduct = ref({
  name: '',
  price: '',
  image: '',
  description: '',
  categoryId: '',
  color: '',
  model: '',
  inStock: true,
  specs: '',
  additionalImages: ''
});
const editProduct = ref<any>(null);
const categories = ref<any[]>([]);

const fetchCategories = async () => {
  const res = await fetch('/api/categories');
  if (res.ok) categories.value = await res.json();
};

const addProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price) return;
  let specs = newProduct.value.specs;
  let additionalImages = newProduct.value.additionalImages;
  try { specs = specs ? JSON.parse(specs) : []; } catch { specs = ''; }
  try { additionalImages = additionalImages ? JSON.parse(additionalImages) : []; } catch { additionalImages = ''; }
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify({
      name: newProduct.value.name,
      price: Number(newProduct.value.price),
      image: newProduct.value.image,
      description: newProduct.value.description,
      categoryId: newProduct.value.categoryId ? Number(newProduct.value.categoryId) : null,
      color: newProduct.value.color,
      model: newProduct.value.model,
      inStock: newProduct.value.inStock,
      specs,
      additionalImages
    })
  });
  if (res.ok) {
    showAddProduct.value = false;
    newProduct.value = { name: '', price: '', image: '', description: '', categoryId: '', color: '', model: '', inStock: true, specs: '', additionalImages: '' };
    fetchProducts();
  } else {
    alert('Ошибка добавления товара');
  }
};

const startEditProduct = (product: any) => {
  editProduct.value = {
    ...product,
    specs: product.specs ? JSON.stringify(product.specs) : '',
    additionalImages: product.additionalImages ? JSON.stringify(product.additionalImages) : ''
  };
  showEditProduct.value = true;
};
const updateProduct = async () => {
  const { id, name, price, image, description, categoryId, color, model, inStock } = editProduct.value;
  let specs = editProduct.value.specs;
  let additionalImages = editProduct.value.additionalImages;
  try { specs = specs ? JSON.parse(specs) : []; } catch { specs = ''; }
  try { additionalImages = additionalImages ? JSON.parse(additionalImages) : []; } catch { additionalImages = ''; }
  const res = await fetch('/api/products', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify({ id, name, price, image, description, categoryId: categoryId ? Number(categoryId) : null, color, model, inStock, specs, additionalImages })
  });
  if (res.ok) {
    showEditProduct.value = false;
    editProduct.value = null;
    fetchProducts();
  } else {
    alert('Ошибка обновления товара');
  }
};
const deleteProduct = async (id: number) => {
  if (!confirm('Удалить товар?')) return;
  const res = await fetch('/api/products', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`
    },
    body: JSON.stringify({ id })
  });
  if (res.ok) fetchProducts();
  else alert('Ошибка удаления товара');
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    token.value = localStorage.getItem('admin_token') || '';
  }
  fetchCategories();
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
