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

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { createForm } from '@components/Form'

import { ChatSettingType } from '@root/store/action-types'

import { getChatSetting, setChatSetting } from '@root/store/actions'

const { Form, FormItem, useForm } = createForm<any>()

interface IProps {
  isOpen: boolean
  onClose: () => void
  onOk: () => void
}

const SettingModal: React.FC<IProps> = ({ isOpen, onClose, onOk }) => {
  const [form] = useForm()

  const dispatch = useAppDispatch()

  const settings = useAppSelector(state => state.chat.chatSetting)

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState<ChatSettingType>({
    apiKey: '',
    apiURL: '',
  })

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

  useEffect(() => {
    if (isOpen) {
      dispatch(getChatSetting())
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
        </Form>
      </ModalBody>
      <ModalFooter>
        <ModalButton kind={ButtonKind.tertiary} onClick={handleClose}>
          取消
        </ModalButton>
        <ModalButton onClick={handleOk} loading={loading}>
          确认
        </ModalButton>
      </ModalFooter>
    </Modal>
  )
}

export default SettingModal