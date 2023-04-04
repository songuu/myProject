import React, { useCallback, useState } from 'react'

import { Button, Select, Input, Form } from '@arco-design/web-react'

import { FormType } from '@root/store/action-types'

import { OssTypeMap } from '@mytypes/common'

import { OssType } from '@constants/enums'

interface IProps {
  onSuccess: () => void
}

const AddForm: React.FC<IProps> = ({ onSuccess }) => {
  const [form] = Form.useForm()

  const [loading, setLoading] = useState<boolean>(false)

  const [values, setValues] = useState<FormType>({
    name: new Date().toString(), // 'test1',
    type: OssType.qiniu,
    ak: 'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU',
    sk: 'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y',
  })
  const onSubmit = useCallback(async (data: FormType) => {
    setLoading(true)
    try {
      await window.Main.addApp(values)
      onSuccess()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const onChange = useCallback((_changes: Partial<any>, values_: any) => {
    setValues(values_)
  }, [])

  return (
    <Form
      form={form}
      style={{
        padding: '0 10px',
        overflowX: 'hidden',
      }}
      onSubmit={onSubmit}
      initialValues={values}
      onValuesChange={onChange}
    >
      <Form.Item required field="name" label="名称">
        <Input />
      </Form.Item>
      {/* <FormItem required name="type" label="类型">
        <Input size="compact" />
      </FormItem> */}
      <Form.Item required field="type" label="类型">
        <Select
          options={Object.keys(OssTypeMap).map((item: any) => {
            return {
              id: item,
              label: OssTypeMap[item],
              value: item,
            }
          })}
          placeholder="选择类型"
        />
      </Form.Item>

      <Form.Item required field="ak" label="AK">
        <Input />
      </Form.Item>
      <Form.Item required field="sk" label="SK">
        <Input type="password" />
      </Form.Item>
      <Button loading={loading} onClick={() => form.submit()} size="mini">
        确定
      </Button>
    </Form>
  )
}

export default AddForm
