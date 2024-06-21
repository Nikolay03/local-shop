import { useController } from 'react-hook-form'

import { DatePicker, Form, DatePickerProps as AntdDatePickerProps } from 'antd'
import { checkRequired, useZodFormContext } from '@/utils/react-hook-form'
import dayjs from 'dayjs'

export type DatePickerProps = AntdDatePickerProps & {
  name: string
  label?: string
}

export const DatePickerUI = ({ name, label, ...rest }: DatePickerProps) => {
  const { control, schema } = useZodFormContext()
  const { field, fieldState } = useController({
    name,
    control,
  })
  const value = field.value ? dayjs(field.value, 'YYYY') : null

  return (
    <Form.Item
      label={label}
      required={checkRequired(schema, name)}
      validateStatus={fieldState.error?.message ? 'error' : ''}
      help={fieldState.error?.message ? fieldState.error?.message : ''}
      hasFeedback
    >
      <DatePicker
        {...field}
        value={value}
        onChange={(__, dateString) => field.onChange(dateString)}
        {...rest}
      />
    </Form.Item>
  )
}
