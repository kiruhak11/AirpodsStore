import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  // Проверка токена и роли
  const token = getQuery(event).token || event.req.headers['x-auth-token']
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Нет токена' })
  const admin = await prisma.user.findUnique({ where: { id: Number(token) } })
  if (!admin || admin.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Нет доступа' })

  const body = await readBody(event)
  const { id, email, fullName, role, password } = body
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id обязателен' })

  const data: any = {}
  if (email) data.email = email
  if (fullName !== undefined) data.fullName = fullName
  if (role) data.role = role
  if (password) data.passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data
  })
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt
  }
}) 