import React, { memo } from 'react'

interface IPageLoadingProps {}

const AppLoading: React.FC<IPageLoadingProps> = () => {
  return <div>页面加载</div>
}

export default memo(AppLoading)
