import React, { useState, useEffect } from 'react'
import styles from './index.module.less' // 导入样式文件

interface InputProps {
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

function Input(props: InputProps) {
  const [value, setValue] = useState<string>(props.value || '')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setValue(value)
    props.onChange && props.onChange(value)
  }

  useEffect(() => {
    setValue(props.value || '')
  }, [props.value])

  const { placeholder, type } = props
  return (
    <div className={styles.input}>
      <div className={styles['input-wrapper']}>
        <input
          type={type || 'text'}
          placeholder={placeholder || ''}
          value={value}
          onChange={handleChange}
          onKeyDown={props.onKeyDown}
          onKeyPress={props.onKeyPress}
          onKeyUp={props.onKeyUp}
          className={styles['input-wrapper-inner']}
        />
      </div>
    </div>
  )
}

export default Input
