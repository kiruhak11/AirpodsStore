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
  const getProducts = async (params?: Record<string, any>): Promise<ProductsResponse> => {
    let url = '/api/products'
    if (params) {
      const query = new URLSearchParams(params as any).toString()
      url += `?${query}`
    }
    return await fetch(url).then(res => res.json())
  }

  // Получение товара по slug
  const getProduct = async (slug: string): Promise<ProductDetailResponse> => {
    return await fetch(`/api/products/${slug}`).then(res => res.json())
  }

  // Получение категорий
  const getCategories = async (): Promise<Category[]> => {
    return await fetch('/api/categories').then(res => res.json())
  }

  // Получение рекомендуемых товаров
  const getRecommendedProducts = async (categoryId: string, excludeId: string): Promise<Product[]> => {
    const query = new URLSearchParams({ category: categoryId, limit: '4', exclude: excludeId }).toString()
    return await fetch(`/api/products?${query}`).then(res => res.json())
  }

  // Получение товаров по категории
  const getProductsByCategory = async (categorySlug: string, params?: Record<string, any>): Promise<ProductsResponse> => {
    let url = '/api/products'
    const allParams = { ...params, category: categorySlug }
    const query = new URLSearchParams(allParams as any).toString()
    url += `?${query}`
    return await fetch(url).then(res => res.json())
  }

  // Поиск товаров
  const searchProducts = async (queryStr: string, params?: Record<string, any>): Promise<ProductsResponse> => {
    let url = '/api/products'
    const allParams = { ...params, search: queryStr }
    const query = new URLSearchParams(allParams as any).toString()
    url += `?${query}`
    return await fetch(url).then(res => res.json())
  }

  // Получение избранных товаров
  const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
    const query = new URLSearchParams({ featured: 'true', limit: String(limit) }).toString()
    const response = await fetch(`/api/products?${query}`).then(res => res.json())
    return response.products
  }

  // Получение новых товаров
  const getNewProducts = async (limit: number = 8): Promise<Product[]> => {
    const query = new URLSearchParams({ new: 'true', limit: String(limit) }).toString()
    const response = await fetch(`/api/products?${query}`).then(res => res.json())
    return response.products
  }

  // Получение бестселлеров
  const getBestSellers = async (limit: number = 8): Promise<Product[]> => {
    const query = new URLSearchParams({ bestSeller: 'true', limit: String(limit) }).toString()
    const response = await fetch(`/api/products?${query}`).then(res => res.json())
    return response.products
  }

  return {
    getProducts,
    getProduct,
    getCategories,
    getRecommendedProducts,
    getProductsByCategory,
    searchProducts,
    getFeaturedProducts,
    getNewProducts,
    getBestSellers
  }
} 