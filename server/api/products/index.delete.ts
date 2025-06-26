import { prisma } from '../../utils/prisma'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.id) throw createError({ statusCode: 400, statusMessage: 'ID required' })
  await prisma.product.delete({ where: { id: body.id } })
  return { success: true }
}) 