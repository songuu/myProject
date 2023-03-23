import React, { useCallback, useState } from 'react'

import { Input } from 'baseui/input'

import { Button, SIZE } from 'baseui/button'

import { createForm } from '@components/Form'

const { Form, FormItem, useForm } = createForm<any>()

interface FormType {
  name: string
  type: string
  AK: string
  SK: string
}

const AddForm = () => {
  const [form] = useForm()

  const [values, setValues] = useState<FormType>({
    name: '',
    type: '',
    AK: '',
    SK: '',
  })
  const onSubmmit = useCallback(async (data: FormType) => {}, [])

  const onChange = useCallback(
    (_changes: Partial<FormType>, values_: FormType) => {
      setValues(values_)
    },
    []
  )

  return (
    <>
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
        <FormItem required name="AK" label="AK">
          <Input size="compact" />
        </FormItem>
        <FormItem required name="SK" label="SK">
          <Input size="compact" type="password" />
        </FormItem>
      </Form>
      <Button onClick={() => form.submit()} size={SIZE.compact}>
        确定
      </Button>
    </>
  )
}

export default AddForm
