import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { SvgIcon } from '@components/index'

import styles from './index.module.less'

type applyType = {
  name: string
  category: string[]
  cover: string
  local: string
  short: string
}
interface IProps {
  apps: applyType[]
}

const Apps: React.FC<IProps> = ({ apps }) => {
  const navigate = useNavigate()

  const [focusName, setFocusName] = useState<string>('')
  const handleOver = (name: string) => {
    setFocusName(name)
  }

  const handleLeave = () => {
    setFocusName('')
  }

  return apps.length ? (
    <div className={styles.apps}>
      {apps.map((app: applyType) => {
        return (
          <div className={styles['app-item']} key={app.name}>
            <div
              className={styles['app-item-container']}
              onMouseOver={() => handleOver(app.name)}
              onMouseLeave={handleLeave}
            >
              <img src={app.cover} alt={app.name} />
              {focusName === app.name && (
                <div className={styles.shade}>
                  <button className={styles['shade-play']} title="执行">
                    <SvgIcon iconName="play" iconClass={styles['svg-icon']} />
                  </button>
                </div>
              )}
            </div>
            <div
              className={styles['app-item-title']}
              onClick={() => navigate(app.short)}
            >
              {app.name}
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    <div></div>
  )
}

export default Apps
