import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export default defineEventHandler(async (event) => {
  const token = event.node.req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
});
