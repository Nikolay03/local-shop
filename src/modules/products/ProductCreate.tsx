import React from 'react'
import { Modal, Form, Checkbox, Button } from 'antd'
import { Controller, FormProvider } from 'react-hook-form'
import { categoriesSelect } from '@/common/fakeBackend/mockData.ts'
import { InputUI, Select } from '@/components/form'
import { useZodForm } from '@/utils/react-hook-form'
import z from 'zod'
import { DatePickerUI } from '@/components/form/datePicker'
import { TextAreaUI } from '@/components/form/textArea'
import { InputNumberUI } from '@/components/form/input/inputNumber.tsx'
import dayjs from 'dayjs'
import { Product } from '@/common/types'
import ImageUpload from '@/components/form/imageUplod.tsx'

interface ProductModalProps {
  visible: boolean
  product: Product
  onClose: () => void
  onSave: (product: Product) => void
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  product,
  onClose,
  onSave,
}) => {
  const validationSchema = z.object({
    model: z.string().min(1, { message: 'Model is required' }),
    releaseYear: z.string().min(1, { message: 'Year is required' }),
    category: z.string().min(1, { message: 'Category is required' }),
    description: z.union([z.string(), z.null()]).optional(),
    visible: z.boolean().optional(),
    image_url: z.string().optional(),
    price: z.number(),
  })

  const form = useZodForm({
    schema: validationSchema,
    defaultValues: product,
  })

  const onSubmit = (data: Omit<Product, 'createdDate' | 'id'>) => {
    onSave({
      ...product,
      ...data,
      id: product ? product.id : new Date().getTime(),
      createdDate: product ? product.createdDate : dayjs().format('YYYY'),
    })
  }
  return (
    <Modal
      open={visible}
      title={product ? 'Редактировать товар' : 'Добавить товар'}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormProvider {...form}>
          <InputUI
            name='model'
            label='Модель'
          />
          <Select
            options={categoriesSelect}
            name='category'
            label='Категория'
          />
          <DatePickerUI
            label='Год релиза'
            name='releaseYear'
            picker='year'
            format='YYYY'
          />
          <InputNumberUI
            type={'number'}
            name='price'
            label='Рекомендуемая розничная цена'
          />
          <TextAreaUI
            name='description'
            label='Описание товара '
          />
          <Form.Item
            valuePropName='checked'
            initialValue={true}
          >
            <Controller
              name='visible'
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                >
                  Видимость товара для пользователей магазина
                </Checkbox>
              )}
            />
          </Form.Item>
          <ImageUpload
            name='image_url'
            label='Изображение'
          />
          <Button
            disabled={!form.formState.isValid && form.formState.isSubmitted}
            type='primary'
            htmlType='submit'
          >
            Сохранить
          </Button>
        </FormProvider>
      </form>
    </Modal>
  )
}

export default ProductModal
