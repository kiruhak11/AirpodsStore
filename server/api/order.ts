import { prisma } from '../utils/prisma'
import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    const body = await readBody(event)
    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        totalAmount: body.totalAmount,
        status: 'pending',
        deliveryAddress: body.deliveryAddress,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })
    return order
  }
  if (event.method === 'GET') {
    const auth = getHeader(event, 'authorization')
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'No token' })
    const token = auth.replace('Bearer ', '')
    let payload
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }
    const role = (payload as jwt.JwtPayload)['role']
    if (role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    })
    return orders
  }
  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
