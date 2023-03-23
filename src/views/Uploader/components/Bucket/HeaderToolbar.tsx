import React from 'react'

import { Breadcrumbs } from 'baseui/breadcrumbs'

import { StyledLink } from 'baseui/link'

import { Layout } from '@mytypes/common'

import { SvgIcon, ButtonIcon, Breadcrumb } from '@components/index'

interface PropTypes {
  backspace: () => void
  onChangeLayout: () => void
  layout: Layout
  navigators: string[]
  onSearchChange: (value: string) => void
  onRefreshBucket: () => void
}

const IconCss = 'w-[24px] h-[24px] mr-[4px] ml-[8px] text-gray-500 dark:text-gray-200'

const HeaderToolbar: React.FC<PropTypes> = ({
  onRefreshBucket,
  navigators,
  backspace,
}) => {
  const myNavigators = () => {
    return ['首页'].concat(navigators)
  }

  return (
    <div className="flex items-center flex-row justify-between text-white box-border px-[12px] py-[8px] border-b-[1px] border-b-[#fafafa] border-b-solid">
      <div className="flex items-center">
        <ButtonIcon onclick={backspace}>
          <SvgIcon iconName="arrow-left" iconClass={IconCss} />
        </ButtonIcon>
        <ButtonIcon onclick={onRefreshBucket}>
          <SvgIcon iconName="reload" iconClass={IconCss} />
        </ButtonIcon>

        <Breadcrumbs>
          {myNavigators().map(item => {
            return item // <StyledLink href={`#/${item}`}>{item}</StyledLink>
          })}
        </Breadcrumbs>
        {/* <Breadcrumb separator=">">
          {myNavigators().map((item, index) => {
            return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
          })}
        </Breadcrumb> */}
        {/* <div className={styles.breadcrumb}>
          {myNavigators().map((item, index) => {
            return (
              <div className={styles['breadcrumb_item']} key={item}>
                <span className={styles['breadcrumb_item_a']}>{item}</span>
                {index !== myNavigators().length - 1 &&
                  myNavigators().length !== 1 && (
                    <span className={styles['breadcrumb_item_block']}>
                      {'>'}
                    </span>
                  )}
              </div>
            )
          })}
        </div> */}
      </div>
      <div>搜索</div>
    </div>
  )
}

export default HeaderToolbar
