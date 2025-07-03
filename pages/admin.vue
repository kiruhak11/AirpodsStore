<template>
    <section class="container admin-section">
      <div v-if="!isAuth" class="admin-auth card">
        <h1>Вход в админ-панель</h1>
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Пароль" class="input" />
        <button class="btn primary" @click="login">Войти</button>
        <div v-if="authError" class="admin-error">{{ authError }}</div>
      </div>
      <div v-else class="admin-panel card">
        <div class="admin-tabs">
          <button :class="['btn tab', { active: tab === 'products' }]" @click="tab = 'products'">Товары</button>
          <button :class="['btn tab', { active: tab === 'categories' }]" @click="tab = 'categories'">Категории</button>
        </div>
        <div v-if="tab === 'products'" class="admin-products">
          <div class="admin-header">
            <h2>Товары</h2>
            <button class="btn primary" @click="showAddProduct = true">+ Добавить товар</button>
          </div>
          <ul class="product-list">
            <li v-for="product in products" :key="product.id" class="product-row card">
              <ProductImage :src="product.image || placeholderImg(product.name)" :alt="product.name" class="product-img" />
              <div class="product-info">
                <span class="product-title">{{ product.name }}</span>
                <span class="product-price">{{ product.price }} ₽</span>
              </div>
              <button class="btn small" @click="startEditProduct(product)">✏️</button>
              <button class="btn small danger" @click="deleteProduct(product.id)">🗑️</button>
            </li>
          </ul>
          <ProductModal
            v-if="showAddProduct"
            :categories="categories"
            @close="showAddProduct = false"
            @submit="handleAddProduct"
          />
            <ProductModal
              v-if="showEditProduct"
              :product="editProduct"
              :categories="categories"
              :is-edit="true"
              @close="showEditProduct = false"
              @submit="handleUpdateProduct"
            />
        </div>
        <div v-if="tab === 'categories'" class="admin-categories">
          <div class="admin-header">
            <h2>Категории</h2>
            <button class="btn primary" @click="showAddCategory = true">+ Добавить категорию</button>
          </div>
          <ul class="product-list">
            <li v-for="cat in categories" :key="cat.id" class="product-row card">
              <span class="product-title">{{ cat.name }}</span>
              <span class="slug">{{ cat.slug }}</span>
              <img v-if="cat.image" :src="cat.image" class="preview-img" />
              <button class="btn small" @click="startEditCategory(cat)">✏️</button>
              <button class="btn small danger" @click="deleteCategory(cat.id)">🗑️</button>
            </li>
          </ul>
          <div v-if="showAddCategory" class="modal">
            <div class="modal-content card">
              <h3>Добавить категорию</h3>
              <input v-model="newCategory.name" placeholder="Название" class="input" @input="autoSlug('add')" />
              <input v-model="newCategory.slug" placeholder="Slug (латиницей)" class="input" />
              <div class="file-upload">
                <label>Изображение категории</label>
                <input type="file" @change="onCategoryImageUpload($event, 'add')" />
                <img v-if="newCategory.image" :src="newCategory.image" class="preview-img" />
              </div>
              <textarea v-model="newCategory.description" placeholder="Описание" class="input"></textarea>
              <div class="modal-actions">
                <button class="btn primary" @click="addCategory">Добавить</button>
                <button class="btn" @click="showAddCategory = false">Отмена</button>
              </div>
            </div>
          </div>
          <div v-if="showEditCategory" class="modal">
            <div class="modal-content card">
              <h3>Редактировать категорию</h3>
              <input v-model="editCategory.name" placeholder="Название" class="input" @input="autoSlug('edit')" />
              <input v-model="editCategory.slug" placeholder="Slug (латиницей)" class="input" />
              <div class="file-upload">
                <label>Изображение категории</label>
                <input type="file" @change="onCategoryImageUpload($event, 'edit')" />
                <ProductImage v-if="editCategory.image" :src="editCategory.image" class="preview-img" />
              </div>
              <textarea v-model="editCategory.description" placeholder="Описание" class="input"></textarea>
              <div class="modal-actions">
                <button class="btn primary" @click="updateCategory">Сохранить</button>
                <button class="btn" @click="showEditCategory = false">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ProductModal from '~/components/admin/ProductModal.vue';
const isAuth = ref(false);
const email = ref('');
const password = ref('');
const authError = ref('');
const tab = ref('products');
const token = ref('');

