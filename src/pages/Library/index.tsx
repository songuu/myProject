import React, { useCallback, useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import classnames from 'classnames'

import { Typography } from '@arco-design/web-react'
const { Title } = Typography

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
    <div className="h-full w-full p-[20px]">
      <Title heading={2}>应用</Title>
      <div className="flex flex-wrap">
        {enabledPlaylistCategories.map((category: string) => {
          return (
            <div
              className={classnames(
                'transition-200 mt-[10px] mb-[6px] mr-[16px] flex cursor-pointer select-none items-center justify-center rounded-[10px] px-[16px] py-[8px]  text-2xl font-semibold hover:bg-[#eaeffd] hover:text-[#335eea]',
                activeCategory === category
                  ? 'bg-[#eaeffd] text-[#335eea]'
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
