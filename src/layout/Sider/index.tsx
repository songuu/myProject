import React from 'react'

import styles from './index.module.less'

interface IBaseSiderProps {}

const Sider: React.FC<IBaseSiderProps> = () => {
  return <div className={styles.Sider}></div>
}

export default Sider
