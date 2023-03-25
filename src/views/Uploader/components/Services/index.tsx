import React, { useState, useEffect } from 'react'

import { HeadingXSmall } from 'baseui/typography'

import { AppStore } from '@mytypes/common'

import { Empty, Message, Button } from '@components/index'

import AddForm from './add-form'

import ActiveBucket from './active-bucket'

import BucketList from './bucket-list'

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

  const _toAddPage = () => {
    setPage(ServicesPage.add)
  }
  const _toListPage = () => {
    setPage(ServicesPage.list)
  }

  // 删除
  const onBucketDelete = async (app: AppStore) => {
    try {
      const id = app._id
      await window.Main.deleteApp(String(id))

      const allApps: any = await window.Main.getApps()

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

  const handelClear = async () => {
    try {
      await window.Main.clearApps()

      const allApps: any = await window.Main.getApps()

      setApps(allApps)

      onAppSwitch(allApps[0])
    } catch (error: any) {
      Message.error(error.message)
    }
  }

  // 初始化应用
  const initState = async () => {
    const allApps: any = await window.Main.getApps()

    setApps(allApps)
  }

  const handleAddSuccess = async () => {
    const allApps: any = await window.Main.getApps()

    setApps(allApps)

    onAppSwitch(allApps[0])

    setPage(ServicesPage.list)
  }

  useEffect(() => {
    initState().then(r => r)
  }, [])

  const renderSwitch = (param: ServicesPage) => {
    switch (param) {
      case ServicesPage.list:
        return apps.length > 0 ? (
          <section className={appsMainWrapperCss}>
            <div className="w-[180px] flex-col px-[18x] h-full">
              <>
                <Button type="primary" onClick={_toAddPage}>
                  添加
                </Button>
                <Button status="danger" onClick={handelClear}>
                  清空
                </Button>
              </>

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
              <AddForm onSuccess={handleAddSuccess} />
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
