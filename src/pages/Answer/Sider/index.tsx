import React, { useCallback, useState, useEffect } from 'react'

import toast, { Toaster } from 'react-hot-toast'

import { Select, Value, Option } from 'baseui/select'

import { Input } from 'baseui/input'

import { Button } from 'baseui/button'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { createForm } from '@components/Form'

import { ChatSettingType } from '@root/store/action-types'

import { setChatSetting } from '@root/store/actions'

import { ss } from '@utils/storage/local'

import styles from './index.module.less'


const { Form, FormItem, useForm } = createForm<any>()

const Sider = () => {
  const dispatch = useAppDispatch()

  const chatSetting = useAppSelector(state => state.chat.chatSetting)

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState<ChatSettingType>({
    apiKey: '',
    apiURL: '',
  })

  const [form] = useForm()

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

  const onSubmmit = useCallback(async (data: any) => {
    setLoading(true)
    await ss.set('chatSetting', data)
    await dispatch(setChatSetting(data))
    toast('Saved', {
      icon: '👍',
      duration: 3000,
    })
    setLoading(false)
  }, [])

  const onChange = useCallback(
    (_changes: Partial<ChatSettingType>, values_: ChatSettingType) => {
      setValues(values_)
    },
    []
  )

  return (
    <div className={styles['sider']}>
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
        <FormItem
          required
          name="apiKey"
          label="API Key"
          caption="https://platform.openai.com/account/api-keys 生成key"
        >
          <Input autoFocus type="password" size="compact" />
        </FormItem>
        <FormItem name="apiURL" label="API URL">
          <Input size="compact" />
        </FormItem>
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
          <Button isLoading={loading} size="compact">
            Save
          </Button>
        </div>
        <Toaster />
      </Form>
    </div>
  )
}

export default Sider
