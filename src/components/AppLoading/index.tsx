import React, { memo } from 'react'

import styles from './index.module.less'

interface IAppLoadingProps {}

const AppLoading: React.FC<IAppLoadingProps> = () => {
  return (
    <div className={styles.loading}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export default memo(AppLoading)
