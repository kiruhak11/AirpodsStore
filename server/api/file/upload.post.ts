import { defineEventHandler, readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event)
    
    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      })
    }

    const uploadedFiles = []
    
    for (const file of files) {
      if (!file.filename || !file.data) {
        continue
      }

      // Проверяем тип файла
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type || '')) {
        throw createError({
          statusCode: 400,
          statusMessage: `File type ${file.type} not allowed. Only images are allowed.`
        })
      }

      // Проверяем размер файла (максимум 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.data.length > maxSize) {
        throw createError({
          statusCode: 400,
          statusMessage: 'File too large. Maximum size is 5MB.'
        })
      }

      // Генерируем уникальное имя файла
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.filename.split('.').pop()
      const newFilename = `${timestamp}-${randomString}.${extension}`

      // Сохраняем файл в папку uploads
      const uploadDir = './public/uploads'
      const fs = await import('fs/promises')
      const path = await import('path')
      
      // Создаем папку, если её нет
      try {
        await fs.mkdir(uploadDir, { recursive: true })
      } catch (error) {
        // Папка уже существует
      }

      const filePath = path.join(uploadDir, newFilename)
      await fs.writeFile(filePath, file.data)

      uploadedFiles.push({
        originalName: file.filename,
        filename: newFilename,
        url: `/uploads/${newFilename}`,
        size: file.data.length,
        type: file.type
      })
    }

    return {
      success: true,
      files: uploadedFiles
    }
  } catch (error) {
    console.error('File upload error:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during file upload'
    })
  }
}) 