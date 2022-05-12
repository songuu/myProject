import React, { useCallback, useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import classnames from 'classnames'

import { updateApplycation } from '@root/store/actions'

import { Apps } from './components'

import styles from './index.module.less'

function Library() {
  const [search, setSearch] = useSearchParams()

  const queryCate = String(search.get('category'))

  const [activeCategory, setActiveCategory] = useState<string>(queryCate)

  const enabledPlaylistCategories = useAppSelector(
    state => state.settings.enabledPlaylistCategories
  )

  const applycations = useAppSelector(state => state.application.applycations)

  const dispatch = useAppDispatch()

  const goToCategory = useCallback((category: string) => {
    setActiveCategory(category)
    setSearch({ category })
    dispatch(updateApplycation(category))
  }, [])

  useEffect(() => {
    dispatch(updateApplycation(queryCate))
  }, [queryCate])

  return (
    <div className={styles.content_outer}>
      <h1>应用</h1>
      <div className={styles.btns}>
        {enabledPlaylistCategories.map((category: string) => {
          return (
            <div
              className={classnames(
                styles.btn,
                activeCategory === category ? styles.active : ''
              )}
              key={category}
              onClick={() => goToCategory(category)}
            >
              {category}
            </div>
          )
        })}
      </div>
      <div className={styles['app-list']}>
        <Apps apps={applycations} />
      </div>
    </div>
  )
}

export default Library
