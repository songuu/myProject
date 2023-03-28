import React, { useEffect, useCallback } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Input, SIZE } from 'baseui/input'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { Popconfirm, Icon } from '@root/components'

import {
  getChatSessions,
  setChatSessions,
  deleteChatSessionById,
  updateChatSession,
  setActiveChatSession,
} from '@root/store/actions'

const List = () => {
  const [search] = useSearchParams()

  const dispatch = useAppDispatch()

  const list = useAppSelector(state => state.chat.sessions)

  const activeId = useAppSelector(state => state.chat.activeSession) || ''

  const isActive = useCallback(
    (id: string) => {
      return activeId === id
    },
    [activeId, list]
  )

  const handleSelect = (id: string) => {
    if (isActive(id)) return
    dispatch(setActiveChatSession(id))
  }

  const handleEdit = (item: any, isEdit: boolean) => {
    dispatch(
      updateChatSession({
        ...item,
        isEdit,
      })
    )
  }

  const handleEnter = (e: any, item: any, isEdit: boolean) => {
    if (e.key === 'Enter') {
      dispatch(
        updateChatSession({
          ...item,
          isEdit,
        })
      )
    }
  }

  useEffect(() => {
    dispatch(getChatSessions())
  }, [search])

  return (
    <div className="flex flex-col gap-2 p-4 pb-0 text-sm">
      {list.length > 0 ? (
        list.map((item: any) => {
          return (
            <div
              key={item.id}
              className={`relative px-2 flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-[#24272e] ${
                isActive(item.id)
                  ? 'border-blue-700 bg-neutral-100 text-blue-700 dark:bg-[#24272e] dark:border-white pr-14'
                  : ''
              }`}
              onClick={() => handleSelect(item.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-7 h-7 bg-gray-200 rounded-full  ${
                    isActive(item.id) ? 'text-blue-700' : 'text-white'
                  }`}
                >
                  <Icon type="icon-chat" />
                </div>
                <div className="relative flex-1 overflow-hidden leading-6 break-all text-ellipsis whitespace-nowrap">
                  {item.isEdit ? (
                    <Input
                      autoFocus
                      value={item.title}
                      size={SIZE.mini}
                      placeholder="请输入"
                      clearOnEscape
                      onKeyPress={e => handleEnter(e, item, false)}
                      onChange={e => {
                        const value = e.target.value

                        const newList: any = list.map((item: any) => {
                          if (item.id === activeId) {
                            return {
                              ...item,
                              title: value,
                            }
                          }
                          return item
                        })

                        dispatch(setChatSessions(newList))
                      }}
                    />
                  ) : (
                    <span className="text-black dark:text-white">
                      {item.title}
                    </span>
                  )}
                </div>
              </div>
              {isActive(item.id) && (
                <div className="absolute flex visible z-1 right-1">
                  {item.isEdit ? (
                    <button
                      className="p-1 w-[22px] h-[22px] flex items-center justify-center"
                      onClick={() => handleEdit(item, false)}
                    >
                      <Icon type="icon-wenku" className="text-blue-700" />
                    </button>
                  ) : (
                    <>
                      <button
                        className="p-1 w-[22px] h-[22px] flex items-center justify-center"
                        onClick={() => handleEdit(item, true)}
                      >
                        <Icon type="icon-bianji" className="text-blue-700" />
                      </button>
                      <Popconfirm
                        title="确定删除么？"
                        onOk={() => {
                          dispatch(deleteChatSessionById(item.id))
                        }}
                        onCancel={() => {}}
                      >
                        <div className="p-1 w-[22px] h-[22px] flex items-center justify-center">
                          <Icon type="icon-shanchu" className="text-blue-700" />
                        </div>
                      </Popconfirm>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })
      ) : (
        <div className="flex items-center justify-center">暂无数据</div>
      )}
    </div>
  )
}

export default List
