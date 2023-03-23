import React, { useState, useEffect } from 'react'

import classnames from 'classnames'

import { HeadingXSmall } from 'baseui/typography'

import { AppStore } from '@mytypes/common'

import { SvgIcon, Empty, Message, Button } from '@components/index'

import { hiddenTextFilter } from '@libs/utils'

import AddForm from './add-form'

import ActiveBucket from './active-bucket'

import BucketList from './bucket-list'

import styles from './index.module.less'

enum OssType {
  qiniu,
}

const OssTypeMap: any = {
  [OssType.qiniu]: '七牛云',
}

enum ServicesPage {
  list,
  add,
}

interface IProps {
  onAppSwitch: (item: AppStore) => void
  activeApp?: AppStore
}

const appsMainWrapperCss =
  'w-full h-full flex overflow-hidden relative pb-[18px]'

const Services: React.FC<IProps> = ({ activeApp, onAppSwitch }) => {
  const [apps, setApps] = useState<AppStore[]>([])
  const [page, setPage] = useState<ServicesPage>(ServicesPage.list)
  // 是否为中正在编辑的状态
  const [loading, setLoading] = useState<boolean>(false)

  const _toAddPage = () => {
    setPage(ServicesPage.add)
  }
  const _toListPage = () => {
    setPage(ServicesPage.list)
  }

  // 删除
  const onBucketDelete = async (app: AppStore) => {
    try {
      /* await window.Main.showConfirm({
        title: '删除',
        message: '确定要删除该应用吗？',
      }) */

      setLoading(true)

      const id = app._id
      await window.Main.deleteApp(String(id))

      const allApps: any = await window.Main.getApp()

      setApps(allApps)

      onAppSwitch(allApps[0])
    } catch (error: any) {
      Message.error(error.message)
    }
  }

  // 切换应用
  const switchApp = async (id?: string) => {
    try {
      if (activeApp && activeApp._id === id) {
        return
      }

      const selected = apps.find(item => item._id === id)

      if (selected) {
        onAppSwitch(selected)
      }

      await window.Main.changeSetting('currentAppId', id)
    } catch (err) {}
  }

  // 初始化应用
  const initState = async () => {
    const allApps: any = await window.Main.getApp()

    setApps(allApps)
  }

  useEffect(() => {
    initState().then(r => r)
  }, [])

  const renderIcon = (type: OssType) => {
    switch (type) {
      case OssType.qiniu:
        return <SvgIcon iconName="qiniu" iconClass={styles['svg-icon']} />

      default:
        return null
    }
  }

  const submit = async () => {
    /*  if (Object.keys(forms.current).every((item: any) => !forms.current[item])) {
      alert('请完善信息')
      return
    }
 */
    try {
      setLoading(true)

      const params = {
        type: OssType.qiniu,
        ak: 'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU', // forms.current.AK,
        sk: 'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y', // forms.current.SK,
      }
      const buckets = await window.Main.getBuckets(params)

      const app = await window.Main.addApp(
        'oversea1234', // forms.current.name,
        OssType.qiniu,
        'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU',
        'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y'
      )

      const allApps = await window.Main.getApp()

      setApps(allApps)

      // const addedApp = [allApps].find(i => i.sk === sk)

      onAppSwitch(allApps)

      setPage(ServicesPage.list)
    } catch (error: any) {
    } finally {
      setLoading(false)
    }
  }

  const renderSwitch = (param: ServicesPage) => {
    switch (param) {
      case ServicesPage.list:
        return apps.length > 0 ? (
          <section className={appsMainWrapperCss}>
            <div className={styles['apps-main-wrapper-left']}>
              <div className={styles['apps-main-wrapper-header']}>
                <Button onClick={_toAddPage}>添加</Button>
              </div>
              <BucketList
                apps={apps}
                activeApp={activeApp}
                switchApp={switchApp}
              />
            </div>
            {activeApp && (
              <ActiveBucket
                activeApp={activeApp}
                onBucketDelete={onBucketDelete}
              />
            )}
          </section>
        ) : (
          <section className={appsMainWrapperCss}>
            <Empty title="没有 Apps" description="暂时没有搜索到 apps">
              <Button onClick={_toAddPage}>添加</Button>
            </Empty>
          </section>
        )
      case ServicesPage.add:
        return (
          <section className={appsMainWrapperCss}>
            <div className="absolute top-[20px] left-[20px]">
              <Button onClick={_toListPage}>返回</Button>
            </div>
            <div className="w-full h-full flex items-center flex-col justify-center overflow-hidden">
              <HeadingXSmall>新增配置</HeadingXSmall>
              <AddForm />
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return <section className="w-full h-full">{renderSwitch(page)}</section>
}

export default Services
