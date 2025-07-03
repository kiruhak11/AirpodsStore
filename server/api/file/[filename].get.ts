import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const filename = getRouterParam(event, 'filename')
    
    if (!filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Filename is required'
      })
    }

    // Проверяем, что файл существует
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    try {
      await fs.access(filePath)
    } catch {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // Читаем файл
    const fileBuffer = await fs.readFile(filePath)
    
    // Определяем MIME тип на основе расширения
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }
    
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    
    // Устанавливаем заголовки для кэширования
    setHeader(event, 'Cache-Control', 'public, max-age=31536000') // 1 год
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Content-Length', fileBuffer.length)
    
    return fileBuffer
  } catch (error) {
    console.error('File serve error:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 