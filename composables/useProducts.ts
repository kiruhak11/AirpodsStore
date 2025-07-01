export interface Category {
  id: number
  name: string
  description?: string | null
  image?: string | null
  slug?: string | null
}

export interface Product {
  id: number
  name: string
  description?: string | null
  price: number
  image?: string | null
  additionalImages?: any // JSON
  categoryId?: number | null
  color?: string | null
  model?: string | null
  inStock: boolean
  specs?: any // JSON
  createdAt: string
  
  // Additional properties for UI
  isNew?: boolean
  isFeatured?: boolean
  isBestSeller?: boolean
  comparePrice?: number | null
  slug?: string | null
  
  // Related data (populated when needed)
  category?: Category
  images?: ProductImage[]
  reviews?: ProductReview[]
  productDiscounts?: ProductDiscount[]
  _count?: {
    reviews?: number
  }
}

export interface ProductImage {
  id: number
  url: string
  alt?: string | null
  isPrimary?: boolean
  order?: number
}

export interface ProductReview {
  id: number
  rating: number
  comment?: string | null
  userId: number
  productId: number
  createdAt: string
}

export interface ProductDiscount {
  id: number
  productId: number
  discountId: number
  discount?: Discount
}

export interface Discount {
  id: number
  name: string
  description?: string | null
  percentage: number
  isActive: boolean
  startDate: string
  endDate: string
}

export interface User {
  id: number
  email: string
  passwordHash: string
  fullName?: string | null
  phone?: string | null
  role: string
  createdAt: string
}

export interface Order {
  id: number
  userId?: number | null
  totalAmount: number
  status: string
  deliveryAddress?: string | null
  createdAt: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
}

// Вспомогательные связи (foreign keys)
export type ProductWithCategory = Product & { category?: Category }
export type OrderWithItems = Order & { items?: OrderItem[] }
export type OrderItemWithProduct = OrderItem & { product?: Product }

export const useProducts = () => {
  // Получение списка товаров
  const getProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch('/api/products')
      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }
  const getCategories = async (): Promise<Category[]> => {
    try {
      const response = await fetch('/api/categories')
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }
  return { getProducts, getCategories }
} 