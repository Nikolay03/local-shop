import { ChangeEventHandler } from 'react'
import { Controller, useController } from 'react-hook-form'

import { Form, Input as AntdInput } from 'antd'
import { checkRequired, useZodFormContext } from '@/utils/react-hook-form'
import { TextAreaProps as AntdTextAreaProps } from 'antd/lib/input'

export type TextAreaProps = AntdTextAreaProps & {
  name: string
  label?: string
}

export const TextAreaUI = ({ name, label, ...rest }: TextAreaProps) => {
  const { control, schema } = useZodFormContext()
  const { field, fieldState } = useController({
    name,
    control,
  })

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
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
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AntdInput.TextArea
            {...field}
            onChange={handleChange}
            value={value ?? ''}
            {...rest}
          />
        )}
      />
    </Form.Item>
  )
}
