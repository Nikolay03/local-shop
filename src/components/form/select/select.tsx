import {
  Select as AntdSelect,
  SelectProps as AntdSelectProps,
  Form,
} from 'antd'
import { useController } from 'react-hook-form'

import { checkRequired, useZodFormContext } from '@/utils/react-hook-form'

import React from 'react'

export type SelectProps = AntdSelectProps & {
  name: string
  label: string
  options?: { label: React.ReactNode; value: string | number }[]
}

export const Select = ({ name, label, options, ...props }: SelectProps) => {
  const { control, schema } = useZodFormContext()
  const { field, fieldState } = useController({
    name,
    control,
  })
  const isRequired = checkRequired(schema, name)

  return (
    <Form.Item
      label={label}
      required={isRequired}
      validateStatus={fieldState.error?.message ? 'error' : ''}
      help={fieldState.error?.message ? fieldState.error?.message : ''}
      hasFeedback
    >
      <AntdSelect
        {...field}
        options={options}
        status={fieldState.error?.message ? 'error' : undefined}
        {...props}
      />
    </Form.Item>
  )
}
