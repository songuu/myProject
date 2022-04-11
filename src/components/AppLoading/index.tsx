import React, { memo } from 'react'

interface IAppLoadingProps {}

const AppLoading: React.FC<IAppLoadingProps> = () => {
  return <div>项目加载</div>
}

export default memo(AppLoading)
