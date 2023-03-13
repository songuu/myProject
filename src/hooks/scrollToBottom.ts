import { useState, useRef, useEffect, useCallback } from 'react'

function useScrollToBottom() {
  const [shouldScroll, setShouldScroll] = useState<boolean>(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Whenever the component updates, check if we should scroll to the bottom.
  useEffect(() => {
    if (shouldScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
      setShouldScroll(false)
    }
  }, [shouldScroll])

  // Call this function to trigger a scroll to the bottom.
  const scrollToBottom = useCallback(() => {
    setShouldScroll(true)
  }, [])

  return { scrollToBottom, bottomRef }
}

export default useScrollToBottom;