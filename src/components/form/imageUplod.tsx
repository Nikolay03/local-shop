import React, { useState, useEffect } from 'react'
import { Form, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useController } from 'react-hook-form'
import { useZodFormContext } from '@/utils/react-hook-form.ts'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'

interface ImageUploadProps {
  name: string
  label: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, label }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { control } = useZodFormContext()
  const { field } = useController({
    name,
    control,
  })

  useEffect(() => {
    if (field.value) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: field.value,
        },
      ])
    }
  }, [field.value])
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    const newFileList = fileList.map((file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = URL.createObjectURL(file.originFileObj as RcFile)
      }
      return file
    })
    setFileList(newFileList)
    if (newFileList.length > 0) {
      field.onChange(newFileList[0].preview)
    } else {
      field.onChange(null)
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Загрузить</div>
    </div>
  )

  return (
    <Form.Item label={label}>
      <Upload
        listType='picture-card'
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        onRemove={() => {
          setFileList([])
          field.onChange(null)
        }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
    </Form.Item>
  )
}

export default ImageUpload
