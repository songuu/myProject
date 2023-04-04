import React, { useEffect, useState } from 'react'

import { Input, Typography, Tabs, Modal, Card } from '@arco-design/web-react'

const Tab = Tabs.TabPane

const { Title } = Typography

import { useAppDispatch, useAppSelector } from '@root/store'

import {
  getPromptList,
  setPromptList,
  addPrompt,
  updatePrompt,
  deletePrompt,
} from '@root/store/actions'

import { Button, Icon, Message } from '@components/index'

import PromptRecommendList from './recommend.json'

// @ts-ignore
import DataTable from './data-source'

interface IProps {
  isOpen: boolean
  onClose: () => void
  onOk: () => void
}

const PrompStore: React.FC<IProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()

  const promptList = useAppSelector(state => state.prompt.promptList)

  const [activeKey, setActiveKey] = useState<string>('local')

  const [searchValue, setSearchValue] = useState('')

  const [downloadURL, setDownloadURL] = useState('')

  const [importLoading, setImportLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const [modalType, setModalType] = useState('')

  const [tempPromptValue, setTempPromptValue] = useState('')

  const [tempPromptKey, setTempPromptKey] = useState('')

  const [tempModifiedItem, setTempModifiedItem] = useState<any>(null)

  const handleClose = () => {
    onClose()
  }

  const importPromptTemplate = (from = 'online') => {
    try {
      const ll = promptList
      const jsonData = JSON.parse(tempPromptValue)
      let key = ''
      let value = ''

      if (Reflect.has(jsonData[0], 'key')) {
        key = 'key'
        value = 'value'
      } else if (Reflect.has(jsonData[0], 'act')) {
        key = 'act'
        value = 'prompt'
      } else {
        Message.error('prompt key not supported')
        return
      }

      for (const i of jsonData) {
        if (!(key in i) || !(value in i)) throw new Error('importError')
        let safe = true

        for (const j of ll) {
          if (j.key === i[key]) {
            Message.warning(`importRepeatTitle${{ msg: i[key] }}`)
            safe = false
            break
          }
          if (j.value === i[value]) {
            Message.warning(`store.importRepeatContent${{ msg: i[key] }}`)
            safe = false
            break
          }
        }

        if (safe)
          ll.unshift({
            key: i[key],
            value: i[value],
          } as never)
      }

      dispatch(setPromptList(ll))
    } catch (error) {
      Message.error('JSON 格式错误，请检查 JSON 格式')
    }
  }

  const downloadPromptTemplate = async () => {
    try {
      setImportLoading(true)
      const res = await fetch(downloadURL)
      const jsonData = await res.json()

      if (
        Reflect.has(jsonData[0], 'key') &&
        Reflect.has(jsonData[0], 'value')
      ) {
        setTempPromptValue(JSON.stringify(jsonData))
      } else if (
        Reflect.has(jsonData[0], 'act') &&
        Reflect.has(jsonData[0], 'prompt')
      ) {
        const newJsonData = jsonData.map(
          (item: { act: string; prompt: string }) => {
            return {
              key: item.act,
              value: item.prompt,
            }
          }
        )

        setTempPromptValue(JSON.stringify(newJsonData))
      }

      importPromptTemplate()
      setDownloadURL('')
    } catch (error) {
      Message.error('导入失败')
      setDownloadURL('')
    } finally {
      setImportLoading(false)
    }
  }

  const addPromptTemplate = () => {
    for (const i of promptList) {
      if (i.key === tempPromptKey) {
        Message.warning(`store.addRepeatTitleTips${{ msg: i.key }}`)
        return
      }
      if (i.value === tempPromptValue) {
        Message.warning(`store.addRepeatContentTips${{ msg: i.key }}`)
        return
      }
    }

    dispatch(addPrompt({ key: tempPromptKey, value: tempPromptValue }))

    Message.success('store.addSuccessTips')

    changeShowModal('add')
  }

  const modifyPromptTemplate = () => {
    let index = 0

    for (const i of promptList) {
      if (
        i.key === tempModifiedItem.key &&
        i.value === tempModifiedItem.value
      ) {
        break
      }
      index++
    }

    const tempList = promptList.filter((_: any, i: number) => i !== index)

    for (const i of tempList) {
      if (i.key === tempPromptKey) {
        Message.warning(`store.addRepeatTitleTips${{ msg: i.key }}`)
        return
      }
      if (i.value === tempPromptValue) {
        Message.warning(`store.addRepeatContentTips${{ msg: i.key }}`)
        return
      }
    }

    dispatch(
      updatePrompt({
        data: { key: tempPromptKey, value: tempPromptValue },
        type: 'index',
        value: index,
      })
    )

    Message.success('store.modifySuccessTips')
    changeShowModal('modify')
  }

  const changeShowModal = (
    mode: 'add' | 'modify' | 'local_import',
    selected = { key: '', value: '' }
  ) => {
    if (mode === 'add') {
      setTempPromptKey('')
      setTempPromptValue('')
    } else if (mode === 'modify') {
      setTempModifiedItem(selected)
      setTempPromptKey(selected.key)
      setTempPromptValue(selected.value)
    } else if (mode === 'local_import') {
      setTempPromptKey('local_import')
      setTempPromptValue('')
    }

    setShowModal(!showModal)
    setModalType(mode)
  }

  const deletePromptTemplate = (index: number) => {
    dispatch(deletePrompt(index))
  }

  useEffect(() => {
    if (isOpen) {
      dispatch(getPromptList())
    }
  }, [isOpen])

  return (
    <>
      <Modal
        onCancel={handleClose}
        visible={isOpen}
        autoFocus
        wrapClassName="max-w-[900px] w-11/12"
        title="prompStore配置"
      >
        <Tabs
          activeTab={activeKey}
          onChange={(activeTab: string) => {
            setActiveKey(activeTab)
          }}
        >
          <Tab key="local" title="本地">
            <div className="mb-4 flex flex-row justify-between gap-3">
              <div className="flex items-center space-x-4">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => changeShowModal('add')}
                >
                  添加
                </Button>
                <Button
                  size="small"
                  onClick={() => changeShowModal('local_import')}
                >
                  导入
                </Button>
                <Button size="small">导出</Button>
                <Button size="small">清除</Button>
              </div>
              <div className="flex items-center">
                <Input
                  autoFocus
                  value={searchValue}
                  size="mini"
                  placeholder="请输入"
                  onChange={e => {
                    const value = e.target.value
                    setSearchValue(value)
                  }}
                />
              </div>
            </div>
            <DataTable
              handleEdit={() => {}}
              handleDelete={(index: number) => deletePromptTemplate(index)}
            />
          </Tab>
          <Tab key="online" title="在线">
            <p className="mb-4">请校验JSON文件</p>
            <div className="flex items-center gap-4">
              <Input
                autoFocus
                value={downloadURL}
                placeholder="请输入"
                onChange={e => {
                  const value = e.target.value
                  setDownloadURL(value)
                }}
              />
              <Button
                size="default"
                type="primary"
                loading={importLoading}
                disabled={downloadURL.length < 1}
                onClick={downloadPromptTemplate}
              >
                下载
              </Button>
            </div>
            <div className="mt-2 max-h-[360px] space-y-4 overflow-y-auto">
              {PromptRecommendList.map((info: any) => {
                return (
                  <Card>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {info.desc}
                    </p>
                    <div className="flex items-center justify-end space-x-4">
                      <span className="text-xl hover:cursor-pointer">
                        <Icon
                          className="h-[20px] w-[20px] text-[#4f555e] dark:text-white"
                          type="icon-link"
                          onClick={() => {
                            window.Main.openExternal(info.url)
                          }}
                        />
                      </span>
                      <span className="text-xl hover:cursor-pointer">
                        <Icon
                          className="h-[20px] w-[20px] text-[#4f555e] dark:text-white"
                          type="icon-add"
                          onClick={() => {
                            setDownloadURL(info.downloadUrl)
                          }}
                        />
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </Tab>
        </Tabs>
      </Modal>
      <Modal
        visible={showModal}
        wrapClassName="max-w-[600px] w-11/12"
        title="导入设置"
      >
        <>
          {(modalType === 'add' || modalType === 'modify') && (
            <>
              <Title heading={4}>标题</Title>
              <div className="mb-2" />
              <Input
                value={tempPromptKey}
                onChange={value => {
                  setTempPromptKey(value)
                }}
              />
              <Title heading={4}>描述</Title>
              <div className="mb-2" />
              <Input
                type="textarea"
                value={tempPromptValue}
                onChange={value => {
                  setTempPromptValue(value)
                }}
              />
              <Button
                className="mt-2"
                type="primary"
                onClick={() => {
                  modalType === 'add'
                    ? addPromptTemplate()
                    : modifyPromptTemplate()
                }}
              >
                确认
              </Button>
            </>
          )}
          {modalType === 'local_import' && (
            <>
              <Input
                type="textarea"
                value={tempPromptValue}
                onChange={value => {
                  setTempPromptValue(value)
                }}
                min={3}
                max={15}
              />
              <Button
                type="primary"
                onClick={() => {
                  importPromptTemplate('local')
                }}
              >
                提交
              </Button>
            </>
          )}
        </>
      </Modal>
    </>
  )
}

export default PrompStore
