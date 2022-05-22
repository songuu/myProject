import React, { useState } from 'react'

import { debounce, isEqual } from 'lodash'

import { AppStore } from '@mytypes/common'

import { Direction } from '@constants/enums'

enum OssType {
  qiniu,
}

const OssTypeMap = {
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

const Services: React.FC<IProps> = ({ activeApp, onAppSwitch }) => {
  const [apps, setApps] = useState<AppStore[]>([])
  const [page, setPage] = useState<ServicesPage>(ServicesPage.list)
  const [direction, setDirection] = useState<Direction>(Direction.left)
  // 是否为中正在编辑的状态
  const [isEdit, setIsEdit] = useState<boolean>(false)
  // update form 中的数据是否已经被修改
  const [edited, setEdited] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const _toAddPage = () => {
    setPage(ServicesPage.add)
    setDirection(Direction.right)
  }
  const _toListPage = () => {
    setPage(ServicesPage.list)
    setDirection(Direction.left)
  }

  const onFormChange = debounce((values: any, app: any) => {
    const isEq = isEqual(values, app)
    setEdited(!isEq)
  }, 200)

  // 更新
  const onBucketUpdate = async (store: AppStore) => {}

  // 删除
  const onBucketDelete = async (app: AppStore) => {}

  // 添加
  const onBucketAdd = async (values: AddForm) => {}

  // 切换应用
  const switchApp = async (id: string) => {}

  // 初始化应用
  const initState = async () => {}

  const onBucketCancel = () => {
    setIsEdit(false)
    setEdited(false)
  }

  const renderIcon = (type: OssType) => {}

  const renderSwitch = (param: ServicesPage) => {}

  return <div>Services</div>
}

export default Services
