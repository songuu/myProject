import React, { useState, useEffect, useCallback } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import { Input, SIZE } from 'baseui/input'

import { SvgIcon, Popconfirm } from '@root/components'

const List = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [list, setList] = useState([])

  const [activeId, setActiveId] = useState('')

  const initState = async () => {
    const chatSessions = await window.Main.getChatSessions()

    const activeId = await window.Main.getActiveChatSession()

    if (chatSessions.length > 0 && activeId) {
      setList(chatSessions)
      setActiveId(activeId)
    } else {
      setList([])
      setActiveId('')
      navigate({ search: `/main_window/chat` })
    }
  }

  const isActive = (id: string) => {
    return activeId === id
  }

  const handleSelect = (id: string) => {
    if (isActive(id)) return
    window.Main.setActiveChatSession(id).then((r: boolean) => {
      if (r) {
        setActiveId(id)
        navigate({ search: `/main_window/chat?id=${id}` })
      }
    })
  }

  const handleEdit = (item: any, isEdit: boolean) => {
    window.Main.editChatSession({
      ...item,
      isEdit,
    }).then((r: boolean) => {
      if (r) {
        initState().then(r => r)
      }
    })
  }

  const handleEnter = (e: any, item: any, isEdit: boolean) => {
    if (e.key === 'Enter') {
      window.Main.editChatSession({
        ...item,
        isEdit,
      }).then((r: boolean) => {
        if (r) {
          initState().then(r => r)
        }
      })
    }
  }

  useEffect(() => {
    initState().then(r => r)
  }, [location.search])

  return (
    <div className="flex flex-col gap-2 p-4 pb-0 text-sm">
      {list.length > 0 ? (
        list.map((item: any) => {
          return (
            <div
              key={item.id}
              className={`relative px-2 flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e] ${
                isActive(item.id)
                  ? 'border-[#4b9e5f] bg-neutral-100 text-[#4b9e5f] dark:bg-[#24272e] dark:border-[#4b9e5f] pr-14'
                  : ''
              }`}
              onClick={() => handleSelect(item.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-7 h-7 bg-gray-200 rounded-full  ${
                    isActive(item.id) ? 'text-[#4b9e5f]' : 'text-white'
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

                        setList(newList)
                      }}
                    />
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
              </div>
              {isActive(item.id) && (
                <div className="absolute z-10 flex visible right-1">
                  {item.isEdit ? (
                    <button
                      className="p-1 w-[22px] h-[22px] flex items-center justify-center"
                      onClick={() => handleEdit(item, false)}
                    >
                      <SvgIcon iconName="save" className="text-[#4b9e5f]" />
                    </button>
                  ) : (
                    <>
                      <button
                        className="p-1 w-[22px] h-[22px] flex items-center justify-center"
                        onClick={() => handleEdit(item, true)}
                      >
                        <SvgIcon iconName="edit" className="text-[#4b9e5f]" />
                      </button>
                      <Popconfirm
                        title="确定删除么？"
                        onOk={() => {
                          window.Main.deleteChatSession(item.id).then(
                            (r: boolean) => {
                              if (r) {
                                initState().then(r => r)
                              }
                            }
                          )
                        }}
                        onCancel={() => {}}
                      >
                        <div className="p-1 w-[22px] h-[22px] flex items-center justify-center">
                          <SvgIcon
                            iconName="remove"
                            className="text-[#4b9e5f]"
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
