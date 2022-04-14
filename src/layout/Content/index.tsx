import React from 'react'

import styles from './index.module.less'

interface IBaseContentProps {}

const Content: React.FC<IBaseContentProps> = () => {
  return <div className={styles['content_outer']}>
    <div className={styles['content_inner']}>
      <div className={styles['content_inner_box']}></div>
    </div>
  </div>
}

export default Content
