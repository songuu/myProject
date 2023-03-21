import React, { useEffect, useCallback } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Input, SIZE } from 'baseui/input'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { SvgIcon, Popconfirm } from '@root/components'

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
              className={`relative px-2 flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e] ${
                isActive(item.id)
                  ? 'border-[#335eea] bg-neutral-100 text-[#335eea] dark:bg-[#24272e] dark:border-[#335eea] pr-14'
                  : ''
              }`}
              onClick={() => handleSelect(item.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-7 h-7 bg-gray-200 rounded-full  ${
                    isActive(item.id) ? 'text-[#335eea]' : 'text-white'
                  }`}
                >
                  <SvgIcon iconName="chat" />
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
                    <span>{item.title}</span>
                  )}
                </div>
              </div>
              {isActive(item.id) && (
                <div className="absolute z-1 flex visible right-1">
                  {item.isEdit ? (
                    <button
                      className="p-1 w-[22px] h-[22px] flex items-center justify-center"
                      onClick={() => handleEdit(item, false)}
                    >
                      <SvgIcon iconName="save" className="text-[#335eea]" />
                    </button>
                  ) : (
                    <>
                      <button
                        className="p-1 w-[22px] h-[22px] flex items-center justify-center"
                        onClick={() => handleEdit(item, true)}
                      >
                        <SvgIcon iconName="edit" className="text-[#335eea]" />
                      </button>
                      <Popconfirm
                        title="确定删除么？"
                        onOk={() => {
                          dispatch(deleteChatSessionById(item.id))
                        }}
                        onCancel={() => {}}
                      >
                        <div className="p-1 w-[22px] h-[22px] flex items-center justify-center">
                          <SvgIcon
                            iconName="remove"
                            className="text-[#335eea]"
                          />
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
