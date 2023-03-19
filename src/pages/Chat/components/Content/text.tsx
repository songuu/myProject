import React from 'react'

interface IProps {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
}

const Text: React.FC<IProps> = ({
  inversion = false,
  error = false,
  text = '',
  loading = false,
}) => {
  return (
    <div
      className={`text-black text-wrap min-w-[20px] rounded-md px-3 py-2 ${
        inversion
          ? 'bg-[#d2f9d1] dark:bg-[#a1dc95]'
          : 'bg-[#f4f6f8] dark:bg-[#1e1e20]'
      } ${error && 'text-red-500'}`}
    >
      {loading ? (
        <span className="dark:text-white w-[4px] h-[20px] block animate-blink" />
      ) : (
        <div className="leading-relaxed break-words">
          {inversion ? (
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : (
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Text
