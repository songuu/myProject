import React, { useCallback, useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import classnames from 'classnames'

import { HeadingMedium } from 'baseui/typography'

import { useAppSelector, useAppDispatch } from '@root/store/index'

import { updateApplycation } from '@root/store/actions'

import { Apps } from './components'

function Library() {
  const [search, setSearch] = useSearchParams()

  const queryCate = String(search.get('category'))

  const [activeCategory, setActiveCategory] = useState<string>(queryCate)

  const enabledPlaylistCategories = useAppSelector(
    state => state.settings.enabledPlaylistCategories
  )

  const applycations = useAppSelector(
    state => state.application.applycations
  ) as any

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
    <div className="w-full h-full p-[20px]">
      <HeadingMedium>应用</HeadingMedium>
      <div className="flex flex-wrap">
        {enabledPlaylistCategories.map((category: string) => {
          return (
            <div
              className={classnames(
                'select-none cursor-pointer px-[16px] py-[8px] mt-[10px] mb-[6px] mr-[16px] flex items-center justify-center font-semibold rounded-[10px]  text-2xl transition-200 hover:bg-[#eaeffd] hover:text-[#335eea]',
                activeCategory === category
                  ? 'text-[#335eea] bg-[#eaeffd]'
                  : 'bg-[#f5f5f7] text-[#7a7a7b]'
              )}
              key={category}
              onClick={() => goToCategory(category)}
            >
              {category}
            </div>
          )
        })}
      </div>
      <div className="mt-[24px]">
        <Apps apps={applycations} />
      </div>
    </div>
  )
}

export default Library
