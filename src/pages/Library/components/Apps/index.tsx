import React from 'react'

import styles from './index.module.less'

interface IProps {
  apps: string[]
}

const Apps: React.FC<IProps> = ({ apps }) => {
  return apps.length ? (
    <div className={styles.apps}>
      {apps.map((app: string) => {
        return (
          <div className={styles['apps-item']} key={app}>
            {app}
          </div>
        )
      })}
    </div>
  ) : (
    <div>empty</div>
  )
}

export default Apps
