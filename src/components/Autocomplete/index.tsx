import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useMemo,
} from 'react'

type Option = {
  label: string
  value: string
}

type AutocompleteProps = {
  options: Option[]
  onSelect?: (option: Option) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  autoFocus?: boolean
  onChange?: (value: string) => void
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options = [],
  onSelect,
  placeholder = '请输入',
  autoFocus = false,
  onKeyDown,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDropdownUp, setIsDropdownUp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (inputRef.current && dropdownRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect()
      const dropdownRect = dropdownRef.current.getBoundingClientRect()
      setIsDropdownUp(dropdownRect.height < inputRect.top)
    }
  }, [isDropdownOpen])

  const filteredOptions = useMemo(() => {
    if (options.length > 0 && inputValue.length > 0) {
      setIsDropdownOpen(true)
    } else {
      setIsDropdownOpen(false)
    }
    return options
  }, [options, inputValue])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    setSelectedOption(null)
    // setIsDropdownOpen(event.target.value !== '' && options.length > 0)
  }

  const handleOptionClick = (option: Option) => {
    setInputValue(option.value)
    setIsDropdownOpen(false)
    setSelectedOption(option)
    onSelect?.(option)
  }

  const handleDropdownToggle = () => {
    if (!isDropdownOpen && inputValue.length > 0) {
      setIsDropdownOpen(true)
    }
  }

  const handleInputFocus = () => {
    if (inputValue === '') {
      setIsDropdownOpen(false)
    }
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    /* if (event.key === 'ArrowDown' && filteredOptions.length > 0) {
      event.preventDefault()
      setSelectedOption(filteredOptions[0])
    } else if (
      event.key === 'ArrowUp' &&
      filteredOptions.length > 0 &&
      selectedOption === filteredOptions[0]
    ) {
      event.preventDefault()
      setSelectedOption(null)
    } else if (event.key === 'Enter' && selectedOption) {
      event.preventDefault()
      setInputValue('')
      setIsDropdownOpen(false)
      onSelect?.(selectedOption)
      onKeyDown?.(event)
    } */
    if (event.key === 'Enter') {
      event.preventDefault()
      setInputValue('')
      setIsDropdownOpen(false)
      onKeyDown?.(event)
    }
  }

  useEffect(() => {
    onChange?.(inputValue)
  }, [inputValue])

  console.log('render', filteredOptions)

  return (
    <div className="relative w-64">
      <input
        ref={inputRef}
        type="text"
        className={`w-full py-[6px] pr-4 pl-4 leading-5 rounded-lg border ${
          selectedOption ? 'border-blue-500' : 'border-gray-300'
        } bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-500`}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onClick={handleDropdownToggle}
        onFocus={handleInputFocus}
        autoFocus={autoFocus}
      />
      {isDropdownOpen && (
        <div
          className={`absolute left-0 ${
            isDropdownUp ? 'bottom-full' : 'top-full'
          } w-full bg-white rounded-lg border border-gray-300 shadow-lg z-10`}
          ref={dropdownRef}
        >
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map(option => (
                <li
                  key={option.value}
                  className={`px-4 py-2 text-gray-900 cursor-pointer ${
                    selectedOption === option
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2 text-gray-500">没有资源</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Autocomplete
