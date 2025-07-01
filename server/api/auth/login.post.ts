import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email и пароль обязательны' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Неверный email или пароль' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw createError({ statusCode: 401, statusMessage: 'Неверный email или пароль' })

    // Генерируем токен
    const sessionToken = crypto.randomUUID()
    await prisma.user.update({
      where: { id: user.id },
      data: { sessionToken }
    })

    return {
      token: sessionToken,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
})