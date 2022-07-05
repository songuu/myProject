import React, { useCallback } from 'react'
import classnames from 'classnames'
import { isFunction, isObject } from '@utils/is'
import styles from './index.module.less'
import SvgIcon from '../SvgIcon'

const getBackground = (color: string | any, percent?: number) => {
  if (isObject(color)) {
    const val = Object.keys(color)
      .map((key: any) => `${color[key]} ${key}`)
      .join(',')
    const sizeProps = percent
      ? { backgroundSize: `${(100 * 100) / percent}%` }
      : {}
    return {
      backgroundImage: `linear-gradient(to right, ${val})`,
      ...sizeProps,
    }
  }
  return {
    backgroundColor: color,
  }
}

const defaultStrokeWidth: any = {
  small: 3,
  default: 4,
  large: 8,
}

function LineProgress(props: any) {
  const {
    // textInside,
    type = 'line',
    size = '',
    prefixCls,
    buffer,
    percent,
    status,
    color,
    animation,
    showText,
    bufferColor,
    formatText,
    trailColor,
  } = props

  const strokeWidth = props.strokeWidth || defaultStrokeWidth[size]
  const cls = `${prefixCls}-${type}`
  const height = strokeWidth
  const isFinish = status === 'success' || status === 'error' || percent >= 100

  const getText = useCallback(() => {
    if (isFunction(formatText)) {
      return formatText(percent)
    }
    switch (status) {
      case 'error':
        return (
          <span>
            {percent}%
            <SvgIcon iconName="error-mini" iconClass={classnames(styles[`${cls}-text-icon`])} />
          </span>
        )
      default:
        return `${percent}%`
    }
  }, [formatText, percent, status])

  return (
    <div className={styles[`${cls}-wrapper`]}>
      <div
        className={styles[`${cls}-outer`]}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        style={{ height, backgroundColor: trailColor }}
      >
        {buffer && !isFinish && (
          <div
            className={styles[`${cls}-inner-buffer`]}
            style={{
              width: `${percent > 0 ? percent + 10 : 0}%`,
              ...getBackground(bufferColor),
            }}
          />
        )}
        <div
          className={classnames(styles[`${cls}-inner`], {
            [styles[`${cls}-inner-animate`]]: animation,
          })}
          style={{
            width: `${percent}%`,
            ...getBackground(color, percent),
          }}
        />
      </div>
      {showText && (
        <div
          className={classnames(styles[`${cls}-text`], {
            [styles[`${cls}-text-with-icon`]]: status,
          })}
        >
          {getText()}
        </div>
      )}
    </div>
  )
}

LineProgress.defaultProps = {
  showText: true,
  size: 'default',
  status: 'normal',
}

export default LineProgress
