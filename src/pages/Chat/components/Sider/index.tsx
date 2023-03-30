import React, { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { useSearchParams } from 'react-router-dom'

import { useAppDispatch } from '@root/store/index'

import { clearChatSessions, addChatSession } from '@root/store/actions'

import { Button } from '@components/index'

import List from './list'

import SettingModal from './setting-modal'

import PrompStoreModal from './prompStore'

const Sider = () => {
  const [, setSearch] = useSearchParams()

  const dispatch = useAppDispatch()

  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)

  const [isPrompStoreModalOpen, setIsPrompStoreModalOpen] = useState(true)

  const handleClose = () => {
    setIsSettingModalOpen(false)
  }
  const handleOk = () => {
    setIsSettingModalOpen(false)
  }

  const handleNewSession = async () => {
    const id = uuidv4()

    const data = {
      id,
      title: '新对话',
      isEdit: false,
    }

    await dispatch(addChatSession(data))

    setSearch(`id=${id}`)
  }

  const handleClearAllSession = async () => {
    await dispatch(clearChatSessions())

    setSearch(`id=''`)
  }

  const handleClosePromtStore = () => {}

  const handleOkPromtStore = () => {}

  return (
    <div className="flex flex-col h-full w-[260px] border-r-zinc-50 dark:border-r-gray-600 border-r-2">
      <main className="flex flex-col flex-1 min-h-0">
        <div className="p-4 pb-0">
          <Button
            type="dashed"
            className="bg-white w-full dark:bg-[#24272e] dark:text-white"
            onClick={handleNewSession}
          >
            新对话
          </Button>
        </div>
        <div className="flex-1 min-h-0 pb-0 overflow-y-auto">
          <List />
        </div>
        <div className="p-4 pb-0">
          <Button
            type="dashed"
            className="bg-white w-full dark:bg-[#24272e] dark:text-white"
            onClick={() => {
              setIsPrompStoreModalOpen(true)
            }}
          >
            prompt Store
          </Button>
        </div>
        <div className="p-4 pb-0">
          <Button
            type="dashed"
            className="bg-white w-full dark:bg-[#24272e] dark:text-white"
            onClick={handleClearAllSession}
          >
            清除所有对话
          </Button>
        </div>
        <div className="p-4">
          <Button
            type="dashed"
            className="bg-white w-full dark:bg-[#24272e] dark:text-white"
            onClick={() => {
              setIsSettingModalOpen(true)
            }}
          >
            设置
          </Button>
        </div>
        <SettingModal
          isOpen={isSettingModalOpen}
          onClose={handleClose}
          onOk={handleOk}
        />
        <PrompStoreModal
          isOpen={isPrompStoreModalOpen}
          onClose={handleClosePromtStore}
          onOk={handleOkPromtStore}
        />
      </main>
    </div>
  )
}

export default Sider
