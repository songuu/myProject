import React, { useCallback, useState, useEffect } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from 'baseui/modal'
import { KIND as ButtonKind } from 'baseui/button'
import { Input } from 'baseui/input'
import { Tabs, Tab } from 'baseui/tabs-motion'
import { LabelSmall } from 'baseui/typography'
import { Spinner } from 'baseui/spinner'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { createForm } from '@components/Form'

import { ChatSettingType } from '@root/store/action-types'

import { getChatSetting, setChatSetting } from '@root/store/actions'

import { fetchChatConfig } from '@root/api/chat'

const { Form, FormItem, useForm } = createForm<any>()

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
  const [form] = useForm()

  const dispatch = useAppDispatch()

  const settings = useAppSelector(state => state.chat.chatSetting)

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState<ChatSettingType>({
    apiKey: '',
    apiURL: '',
    systemMessage: '',
  })

  const [activeKey, setActiveKey] = useState<string | number>('configuration')

  const [config, setConfig] = useState<ConfigState>({})

  const [loadingConfig, setLoadingConfig] = useState(false)

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleOk = () => {
    form.submit()
  }

  const onSubmmit = useCallback(async (data: any) => {
    setLoading(true)
    await dispatch(setChatSetting(data))
    await onOk()
    setLoading(false)
  }, [])

  const onChange = useCallback(
    (_changes: Partial<ChatSettingType>, values_: ChatSettingType) => {
      setValues(values_)
    },
    []
  )

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
      onClose={handleClose}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={SIZE.default}
      role={ROLE.dialog}
    >
      <ModalHeader>ChatGpt配置</ModalHeader>
      <ModalBody>
        {loadingConfig ? (
          <Spinner />
        ) : (
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
            <Tabs
              activeKey={activeKey}
              onChange={({ activeKey }) => {
                setActiveKey(activeKey)
              }}
              activateOnFocus
            >
              <Tab key="configuration" title="配置">
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
              </Tab>
              <Tab key="advanced" title="高级">
                <FormItem name="systemMessage" label="角色设置">
                  <Input size="compact" />
                </FormItem>
              </Tab>
              <Tab key="info" title="信息">
                <div className="flex mb-4">
                  <LabelSmall>api：</LabelSmall>
                  <div>{config?.apiModel ?? '-'}</div>
                </div>
                <div className="flex">
                  <LabelSmall>余量：</LabelSmall>
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
      </ModalBody>
      <ModalFooter>
        <ModalButton kind={ButtonKind.tertiary} onClick={handleClose}>
          取消
        </ModalButton>
        <ModalButton
          onClick={handleOk}
          loading={loading}
          disabled={loadingConfig}
        >
          确认
        </ModalButton>
      </ModalFooter>
    </Modal>
  )
}

export default SettingModal
