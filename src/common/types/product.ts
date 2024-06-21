export interface Product {
  id: number
  model: string
  releaseYear: string
  category: string
  price: number
  image_url?: string
  createdDate: string
  visible?: boolean
  description?: string | null
}
