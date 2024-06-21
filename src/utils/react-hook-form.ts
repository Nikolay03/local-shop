import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  useFormContext,
  FieldValues,
  UseFormProps,
} from 'react-hook-form'
import z, { ZodSchema } from 'zod'

type UseZodFormProps<T extends ZodSchema> = UseFormProps<z.infer<T>> & {
  schema: T
}

export const useZodForm = <T extends ZodSchema>({
  schema,
  ...rest
}: UseZodFormProps<T>) => {
  const form = useForm<z.infer<T>>({
    ...rest,
    resolver: zodResolver(schema),
  })

  return { ...form, schema }
}

export const useZodFormContext = <T extends FieldValues = FieldValues>() => {
  const form = useFormContext<T>()

  type HookFormType = typeof form & {
    schema: z.ZodObject<T>
    getErrorProps: typeof getErrorProps
  }

  const getErrorProps = (name: keyof T) => ({
    error: !!form.formState.errors?.[name],
    helperText: form.formState.errors?.[name]?.message as string,
  })

  return { ...form, getErrorProps } as HookFormType
}

export const checkRequired = (
  schema: z.ZodObject<z.ZodRawShape>,
  name: string
): boolean => {
  if (!schema.shape?.[name]) {
    return false
  }

  const isRequired = !schema.shape?.[name]?.isOptional()

  return isRequired
}
