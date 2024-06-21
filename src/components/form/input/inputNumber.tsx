import { useController } from 'react-hook-form'

import {
  Form,
  InputNumber as AntdInputNumber,
  InputNumberProps as AntdAntdInputNumberProps,
} from 'antd'
import { checkRequired, useZodFormContext } from '@/utils/react-hook-form'

type InputProps = AntdAntdInputNumberProps & {
  name: string
  label?: string
}

export const InputNumberUI = ({ name, label, ...rest }: InputProps) => {
  const { control, schema } = useZodFormContext()
  const { fieldState, field } = useController({
    name,
    control,
  })

  return (
    <Form.Item
      label={label}
      required={checkRequired(schema, name)}
      validateStatus={fieldState.error?.message ? 'error' : ''}
      help={fieldState.error?.message ? fieldState.error?.message : ''}
      hasFeedback
    >
      <AntdInputNumber
        {...field}
        {...rest}
      />
    </Form.Item>
  )
}
