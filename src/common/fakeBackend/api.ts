import { generateMockProducts } from './mockData.ts'
import dayjs from 'dayjs'
import { Product } from '@/common/types'

let products: Product[] = generateMockProducts(50)

// Симуляция задержки
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface Filters {
  model: string
  category?: string
}

export const fetchProducts = async (
  filters: Filters,
  page: number,
  pageSize: number
) => {
  await delay(500)
  let filteredProducts = products

  if (filters?.model) {
    filteredProducts = filteredProducts.filter((product) =>
      product.model.toLowerCase().includes(filters.model.toLowerCase())
    )
  }

  if (filters.category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === filters.category
    )
  }

  const total = filteredProducts.length
  const start = (page - 1) * pageSize
  const end = page * pageSize
  const paginatedProducts = filteredProducts.slice(start, end)

  return { data: paginatedProducts, total }
}

export const addProduct = async (
  product: Omit<Product, 'id' | 'createdDate'>
) => {
  await delay(500)
  const newProduct: Product = {
    ...product,
    id: products.length + 1,
    createdDate: dayjs().format('YYYY-MM-DD'),
  }
  products.push(newProduct)
  return newProduct
}

export const updateProduct = async (updatedProduct: Product) => {
  await delay(500)
  products = products.map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product
  )
  return updatedProduct
}

export const deleteProduct = async (id: number) => {
  await delay(500)
  products = products.filter((product) => product.id !== id)
}
