import React, { useCallback, useState } from 'react'

import { Input } from 'baseui/input'

import { Button, SIZE } from 'baseui/button'

import { useAppDispatch } from '@root/store'

import { FormType } from '@root/store/action-types'

import { createForm } from '@components/Form'

const { Form, FormItem, useForm } = createForm<any>()

interface IProps {
  onSuccess: () => void
}

const AddForm: React.FC<IProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch()
  const [form] = useForm()

  const [loading, setLoading] = useState<boolean>(false)

  const [values, setValues] = useState<FormType>({
    name: 'test',
    type: 'qiniu',
    ak: 'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU',
    sk: 'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y',
  })
  const onSubmmit = useCallback(async (data: FormType) => {
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

  const onChange = useCallback(
    (_changes: Partial<FormType>, values_: FormType) => {
      setValues(values_)
    },
    []
  )

  return (
    <Form
      form={form}
      style={{
        padding: '0 10px',
        overflowX: 'hidden',
      }}
      onFinish={onSubmmit}
      initialValues={values}
      onValuesChange={onChange}
    >
      <FormItem required name="name" label="名称">
        <Input size="compact" />
      </FormItem>
      <FormItem required name="type" label="类型">
        <Input size="compact" />
      </FormItem>
      <FormItem required name="ak" label="AK">
        <Input size="compact" />
      </FormItem>
      <FormItem required name="sk" label="SK">
        <Input size="compact" type="password" />
      </FormItem>
      <Button
        isLoading={loading}
        onClick={() => form.submit()}
        size={SIZE.compact}
      >
        确定
      </Button>
    </Form>
  )
}

export default AddForm
