import React, { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from 'baseui/button'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { setChatHistory } from '@root/store/actions'

import useScrollToBottom from '@root/hooks/scrollToBottom'

import styles from './index.module.less'

const defaultApiUrl = 'https://api.openai.com'

const ChatBot = () => {
  const dispatch = useAppDispatch()

  const chatSetting = useAppSelector(state => state.chat.chatSetting)
  const { scrollToBottom, bottomRef } = useScrollToBottom()

  const [inputValue, setInputValue] = useState('')
  const [chatHistorys, setChatHistorys] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (inputValue === '') return
    setChatHistorys([
      ...chatHistorys,
      { message: inputValue, isBot: false },
      { message: '...', isBot: true, loading: true },
    ])

    setInputValue('')
    const ll = [...chatHistorys, { message: inputValue, isBot: false }]

    // https://platform.openai.com/account/api-keys
    const response = await axios
      .post(
        `${chatSetting.apiURL || defaultApiUrl}/v1/completions`,
        {
          prompt: `Q: ${inputValue}\nA:`,
          model: 'text-davinci-003',
          temperature: 0.3,
          max_tokens: 800,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          n: 1,
          stop: '\n',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${chatSetting.apiKey}`,
          },
        }
      )
      .catch(err => {
        console.log(err)
        ll.push({
          isBot: true,
          loading: false,
        })
      })

    if (response) {
      ll.push({
        message: response.data.choices[0].text.trim(),
        isBot: true,
        loading: false,
      })
    }
    dispatch(setChatHistory(ll))
    setChatHistorys(ll)
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistorys, scrollToBottom])

  const idAllow = useMemo(() => {
    return !!chatSetting.apiKey
  }, [chatSetting])

  return (
    <div className={styles['chat-bot-container']}>
      <div className={styles['chat-bot-messages']}>
        {chatHistorys.length === 0 ? (
          <div className="flex items-center justify-center mt-4 text-center text-neutral-300">
            <span>欢迎你~</span>
          </div>
        ) : (
          chatHistorys.map((chat, index) => (
            <div
              key={index}
              className={`${styles['message-container']} ${
                chat.isBot ? styles['bot-message'] : styles['user-message']
              }`}
            >
              <img
                src={
                  chat.isBot
                    ? 'https://i.pravatar.cc/150?img=15'
                    : 'https://i.pravatar.cc/150?img=5'
                }
                alt={chat.isBot ? 'bot' : 'user'}
                className={styles['message-avatar']}
              />
              <div className={styles['message']}>
                {chat.loading ? (
                  <div className="w-[4px] h-[20px] block animate-blink" />
                ) : (
                  chat.message
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles['chat-bot-input']}>
        <input
          type="text"
          placeholder="请输入"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          disabled={loading}
        />
        <Button disabled={!idAllow || loading} size="compact">
          发送
        </Button>
      </form>
    </div>
  )
}

export default ChatBot
