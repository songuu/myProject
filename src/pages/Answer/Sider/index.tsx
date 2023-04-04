import React, { useCallback, useState, useEffect } from 'react'

import toast, { Toaster } from 'react-hot-toast'

import { Input, Button, Form } from '@arco-design/web-react'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { ChatSettingType } from '@root/store/action-types'

import { setChatSetting } from '@root/store/actions'

import { ss } from '@utils/storage/local'

const Sider = () => {
  const dispatch = useAppDispatch()

  const chatSetting = useAppSelector(state => state.chat.chatSetting)

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState<ChatSettingType>({
    apiKey: '',
    apiURL: '',
    systemMessage: '',
  })

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(values)
  }, [form, values])

  useEffect(() => {
    !(async () => {
      /*
       * 四种情况
       * 1. 缓存有数据，store有数据
       *   1.1 缓存数据和store数据不一致
       *     1.1.1 更新缓存
       * 2. 缓存没有数据，store有数据
       *   2.1 更新缓存
       * 3. 缓存有数据，store没有有数据
       *   3.1 更新store
       * 4. 缓存没有数据，store没有数据
       *   4.1 不做处理
       *
       */
      if (ss.get('chatSetting')?.apiKey && chatSetting.apiKey) {
        if (ss.get('chatSetting')?.apiKey !== chatSetting.apiKey) {
          await ss.set('chatSetting', chatSetting)
        }
        await setValues(chatSetting)
      }

      if (!chatSetting.apiKey && ss.get('chatSetting')?.apiKey) {
        await dispatch(setChatSetting(ss.get('chatSetting')))
        await setValues(ss.get('chatSetting'))
      }

      if (chatSetting.apiKey && !ss.get('chatSetting')?.apiKey) {
        await ss.set('chatSetting', chatSetting)
        await setValues(chatSetting)
      }
    })()
  }, [])

  const onSubmit = useCallback(async (data: any) => {
    setLoading(true)
    await ss.set('chatSetting', data)
    await dispatch(setChatSetting(data))
    toast('Saved', {
      icon: '👍',
      duration: 3000,
    })
    setLoading(false)
  }, [])

  const onChange = useCallback((_changes: Partial<any>, values_: any) => {
    setValues(values_)
  }, [])

  return (
    <div className="flex w-[260px] flex-col justify-items-start">
      <Form
        form={form}
        className="overflow-hidden px-[10px] py-[5px]"
        onSubmit={onSubmit}
        initialValues={values}
        onValuesChange={onChange}
      >
        <Form.Item
          required
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          field="apiKey"
          label="API Key"
          // caption="https://platform.openai.com/account/api-keys 生成key"
        >
          <Input autoFocus type="password" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          field="apiURL"
          label="API URL"
        >
          <Input />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <div
            style={{
              marginRight: 'auto',
            }}
          />
          <Button loading={loading}>保存</Button>
        </div>
        <Toaster />
      </Form>
    </div>
  )
}

export default Sider
