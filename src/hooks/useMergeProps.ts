import { useMemo } from 'react'
// delete keys from object
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: Array<K | string> // string 为了某些没有声明的属性被omit
): Omit<T, K> {
  const clone = {
    ...obj,
  }
  keys.forEach(key => {
    if ((key as K) in clone) {
      delete clone[key as K]
    }
  })
  return clone
}

export type MergePropsOptions = {
  _ignorePropsFromGlobal?: boolean
}

export default function useMergeProps<PropsType>(
  componentProps: PropsType & MergePropsOptions,
  defaultProps: Partial<PropsType>,
  globalComponentConfig?: Partial<PropsType>
): PropsType {
  const { _ignorePropsFromGlobal } = componentProps
  const _defaultProps = useMemo(() => {
    return {
      ...defaultProps,
      ...(_ignorePropsFromGlobal ? {} : globalComponentConfig),
    }
  }, [defaultProps, globalComponentConfig, _ignorePropsFromGlobal])

  const props = useMemo(() => {
    // Must remove property of MergePropsOptions before passing it to component
    const mProps = omit(componentProps, ['_ignorePropsFromGlobal']) as PropsType

    // https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react/src/ReactElement.js#L312
    for (const propName in _defaultProps) {
      if (mProps[propName] === undefined) {
        // @ts-ignore
        mProps[propName] = _defaultProps[propName]
      }
    }

    return mProps
  }, [componentProps, _defaultProps])

  return props
}
