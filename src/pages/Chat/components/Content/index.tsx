import React, { useEffect, useMemo, useState, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { SvgIcon, Button, Input, Message } from '@components/index'

import html2canvas from 'html2canvas'

import {
  getChatSessionById,
  getActiveChatSession,
  addChatSessionDataById,
  updateChatSessionDataById,
  deleteChatSessionDataMsgById,
  deleteChatSessionDataById,
} from '@root/store/actions'

import { fetchChatAPIProcess } from '@root/api/chat'

import { emitter } from '@utils/emitter'

import MessageCom from './message'

const openLongReply = true

let controller = new AbortController()

const ChatContent = () => {
  const [search] = useSearchParams()

  const dispatch = useAppDispatch()

  const activeId = useAppSelector(state => state.chat.activeSession) || ''

  const dataSources = useAppSelector(state => state.chat.session) || []

  const [value, setValue] = useState('')

  const [loading, setLoading] = useState(false)

  const [exportLoading, setExportLoading] = useState(false)

  const dataRef = useRef<Chat.Chat[]>([])

  const bottomRef = useRef<HTMLDivElement>(null)

  const conversationList = useMemo(() => {
    return dataSources.filter((item: Chat.Chat) => !item.inversion && !item.error)
  }, [dataSources])

  const scrollToBottom = () => {
    bottomRef.current && bottomRef.current.scrollIntoView(false)
  }

  const handleClear = () => {
    if (loading) return

    dispatch(deleteChatSessionDataById(activeId))
  }

  const handleExport = async () => {
    if (loading) return

    try {
      setExportLoading(true)
      const ele = document.getElementById('image-wrapper')
      const canvas = await html2canvas(ele as HTMLDivElement, {
        useCORS: true,
      })
      const imgUrl = canvas.toDataURL('image/png')
      const tempLink = document.createElement('a')
      tempLink.style.display = 'none'
      tempLink.href = imgUrl
      tempLink.setAttribute('download', 'chat-shot.png')
      if (typeof tempLink.download === 'undefined')
        tempLink.setAttribute('target', '_blank')

      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      window.URL.revokeObjectURL(imgUrl)
      setExportLoading(false)
      Message.info({
        content: '导出成功',
      })
      Promise.resolve()
    } catch (error: any) {
      Message.error({
        content: error.message || '导出失败',
      })
    } finally {
      setExportLoading(false)
    }
  }

  const handleStop = () => {
    if (loading) {
      controller.abort()
      setLoading(false)
    }
  }

  const handleSend = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    onConversation()
  }

  const onConversation = async () => {
    if (loading || !value || value.trim() === '') return

    let message = value

    const data = {
      id: activeId || '',
      data: {
        dateTime: new Date().toLocaleString(),
        text: message,
        inversion: true,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: null },
      },
    }

    await dispatch(addChatSessionDataById(data))

    scrollToBottom()

    setLoading(true)
    setValue('')

    let options: Chat.ConversationRequest = {}

    const lastContext =
      conversationList[conversationList.length - 1]?.conversationOptions

    if (lastContext) {
      options = {
        ...lastContext,
      }
    }

    const data1 = {
      id: activeId || '',
      data: {
        dateTime: new Date().toLocaleString(),
        text: '',
        loading: true,
        inversion: false,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    }

    await dispatch(addChatSessionDataById(data1))

    scrollToBottom()

    try {
      let lastText = ''

      const fetchChatAPIOnce = async () => {
        await fetchChatAPIProcess<Chat.ConversationResponse>({
          prompt: message,
          options,
          signal: controller.signal,
          onDownloadProgress: ({ event }: any) => {
            const xhr = event.target
            const { responseText } = xhr

            const lastIndex = responseText.lastIndexOf('\n')
            let chunk = responseText
            if (lastIndex !== -1) chunk = responseText.substring(lastIndex)

            try {
              const data = JSON.parse(chunk)

              const newData = {
                id: activeId || '',
                index: dataRef.current.length - 1,
                data: {
                  dateTime: new Date().toLocaleString(),
                  text: lastText + data.text ?? '',
                  inversion: false,
                  error: false,
                  loading: false,
                  conversationOptions: {
                    conversationId: data.conversationId,
                    parentMessageId: data.id,
                  },
                  requestOptions: { prompt: message, options: { ...options } },
                },
              }

              dispatch(updateChatSessionDataById(newData))

              if (
                openLongReply &&
                data.detail.choices[0].finish_reason === 'length'
              ) {
                options.parentMessageId = data.id
                message = ''
                lastText = data.text
                return fetchChatAPIOnce()
              }

              scrollToBottom()
            } catch (error) {
              console.log('error', error)
            }
          },
        })
      }

      await fetchChatAPIOnce()
    } catch (error: any) {
      const errorMessage = error?.message || '请求失败'

      if (error.message === 'cancel') {
      }
    } finally {
      setLoading(false)
    }
  }

  async function onRegenerate(index: number) {
    if (loading) return

    controller = new AbortController()

    const { requestOptions } = dataSources[index]

    let message = requestOptions?.prompt ?? ''

    let options: Chat.ConversationRequest = {}

    if (requestOptions.options) options = { ...requestOptions.options }

    setLoading(true)

    const data = {
      id: activeId || '',
      index,
      data: {
        dateTime: new Date().toLocaleString(),
        text: '',
        inversion: false,
        error: false,
        loading: true,
        conversationOptions: null,
        requestOptions: { prompt: message, ...options },
      },
    }

    dispatch(updateChatSessionDataById(data))

    try {
      let lastText = ''
      const fetchChatAPIOnce = async () => {
        await fetchChatAPIProcess<Chat.ConversationResponse>({
          prompt: message,
          options,
          signal: controller.signal,
          onDownloadProgress: ({ event }: any) => {
            const xhr = event.target
            const { responseText } = xhr
            const lastIndex = responseText.lastIndexOf('\n')
            let chunk = responseText
            if (lastIndex !== -1) chunk = responseText.substring(lastIndex)

            try {
              const data = JSON.parse(chunk)

              const newData = {
                id: activeId || '',
                index,
                data: {
                  dateTime: new Date().toLocaleString(),
                  text: lastText + data.text ?? '',
                  inversion: false,
                  error: false,
                  loading: false,
                  conversationOptions: {
                    conversationId: data.conversationId,
                    parentMessageId: data.id,
                  },
                  requestOptions: { prompt: message, ...options },
                },
              }
              dispatch(updateChatSessionDataById(newData))

              if (
                openLongReply &&
                data.detail.choices[0].finish_reason === 'length'
              ) {
                options.parentMessageId = data.id
                lastText = data.text
                message = ''
                return fetchChatAPIOnce()
              }
            } catch (error) {
              console.log('error', error)
            }
          },
        })
      }

      await fetchChatAPIOnce()
    } catch (error: any) {
      const errorMessage = error?.message || '请求失败'

      if (error.message === 'cancel') {
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (index: number) => {
    if (loading) return
    dispatch(deleteChatSessionDataMsgById({ id: activeId || '', index }))
  }

  useEffect(() => {
    dispatch(getActiveChatSession())
  }, [search])

  useEffect(() => {
    if (activeId) {
      dispatch(getChatSessionById(activeId))

      scrollToBottom()
    }
  }, [activeId])

  useEffect(() => {
    dataRef.current = dataSources
  }, [dataSources])

  useEffect(() => {
    emitter.on('regenerate', (index: number) => {
      onRegenerate(index)
    })
    emitter.on('delete', (index: number) => {
      handleDelete(index)
    })

    return () => {
      emitter.off('regenerate')
      emitter.off('delete')
    }
  }, [emitter, activeId])

  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex-1 overflow-hidden">
        <div id="scrollRef" className="h-full overflow-hidden overflow-y-auto">
          <div
            id="image-wrapper"
            ref={bottomRef}
            className="w-full max-w-screen-xl m-auto dark:bg-[#101014] p-4"
          >
            {dataSources.length > 0 ? (
              <div>
                {dataSources.map((item: Chat.Chat, index: number) => {
                  return <MessageCom key={index} {...item} index={index} />
                })}
                <div className="sticky bottom-0 left-0 flex justify-center">
                  {loading && (
                    <Button status="warning" onClick={handleStop}>
                      停止响应
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center mt-4 text-center text-neutral-300">
                <span>你好~</span>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="p-4">
        <div className="w-full max-w-screen-xl m-auto">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Button style={{ backgroundColor: '#fff' }} onClick={handleClear}>
                <span className="text-xl text-[#4f555e] dark:text-white">
                  <SvgIcon
                    mystyle={{ width: '20px', height: '20px' }}
                    iconName="delete"
                  />
                </span>
              </Button>
            </div>
            <div>
              <Button
                loading={exportLoading}
                style={{ backgroundColor: '#fff' }}
                onClick={handleExport}
              >
                <span className="text-xl text-[#4f555e] dark:text-white">
                  <SvgIcon
                    mystyle={{ width: '20px', height: '20px' }}
                    iconName="download1"
                  />
                </span>
              </Button>
            </div>

            <div>
              <Button style={{ backgroundColor: '#fff' }} onClick={handleClear}>
                <span className="text-xl text-[#4f555e] dark:text-white">
                  <SvgIcon
                    mystyle={{ width: '20px', height: '20px' }}
                    iconName="note"
                  />
                </span>
              </Button>
            </div>

            <div className="n-auto-complete">
              <Input
                value={value}
                onChange={e => setValue(e)}
                placeholder="来说点什么吧"
                onKeyDown={handleSend}
              />
            </div>

            <Button type="primary" onClick={handleSubmit}>
              <span className="text-xl text-[#fff] dark:text-white">
                <SvgIcon
                  mystyle={{ width: '20px', height: '20px' }}
                  iconName="send"
                />
              </span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ChatContent
