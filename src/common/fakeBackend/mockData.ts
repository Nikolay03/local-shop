import { faker } from '@faker-js/faker'
import { Product } from '@/common/types'

const categories = ['laptop', 'smartphone', 'tablet']
export const categoriesSelect = categories.map((category) => ({
  value: category,
  label: category,
}))

export const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, id) => ({
    id,
    model: faker.commerce.productName(),
    releaseYear: faker.date.future().toISOString(),
    category: faker.helpers.arrayElement(categories),
    price: parseFloat(faker.commerce.price()),
    createdDate: faker.date.past().toISOString(),
    image_url: faker.image.avatar(),
    visible: true,
    description: faker.lorem.sentence(),
  }))
}

export const mockProducts = generateMockProducts(25)
