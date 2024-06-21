import React from 'react'
import { useController } from 'react-hook-form'

import { Form, Input as AntdInput, InputProps as AntdInputProps } from 'antd'
import { checkRequired, useZodFormContext } from '@/utils/react-hook-form'

export type InputProps = AntdInputProps & {
  name: string
  label?: string
}

export const InputUI = ({ name, label, ...rest }: InputProps) => {
  const { control, schema } = useZodFormContext()
  const { field, fieldState } = useController({
    name,
    control,
  })

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === '') {
      field.onChange(null)
    } else {
      field.onChange(e.target.value)
    }
  }

  const value = field.value === null ? '' : field.value

  return (
    <Form.Item
      label={label}
      required={checkRequired(schema, name)}
      validateStatus={fieldState.error?.message ? 'error' : ''}
      help={fieldState.error?.message ? fieldState.error?.message : ''}
      hasFeedback
    >
      <AntdInput
        {...field}
        onChange={handleChange}
        value={value ?? ''}
        {...rest}
      />
    </Form.Item>
  )
}
