import { createContext } from 'react'

export interface LayoutProps {
  drawerVisible: boolean
  drawerVisibleControll: (visible: boolean) => void
}

export const LayoutContext = createContext({} as LayoutProps)
