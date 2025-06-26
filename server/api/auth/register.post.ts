import { prisma } from '../../utils/prisma'
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export default defineEventHandler(async (event) => {
  const { email, password, fullName, phone } = await readBody(event)
  if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'User already exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, passwordHash, fullName, phone } })
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  return { token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } }
}) 