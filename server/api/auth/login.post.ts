import { prisma } from '../../utils/prisma'
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  return { token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } }
}) 