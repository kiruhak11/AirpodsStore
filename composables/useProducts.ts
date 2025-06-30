export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  costPrice?: number
  sku?: string
  barcode?: string
  weight?: number
  dimensions?: string
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  isBestSeller: boolean
  sortOrder: number
  categoryId: string
  createdAt: string
  updatedAt: string
  category: Category
  images: ProductImage[]
  variants: ProductVariant[]
  specifications: ProductSpecification[]
  reviews: Review[]
  productDiscounts: ProductDiscount[]
  _count: {
    reviews: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  parent?: Category
  children: Category[]
  _count: {
    products: number
  }
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  sortOrder: number
  isPrimary: boolean
  productId: string
  createdAt: string
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  price?: number
  sku?: string
  stockQuantity: number
  productId: string
  createdAt: string
  updatedAt: string
}

export interface ProductSpecification {
  id: string
  name: string
  value: string
  productId: string
  sortOrder: number
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name?: string
    avatar?: string
  }
}

export interface ProductDiscount {
  id: string
  productId: string
  discountId: string
  createdAt: string
  discount: Discount
}

export interface Discount {
  id: string
  name: string
  code?: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' | 'BLACK_FRIDAY'
  value: number
  minAmount?: number
  maxUses?: number
  usedCount: number
  startsAt?: string
  endsAt?: string
  isActive: boolean
  isAutomatic: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ProductDetailResponse {
  product: Product & {
    averageRating: number
  }
  recommendedProducts: Product[]
}

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