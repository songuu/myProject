import React from 'react'

import { SvgIcon } from '@root/components'

import Avatar from './avatar'

import Text from './text'

import { copyText } from '@utils/copy'

import { emitter } from '@utils/emitter'

interface IProps {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
  index: number
}

const Message: React.FC<IProps> = ({
  dateTime = '',
  text = '',
  inversion = false,
  error = false,
  loading = false,
  index,
}) => {
  const handleRegenerate = () => {
    emitter.emit('regenerate', index)
  }

  const handleCopy = () => {
    copyText({
      text,
    })
  }

  const handleDelete = () => {
    emitter.emit('delete', index)
  }

  return (
    <div
      className={`flex w-full mb-6 overflow-hidden ${
        inversion && 'flex-row-reverse'
      }`}
    >
      <div
        className={`flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8 ${
          inversion ? 'ml-2' : 'mr-2'
        }`}
      >
        <Avatar />
      </div>
      <div
        className={`overflow-hidden text-sm ${
          inversion ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`flex items-center ${inversion ? 'flex-row-reverse' : ''}`}
        >
          <p
            className={`text-xs text-[#b4bbc4] ${
              inversion ? 'text-right' : 'text-left'
            } `}
          >
            {dateTime}
          </p>
          <div className="flex ml-1 ">
            <div
              className="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
              onClick={handleCopy}
            >
              <SvgIcon iconName="copy" iconClass="w-[14px] h-[14px]" />
            </div>
            <div
              className="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
              onClick={handleDelete}
            >
              <SvgIcon iconName="del" iconClass="w-[14px] h-[14px]" />
            </div>
          </div>
        </div>

        <div
          className={`flex items-end gap-1 mt-2 ${
            inversion ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <Text
            inversion={inversion}
            text={text}
            error={error}
            loading={loading}
          />
          <div className="flex flex-col">
            {!inversion && (
              <div
                className="mb-2 transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
                onClick={handleRegenerate}
              >
                <SvgIcon iconName="send" iconClass="w-[14px] h-[14px]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message
