<template>
    <teleport to="body">
  <div class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ isEdit ? 'Редактировать товар' : 'Добавить товар' }}</h2>
        <button @click="closeModal" class="modal-close" type="button">
          <Icon icon="lucide:x" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-grid">
          <!-- Основная информация -->
          <div class="form-section">
            <h3 class="form-section-title">Основная информация</h3>
            
            <div class="form-group">
              <label for="name" class="form-label">Название товара *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="Введите название товара"
                required
              />
            </div>

            <div class="form-group">
              <label for="price" class="form-label">Цена *</label>
              <div class="form-input-group">
                <input
                  id="price"
                  v-model="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-input"
                  placeholder="0.00"
                  required
                />
                <span class="form-input-suffix">₽</span>
              </div>
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Описание</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-textarea"
                rows="4"
                placeholder="Описание товара..."
              ></textarea>
            </div>
          </div>

          <!-- Изображения -->
          <div class="form-section">
            <h3 class="form-section-title">Изображения</h3>
            
            <div class="form-group">
              <label class="form-label">Главное изображение</label>
              <ImageUploader
                v-model="mainImage"
                title="Главное изображение"
                subtitle="Загрузите основное изображение товара"
                :multiple="false"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Дополнительные изображения</label>
              <ImageUploader
                v-model="additionalImages"
                title="Дополнительные изображения"
                subtitle="Загрузите дополнительные изображения товара"
                :multiple="true"
              />
            </div>
          </div>

          <!-- Характеристики -->
          <div class="form-section">
            <h3 class="form-section-title">Характеристики</h3>
            
            <div class="form-group">
              <label for="category" class="form-label">Категория</label>
              <select id="category" v-model="form.categoryId" class="form-select">
                <option value="">Выберите категорию</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="color" class="form-label">Цвет</label>
              <input
                id="color"
                v-model="form.color"
                type="text"
                class="form-input"
                placeholder="Например: Белый, Черный"
              />
            </div>

            <div class="form-group">
              <label for="model" class="form-label">Модель</label>
              <input
                id="model"
                v-model="form.model"
                type="text"
                class="form-input"
                placeholder="Например: AirPods Pro 2"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Статус</label>
              <div class="form-checkbox-group">
                <label class="form-checkbox">
                  <input
                    v-model="form.inStock"
                    type="checkbox"
                    class="form-checkbox-input"
                  />
                  <span class="form-checkbox-label">В наличии</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Спецификации -->
          <div class="form-section">
            <h3 class="form-section-title">Спецификации</h3>
            
            <div class="specs-container">
              <div 
                v-for="(spec, index) in specs" 
                :key="index"
                class="spec-item"
              >
                <input
                  v-model="spec.key"
                  type="text"
                  class="form-input"
                  placeholder="Название характеристики"
                />
                <input
                  v-model="spec.value"
                  type="text"
                  class="form-input"
                  placeholder="Значение"
                />
                <button
                  @click="removeSpec(index)"
                  type="button"
                  class="spec-remove-btn"
                >
                  <Icon icon="lucide:trash-2" />
                </button>
              </div>
              
              <button
                @click="addSpec"
                type="button"
                class="spec-add-btn"
              >
                <Icon icon="lucide:plus" />
                Добавить характеристику
              </button>
            </div>
          </div>
        </div>

        <!-- Действия -->
        <div class="modal-actions">
          <button
            type="button"
            @click="closeModal"
            class="btn btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary"
          >
            <Icon v-if="isSubmitting" icon="lucide:loader-2" class="btn-icon-spin" />
            {{ isSubmitting ? 'Сохранение...' : (isEdit ? 'Обновить' : 'Добавить') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ImageUploader from './ImageUploader.vue'

interface Spec {
  key: string
  value: string
}

interface Product {
  id?: number
  name: string
  price: string
  description: string
  categoryId: string
  color: string
  model: string
  inStock: boolean
  image?: string
  additionalImages?: string[]
  specs?: any[]
}

interface Category {
  id: number
  name: string
}

interface Props {
  product?: Product
  categories: Category[]
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<{
  'close': []
  'submit': [data: any]
}>()

// Состояние
const isSubmitting = ref(false)
const mainImage = ref<any[]>([])
const additionalImages = ref<any[]>([])
const specs = ref<Spec[]>([])

// Форма
const form = ref<Product>({
  name: '',
  price: '',
  description: '',
  categoryId: '',
  color: '',
  model: '',
  inStock: true
})

// Инициализация формы при редактировании
watchEffect(() => {
  if (props.isEdit && props.product) {
    form.value = { ...props.product }
    
    // Загружаем изображения если есть
    if (props.product.image) {
      mainImage.value = [{
        url: props.product.image,
        originalName: 'main-image',
        filename: 'main-image',
        size: 0,
        type: 'image/jpeg'
      }]
    }
    
    // Загружаем дополнительные изображения если есть
    if (props.product.additionalImages && Array.isArray(props.product.additionalImages)) {
      additionalImages.value = props.product.additionalImages.map((url, index) => ({
        url,
        originalName: `additional-${index}`,
        filename: `additional-${index}`,
        size: 0,
        type: 'image/jpeg'
      }))
    }
    
    // Загружаем спецификации если есть
    if (props.product.specs && Array.isArray(props.product.specs)) {
      specs.value = [...props.product.specs]
    }
  }
})

// Методы
const closeModal = () => {
  document.body.style.overflow = 'auto'
  emit('close')
}

// Предотвращаем скролл body когда модальное окно открыто
onMounted(() => {
  if (props.isEdit || !props.isEdit) {
    document.body.style.overflow = 'hidden'
  }
  
  // Добавляем обработчик для закрытия по Escape
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  // Очищаем обработчик при размонтировании
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = 'auto'
  })
})

const addSpec = () => {
  specs.value.push({ key: '', value: '' })
}

const removeSpec = (index: number) => {
  specs.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Подготавливаем данные
    const submitData = {
      ...form.value,
      price: Number(form.value.price),
      categoryId: form.value.categoryId ? Number(form.value.categoryId) : null,
      image: mainImage.value.length > 0 ? mainImage.value[0].url : '',
      additionalImages: additionalImages.value.map(img => img.url),
      specs: specs.value.filter(spec => spec.key && spec.value)
    }
    
    emit('submit', submitData)
  } catch (error) {
    console.error('Submit error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 1rem;
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--color-card);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: calc(100vh - 2rem);
  width: 1200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 1rem;
  position: relative;
  z-index: 1000000;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-border);
    color: var(--color-text);
  }
}

.modal-form {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.form-section {
  &-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--color-primary);
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input-suffix {
  position: absolute;
  right: 0.75rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.form-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary);
}

.form-checkbox-label {
  font-size: 0.875rem;
  color: var(--color-text);
}

.specs-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spec-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  align-items: center;
}

.spec-remove-btn {
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-error-hover);
    transform: scale(1.05);
  }
}

.spec-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  margin-top: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &-primary {
    background: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
      transform: translateY(-1px);
    }
  }

  &-secondary {
    background: var(--color-border);
    color: var(--color-text);

    &:hover {
      background: var(--color-border-hover);
    }
  }
}

.btn-icon-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }
  
  .modal {
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
    margin: 0;
    border-radius: 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .spec-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}

// Dark mode adjustments
:global(.dark) {
  .modal {
    background: var(--color-card, #1f2937);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .form-input,
  .form-textarea,
  .form-select {
    background: var(--color-bg, #374151);
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--color-text, #f9fafb);

    &:focus {
      border-color: var(--color-primary);
    }
  }
  
  .modal-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .modal-actions {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
}
</style> 