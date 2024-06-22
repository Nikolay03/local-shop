import React, { ChangeEventHandler, useEffect, useState } from 'react'
import { Table, Input, Select, Checkbox, Button, Tooltip, Flex } from 'antd'
import ProductModal from './ProductCreate'
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '@/common/fakeBackend/api.ts'
import { message } from 'antd/lib'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import useDebounce from '@/hooks/useDebounce.ts'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Product } from '@/common/types'
import styled from 'styled-components'

const { Option } = Select
const { Search } = Input

const Filter = styled(Flex)`
  margin-bottom: 16px;
`

const FieldWrapper = styled.div`
  width: 200px;
`

const FieldWrapperSelect = styled(FieldWrapper)`
  & > div {
    width: 200px;
  }
`

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [modelFilter, setModelFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const debouncedModelFilter = useDebounce(modelFilter, 500)

  const fetchProductList = async () => {
    setLoading(true)
    try {
      const { data, total } = await fetchProducts(
        { model: debouncedModelFilter, category: categoryFilter },
        page,
        pageSize
      )
      setProducts(data)
      setTotal(total)
    } catch (error) {
      message.error('Ошибка при загрузке товаров')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductList()
  }, [debouncedModelFilter, categoryFilter, page, pageSize])

  const handleModelSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setModelFilter(e.target.value)
    setPage(1)
  }
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setPage(1)
  }

  const columns: ColumnsType = [
    { title: 'Модель', dataIndex: 'model', key: 'model' },
    {
      title: 'Год релиза',
      dataIndex: 'releaseYear',
      key: 'releaseYear',
      render: (value: string) => dayjs(value).format('YYYY'),
    },
    { title: 'Категория', dataIndex: 'category', key: 'category' },
    {
      title: 'Рекомендуемая розничная цена ',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Дата добавления товара в систему ',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value: string) => dayjs(value).format('DD-MM-YYYY'),
    },
    {
      title: 'Видимость товара для пользователей магазина ',
      dataIndex: 'visible',
      key: 'visible',
      render: (value: boolean) => (
        <Checkbox
          checked={value}
          disabled
        />
      ),
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      key: 'actions',
      render: (__: boolean, record: Product) => (
        <Flex gap={10}>
          <Tooltip title='Редактировать'>
            <Button
              type='primary'
              onClick={() => editProduct(record)}
              shape='circle'
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title='Удалить'>
            <Button
              danger
              type='primary'
              shape='circle'
              onClick={() => confirmDelete(record.id)}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ]

  const editProduct = (product: Product) => {
    setEditingProduct(product)
    setVisible(true)
  }

  const addNewProduct = () => {
    setEditingProduct(null)
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }

  const confirmDelete = async (id: number) => {
    try {
      await deleteProduct(id)
      message.success('Товар удален')
      fetchProductList()
    } catch (error) {
      message.error('Ошибка при удалении товара')
    }
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      if (editingProduct) {
        await updateProduct(product)
        message.success('Товар обновлен')
      } else {
        await addProduct(product)
        message.success('Товар добавлен')
      }
      fetchProductList()
    } catch (error) {
      message.error('Ошибка при сохранении товара')
    } finally {
      closeModal()
    }
  }

  return (
    <div>
      <Filter gap={16}>
        <FieldWrapper>
          <Search
            placeholder='Поиск по модели'
            onChange={handleModelSearch}
          />
        </FieldWrapper>
        <FieldWrapperSelect>
          <Select
            allowClear
            placeholder='Категория'
            onChange={handleCategoryChange}
          >
            <Option value='laptop'>laptop</Option>
            <Option value='smartphone'>smartphone</Option>
            <Option value='tablet'>tablet</Option>
          </Select>
        </FieldWrapperSelect>
        <Button
          type='primary'
          onClick={addNewProduct}
        >
          Добавить товар
        </Button>
      </Filter>
      <Table
        dataSource={products}
        columns={columns}
        rowKey='id'
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
      />
      {visible && (
        <ProductModal
          visible={visible}
          product={editingProduct as Product}
          onClose={closeModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}

export default ProductsList