const placeholderImg = (name: string) => `https://placehold.co/400x300/667eea/ffffff?text=${encodeURIComponent(name)}`;

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function autoSlug(mode: 'add' | 'edit') {
  if (mode === 'add' && newCategory.value.name) {
    newCategory.value.slug = slugify(newCategory.value.name);
  }
  if (mode === 'edit' && editCategory.value?.name) {
    editCategory.value.slug = slugify(editCategory.value.name);
  }
}

// --- Загрузка изображений ---
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/file/upload', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Ошибка загрузки файла');
  const data = await res.json();
  // Возвращаем URL файла, который теперь будет через API
  return data.files?.[0]?.url || data.url || '';
}

async function onProductImageUpload(e: Event, mode: 'add' | 'edit') {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await uploadFile(file);
  if (mode === 'add') newProduct.value.image = url;
  if (mode === 'edit') editProduct.value.image = url;
}
async function onCategoryImageUpload(e: Event, mode: 'add' | 'edit') {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await uploadFile(file);
  if (mode === 'add') newCategory.value.image = url;
  if (mode === 'edit') editCategory.value.image = url;
}

const login = async () => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    if (!res.ok) throw new Error('Неверный email или пароль');
    const data = await res.json();
    token.value = data.token;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('auth_token', data.token);
    }
    isAuth.value = true;
    authError.value = '';
    fetchProducts();
    fetchCategories();
  } catch (e: any) {
    authError.value = e.message || 'Ошибка входа';
  }
};

// --- ТОВАРЫ ---
const products = ref<any[]>([]);
const fetchProducts = async () => {
  if (!token.value) return;
  const res = await fetch(`/api/admin/products?token=${token.value}`);
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
const editSpecs = ref<{ key: string; value: string }[]>([]);

const addSpec = () => {
  editSpecs.value.push({ key: '', value: '' });
};
const removeSpec = (i: number) => {
  editSpecs.value.splice(i, 1);
};

watch(
  () => editProduct.value,
  (val) => {
    if (val && val.specs) {
      try {
        let parsed = val.specs;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) {
          if (typeof parsed[0] === 'string') {
            editSpecs.value = parsed.map((s: string) => ({ key: s, value: '' }));
          } else {
            editSpecs.value = [...parsed];
          }
        } else if (typeof parsed === 'object') {
          editSpecs.value = Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
        } else {
          editSpecs.value = [];
        }
      } catch {
        editSpecs.value = [];
      }
    } else {
      editSpecs.value = [];
    }
  },
  { immediate: true }
);

const handleAddProduct = async (data: any) => {
  const res = await fetch(`/api/admin/products?token=${token.value}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    showAddProduct.value = false;
    fetchProducts();
  } else {
    alert('Ошибка добавления товара');
  }
};

const handleUpdateProduct = async (data: any) => {
  const res = await fetch(`/api/admin/products?token=${token.value}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) {
    showEditProduct.value = false;
    editProduct.value = null;
    fetchProducts();
  } else {
    alert('Ошибка обновления товара');
  }
};

const addProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price) return;
  let specs = newProduct.value.specs;
  let additionalImages = newProduct.value.additionalImages;
  try { specs = specs ? JSON.parse(specs) : []; } catch { specs = ''; }
  try { additionalImages = additionalImages ? JSON.parse(additionalImages) : []; } catch { additionalImages = ''; }
  const res = await fetch(`/api/admin/products?token=${token.value}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    specs: product.specs || [],
    additionalImages: product.additionalImages || []
  };
  showEditProduct.value = true;
};
const updateProduct = async () => {
  const { id, name, price, image, description, categoryId, color, model, inStock } = editProduct.value;
  let additionalImages = editProduct.value.additionalImages;
  try { additionalImages = additionalImages ? JSON.parse(additionalImages) : []; } catch { additionalImages = ''; }
  const specs = editSpecs.value.filter(s => s.key && s.value);
  const res = await fetch(`/api/admin/products?token=${token.value}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`/api/admin/products?token=${token.value}&id=${id}`, {
    method: 'DELETE'
  });
  if (res.ok) fetchProducts();
  else alert('Ошибка удаления товара');
};

// --- КАТЕГОРИИ ---
const categories = ref<any[]>([]);
const fetchCategories = async () => {
  if (!token.value) return;
  const res = await fetch(`/api/admin/categories?token=${token.value}`);
  if (res.ok) categories.value = await res.json();
};

