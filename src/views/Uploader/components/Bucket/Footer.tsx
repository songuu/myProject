import React from 'react'
import styles from './index.module.less'

type PropTypes = {
  totalItem: number
  selectedItem: number
  domains: string[]
}

const Footer = ({ totalItem, selectedItem, domains }: PropTypes) => {
  return (
    <div className={styles.footer}>
      <div className={styles['footer-left']}>
        <span
          className={styles['current-select']}
        >{`选中${selectedItem}项`}</span>
        <span className={styles['current-total']}>{`/总共${totalItem}项`}</span>
      </div>
      <span>{domains.length > 0 ? domains[0] : '没有绑定域名'}</span>
    </div>
  )
}

export default Footer
