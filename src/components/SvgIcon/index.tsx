import React, { useMemo } from 'react';

import styles from './index.module.less'

interface Iprops {
  iconClass?: string,
  iconName: string,
}

const SvgIcon: React.FC<Iprops> = ({ iconName, iconClass }) => {
  const myIconName = useMemo(() => {
    return `#icon-${iconClass}`
  }, [iconClass])

  return (
    <svg className={styles['svg-icon']} aria-hidden="true">
      <use xlinkHref={iconName} />
    </svg>
  );
}

export default SvgIcon;