const showAddCategory = ref(false);
const showEditCategory = ref(false);
const newCategory = ref({ name: '', slug: '', image: '', description: '' });
const editCategory = ref<any>(null);

const addCategory = async () => {
  if (!newCategory.value.name || !newCategory.value.slug) return;
  const res = await fetch(`/api/admin/categories?token=${token.value}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: newCategory.value.name,
      slug: newCategory.value.slug,
      image: newCategory.value.image,
      description: newCategory.value.description
    })
  });
  if (res.ok) {
    showAddCategory.value = false;
    newCategory.value = { name: '', slug: '', image: '', description: '' };
    fetchCategories();
  } else {
    alert('Ошибка добавления категории');
  }
};
const startEditCategory = (cat: any) => {
  editCategory.value = { ...cat };
  showEditCategory.value = true;
};
const updateCategory = async () => {
  const { id, name, slug, image, description } = editCategory.value;
  const res = await fetch(`/api/admin/categories?token=${token.value}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, slug, image, description })
  });
  if (res.ok) {
    showEditCategory.value = false;
    editCategory.value = null;
    fetchCategories();
  } else {
    alert('Ошибка обновления категории');
  }
};
const deleteCategory = async (id: number) => {
  if (!confirm('Удалить категорию?')) return;
  const res = await fetch(`/api/admin/categories?token=${token.value}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  if (res.ok) fetchCategories();
  else alert('Ошибка удаления категории');
};

onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    token.value = localStorage.getItem('auth_token') || '';
    if (token.value) {
      isAuth.value = true;
      fetchProducts();
      fetchCategories();
    }
  }
});
</script>

<style scoped>
@import '@/assets/styles/global/index.scss';
.admin-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.admin-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  background: var(--color-card, #fff);
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  padding: 40px 32px;
  max-width: 400px;
  margin: 0 auto;
}
.input {
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  outline: none;
  background: #fafbfc;
  margin-bottom: 8px;
  transition: border 0.2s;
}
.input:focus {
  border: 1.5px solid #0071e3;
}
.btn {
  background: #f3f4f6;
  color: #222;
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0 4px;
  transition: background 0.2s, color 0.2s;
}
.btn.primary {
  background: #0071e3;
  color: #fff;
}
.btn.primary:hover {
  background: #005bb5;
}
.btn.danger {
  background: #ff3b30;
  color: #fff;
}
.btn.danger:hover {
  background: #c1271a;
}
.btn.tab {
  background: none;
  color: #888;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 8px 18px;
}
.btn.tab.active {
  background: #0071e3;
  color: #fff;
}
.btn.small {
  padding: 6px 14px;
  font-size: 0.95rem;
  margin-left: 8px;
}
.admin-panel {
  background: var(--color-card, #fff);
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  padding: 32px 32px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.admin-error {
  color: #ff3b30;
  font-size: 1rem;
  margin-top: 8px;
}
.product-list {
  margin-top: 12px;
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.product-row {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #fafbfc;
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.product-img, .preview-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.product-title {
  font-weight: 600;
  font-size: 1.08rem;
}
.product-price {
  color: #0071e3;
  font-weight: 500;
}
.slug {
  color: #888;
  font-size: 0.98rem;
  margin-left: 8px;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 1rem;
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.16);
  padding: 32px 24px 24px 24px;
  min-width: 320px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  margin: 8px 0;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}
.wide-modal {
  min-width: 480px;
  max-width: 700px;
}
.specs-list {
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.spec-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.spec-input {
  flex: 1;
}
@media (max-width: 700px) {
  .admin-section, .admin-panel {
    padding: 12px 2vw;
  }
  .modal {
    padding: 0;
  }
  .modal-content {
    min-width: 0;
    padding: 18px 6px 12px 6px;
    border-radius: 0;
    max-height: 100vh;
    overflow-y: auto;
  }
  .wide-modal {
    min-width: 0;
    max-width: 100vw;
  }
}

/* Dark mode adjustments */
:global(.dark) {
  .admin-panel {
    background: var(--color-card, #1f2937);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .modal-content {
    background: var(--color-card, #1f2937);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .input {
    background: var(--color-bg, #374151);
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--color-text, #f9fafb);
  }
  
  .product-row {
    background: var(--color-bg, #374151);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
