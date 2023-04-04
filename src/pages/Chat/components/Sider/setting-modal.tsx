import React, { useCallback, useState, useEffect } from 'react'
import {
  Tabs,
  Typography,
  Input,
  Spin,
  Modal,
  Form,
} from '@arco-design/web-react'
const Tab = Tabs.TabPane

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { ChatSettingType } from '@root/store/action-types'

import { getChatSetting, setChatSetting } from '@root/store/actions'

import { fetchChatConfig } from '@root/api/chat'

interface IProps {
  isOpen: boolean
  onClose: () => void
  onOk: () => void
}

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  balance?: string
}

const SettingModal: React.FC<IProps> = ({ isOpen, onClose, onOk }) => {
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()

  const settings = useAppSelector(state => state.chat.chatSetting)

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState<ChatSettingType>({
    apiKey: '',
    apiURL: '',
    systemMessage: '',
  })

  const [activeKey, setActiveKey] = useState<string>('configuration')

  const [config, setConfig] = useState<ConfigState>({})

  const [loadingConfig, setLoadingConfig] = useState(false)

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleOk = () => {
    form.submit()
  }

  const onSubmit = useCallback(async (data: any) => {
    setLoading(true)
    await dispatch(setChatSetting(data))
    await onOk()
    setLoading(false)
  }, [])

  const onChange = useCallback((_changes: Partial<any>, values_: any) => {
    setValues(values_)
  }, [])

  const initData = async () => {
    setLoadingConfig(true)
    const { data } = await fetchChatConfig()
    dispatch(getChatSetting())
    await setConfig(data)

    setLoadingConfig(false)
  }

  useEffect(() => {
    if (isOpen) {
      initData()
    } else {
      form.resetFields()
    }
  }, [isOpen])

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings)
      setValues(settings)
    }
  }, [settings])

  return (
    <Modal
      onCancel={handleClose}
      visible={isOpen}
      autoFocus
      title="ChatGpt配置"
      wrapClassName="w-[720px]"
      onOk={handleOk}
      confirmLoading={loading}
    >
      {loadingConfig ? (
        <Spin />
      ) : (
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
          <Tabs
            activeTab={activeKey}
            onChange={(key: string) => {
              setActiveKey(key)
            }}
          >
            <Tab key="configuration" title="配置">
              <Form.Item
                required
                field="apiKey"
                label="API Key"
                // caption="https://platform.openai.com/account/api-keys 生成key"
              >
                <Input autoFocus type="password" />
              </Form.Item>
              <Form.Item field="apiURL" label="API URL">
                <Input />
              </Form.Item>
            </Tab>
            <Tab key="advanced" title="高级">
              <Form.Item field="systemMessage" label="角色设置">
                <Input />
              </Form.Item>
            </Tab>
            <Tab key="info" title="信息">
              <div className="mb-4 flex">
                <Typography.Title heading={5}>api：</Typography.Title>
                <div>{config?.apiModel ?? '-'}</div>
              </div>
              <div className="flex">
                <Typography.Title heading={5}>余量：</Typography.Title>
                <div>{config?.balance ?? '-'}</div>
              </div>
              {/* <div>
                <LabelXSmall>timeoutMs</LabelXSmall>
                <div>{config.timeoutMs}</div>
              </div>
              <div>
                <LabelXSmall>reverseProxy</LabelXSmall>
                <div>{config.reverseProxy}</div>
              </div> */}
            </Tab>
          </Tabs>
        </Form>
      )}
    </Modal>
  )
}

export default SettingModal
