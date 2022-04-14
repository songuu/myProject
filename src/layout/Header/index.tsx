import React from 'react'

import styles from './index.module.less'

interface IBaseHeaderProps {}

const Header: React.FC<IBaseHeaderProps> = () => {
  return <div className={styles.header}>Header</div>
}

export default Header
