import React, { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { useNavigate } from 'react-router-dom'

import { Button } from '@root/components'

import List from './list'

import SettingModal from './setting-modal'

const Sider = () => {
  const navigate = useNavigate()
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)

  const handleClose = () => {
    setIsSettingModalOpen(false)
  }
  const handleOk = () => {
    setIsSettingModalOpen(false)
  }

  const handleNewSession = () => {
    const id = uuidv4()
    window.Main.addChatSession({
      id,
      title: 'New Chat',
      isEdit: false,
    }).then((r: boolean) => {
      if (r) {
        navigate({ search: `/main_window/chat?id=${id}` })
      }
    })
  }

  const handleClearAllSession = () => {
    window.Main.clearChatSessions().then((r: boolean) => {
      if (r) {
        navigate({ search: `/main_window/chat` })
      }
    })
  }

  return (
    <div className="flex flex-col h-full w-[260px] border-r-zinc-50 border-r-2">
      <main className="flex flex-col flex-1 min-h-0">
        <div className="p-4 pb-0">
          <Button
            type="dashed"
            style={{ backgroundColor: '#fff', width: '100%' }}
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
            style={{ backgroundColor: '#fff', width: '100%' }}
            onClick={handleClearAllSession}
          >
            清除所有对话
          </Button>
        </div>
        <div className="p-4">
          <Button
            type="dashed"
            style={{ backgroundColor: '#fff', width: '100%' }}
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
      </main>
    </div>
  )
}

export default Sider
