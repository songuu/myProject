import React, { useEffect } from 'react'

import { useAppSelector } from '@root/store/index'

export const useTheme = () => {
  const theme = useAppSelector((state) => state.settings.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  return { theme }
}