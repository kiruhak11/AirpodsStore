import { prisma } from '../../utils/prisma'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return categories
}) 