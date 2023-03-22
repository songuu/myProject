import React from 'react'

import styles from './index.module.less'

interface IProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

const Check: React.FC<IProps> = ({ checked, onChange }) => {
  const handleToggle = () => {
    onChange && onChange(!checked)
  }
  return (
    <div className={styles.toggle}>
      <input
        checked={checked}
        id="enable-enable-global-shortcut"
        type="checkbox"
        name="enable-enable-global-shortcut"
        onChange={handleToggle}
      />
      <label htmlFor="enable-enable-global-shortcut"></label>
    </div>
  )
}

export default Check
