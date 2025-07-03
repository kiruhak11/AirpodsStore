<template>
  <div class="image-uploader">
    <div class="image-uploader__header">
      <h3 class="image-uploader__title">{{ title }}</h3>
      <p class="image-uploader__subtitle">{{ subtitle }}</p>
    </div>

    <!-- Drag & Drop зона -->
    <div 
      class="image-uploader__drop-zone"
      :class="{ 
        'image-uploader__drop-zone--dragover': isDragOver,
        'image-uploader__drop-zone--uploading': isUploading 
      }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @dragenter.prevent
    >
      <div v-if="!isUploading" class="image-uploader__drop-content">
        <Icon icon="lucide:upload-cloud" class="image-uploader__icon" />
        <p class="image-uploader__drop-text">
          Перетащите изображения сюда или
          <label for="file-input" class="image-uploader__file-label">
            выберите файлы
          </label>
        </p>
        <p class="image-uploader__drop-hint">
          Поддерживаются: JPG, PNG, WebP, GIF (максимум 5MB)
        </p>
      </div>
      
      <div v-else class="image-uploader__uploading">
        <Icon icon="lucide:loader-2" class="image-uploader__loading-icon" />
        <p>Загрузка изображений...</p>
      </div>
    </div>

    <!-- Скрытый input для выбора файлов -->
    <input
      id="file-input"
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="image-uploader__file-input"
      @change="handleFileSelect"
    />

    <!-- Загруженные изображения -->
    <div v-if="uploadedImages.length > 0" class="image-uploader__gallery">
      <div 
        v-for="(image, index) in uploadedImages" 
        :key="index"
        class="image-uploader__image-item"
      >
        <img
          :src="image.url" 
          :alt="image.originalName"
          class="image-uploader__image"
        />
        <div class="image-uploader__image-overlay">
          <button 
            @click="removeImage(index)"
            class="image-uploader__remove-btn"
            type="button"
          >
            <Icon icon="lucide:x" />
          </button>
        </div>
        <div class="image-uploader__image-info">
          <span class="image-uploader__image-name">{{ image.originalName }}</span>
          <span class="image-uploader__image-size">{{ formatFileSize(image.size) }}</span>
        </div>
      </div>
    </div>

    <!-- Ошибки -->
    <div v-if="errors.length > 0" class="image-uploader__errors">
      <div 
        v-for="(error, index) in errors" 
        :key="index"
        class="image-uploader__error"
      >
        <Icon icon="lucide:alert-circle" />
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface UploadedImage {
  originalName: string
  filename: string
  url: string
  size: number
  type: string
}

interface Props {
  title?: string
  subtitle?: string
  multiple?: boolean
  modelValue?: UploadedImage[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Загрузка изображений',
  subtitle: 'Добавьте изображения для товара',
  multiple: true,
  modelValue: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: UploadedImage[]]
}>()

// Состояние
const isDragOver = ref(false)
const isUploading = ref(false)
const errors = ref<string[]>([])
const fileInput = ref<HTMLInputElement>()

// Computed
const uploadedImages = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Методы
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files) {
    uploadFiles(Array.from(files))
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    uploadFiles(Array.from(files))
  }
  // Сбрасываем input для возможности повторной загрузки того же файла
  target.value = ''
}

const uploadFiles = async (files: File[]) => {
  if (files.length === 0) return

  isUploading.value = true
  errors.value = []

  try {
    const formData = new FormData()
    
    files.forEach(file => {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        errors.value.push(`${file.name} - не является изображением`)
        return
      }
      
      // Проверяем размер файла
      if (file.size > 5 * 1024 * 1024) {
        errors.value.push(`${file.name} - файл слишком большой (максимум 5MB)`)
        return
      }
      
      formData.append('files', file)
    })

    if (formData.has('files')) {
      const response = await $fetch('/api/file/upload', {
        method: 'POST',
        body: formData
      })

      if (response.success && response.files) {
        const newImages = [...uploadedImages.value, ...response.files.map(file => ({
          ...file,
          type: file.type || 'image/jpeg'
        }))]
        uploadedImages.value = newImages
      }
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    errors.value.push(error?.data?.message || 'Ошибка загрузки файлов')
  } finally {
    isUploading.value = false
  }
}

const removeImage = (index: number) => {
  const newImages = [...uploadedImages.value]
  newImages.splice(index, 1)
  uploadedImages.value = newImages
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped lang="scss">
.image-uploader {
  &__header {
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.25rem 0;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__drop-zone {
    border: 2px dashed var(--color-border);
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    transition: all 0.2s ease;
    background: var(--color-bg);
    cursor: pointer;

    &:hover {
      border-color: var(--color-primary);
      background: var(--color-primary-light);
    }

    &--dragover {
      border-color: var(--color-primary);
      background: var(--color-primary-light);
      transform: scale(1.02);
    }

    &--uploading {
      pointer-events: none;
      opacity: 0.7;
    }
  }

  &__drop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon {
    width: 3rem;
    height: 3rem;
    color: var(--color-text-secondary);
  }

  &__drop-text {
    font-size: 1rem;
    color: var(--color-text);
    margin: 0;
  }

  &__file-label {
    color: var(--color-primary);
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      color: var(--color-primary-hover);
    }
  }

  &__drop-hint {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__uploading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  &__loading-icon {
    width: 2rem;
    height: 2rem;
    color: var(--color-primary);
    animation: spin 1s linear infinite;
  }

  &__file-input {
    display: none;
  }

  &__gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  &__image-item {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--color-card);
    border: 1px solid var(--color-border);
  }

  &__image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }

  &__image-overlay {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &__image-item:hover &__image-overlay {
    opacity: 1;
  }

  &__remove-btn {
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgb(239, 68, 68);
      transform: scale(1.1);
    }
  }

  &__image-info {
    padding: 0.5rem;
  }

  &__image-name {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__image-size {
    display: block;
    font-size: 0.625rem;
    color: var(--color-text-secondary);
  }

  &__errors {
    margin-top: 1rem;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--color-error-light);
    color: var(--color-error);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Dark mode adjustments
:global(.dark) {
  .image-uploader {
    &__drop-zone {
      background: var(--color-card);
      border-color: var(--color-border);

      &:hover {
        background: rgba(var(--color-primary-rgb), 0.1);
      }
    }

    &__image-item {
      background: var(--color-card);
      border-color: var(--color-border);
    }
  }
}
</style> 