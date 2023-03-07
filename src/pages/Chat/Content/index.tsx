import React, { useState } from 'react'
import axios from 'axios'
import styles from './index.module.less'

const ChatBot = () => {
  const [inputValue, setInputValue] = useState('')
  const [chatHistory, setChatHistory] = useState<any>([])

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
    setChatHistory([...chatHistory, { message: inputValue, isBot: false }])

    setInputValue('');
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
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
          Authorization: `Bearer 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`,
        },
      }
    )
    setChatHistory([
      ...chatHistory,
      { message: inputValue, isBot: false },
      { message: response.data.choices[0].text.trim(), isBot: true },
    ])
    // setInputValue('')
  }

  return (
    <div className={styles['chat-bot-container']}>
      <div className={styles['chat-bot-messages']}>
        {chatHistory.map((chat, index) => (
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
            <div className={styles['message']}>{chat.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles['chat-bot-input']}>
        <input
          type="text"
          placeholder="请输入"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
        />
        <button type="submit">发送</button>
      </form>
    </div>
  )
}

export default ChatBot
