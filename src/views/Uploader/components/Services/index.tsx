import React, { useRef, useState } from 'react'

import { debounce, isEqual } from 'lodash'

import classnames from 'classnames'

import { AppStore } from '@mytypes/common'

import styles from './index.module.less'

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
  const [apps, setApps] = useState<any[]>([])
  const [page, setPage] = useState<ServicesPage>(ServicesPage.add)
  // 是否为中正在编辑的状态
  const [isEdit, setIsEdit] = useState<boolean>(false)
  // update form 中的数据是否已经被修改
  const [edited, setEdited] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const forms: any = useRef({
    name: '',
    type: '',
    AK: '',
    SK: '',
  })

  const [inputFocus, setInputFocus] = useState<string>('')

  const _toAddPage = () => {
    setPage(ServicesPage.add)
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

  const submit = async () => {
    /*  if (Object.keys(forms.current).every((item: any) => !forms.current[item])) {
      alert('请完善信息')
      return
    }
 */
    setLoading(true)

    const params = {
      type: OssType.qiniu,
      ak: 'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU', // forms.current.AK,
      sk: 'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y', // forms.current.SK,
    }
    const buckets = await window.Main.getBuckets(params)

    console.log(buckets)

    const app = await window.Main.addApp(
      '321321313', // forms.current.name,
      OssType.qiniu,
      'JVjrJkUHRN7xLwWkJZBbg_CNbB2UBcdcN-td6wrU',
      'AcwhVLTA905CYqI-_-1ScWNBXulOJFYAE82ZL1-y'
    )

    console.log(app)

    const allApps = await window.Main.getApp()

    console.log(allApps)

    // setApps(allApps)
  }

  const renderSwitch = (param: ServicesPage) => {
    switch (param) {
      case ServicesPage.list:
        return apps.length > 0 ? (
          ''
        ) : (
          <section className={styles['apps-main-wrapper']}>
            <span>没有配置app</span>
            <button onClick={_toAddPage}>添加</button>
          </section>
        )
      case ServicesPage.add:
        return (
          <section className={styles['apps-main-wrapper']}>
            <span>新增配置</span>
            <div className={styles['apps-main-wrapper-box']}>
              <div className={styles['apps-main-wrapper-box-row']}>
                <div className={styles['apps-main-wrapper-box-col']}>名称:</div>
                <div className={styles['apps-main-wrapper-box-input']}>
                  <div
                    className={classnames(
                      styles['apps-main-wrapper-box-input-container'],
                      inputFocus === 'name'
                        ? styles['apps-main-wrapper-box-input-active']
                        : ''
                    )}
                  >
                    <div
                      className={
                        styles['apps-main-wrapper-box-input-container-input']
                      }
                    >
                      <input
                        id="name"
                        onFocus={() => {
                          setInputFocus('name')
                        }}
                        onBlur={() => {
                          setInputFocus('')
                        }}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          forms.current.name = e.currentTarget.value
                        }}
                        placeholder="请输入名称"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['apps-main-wrapper-box-row']}>
                <div className={styles['apps-main-wrapper-box-col']}>类型:</div>
                <div className={styles['apps-main-wrapper-box-input']}>
                  <div
                    className={classnames(
                      styles['apps-main-wrapper-box-input-container'],
                      inputFocus === 'type'
                        ? styles['apps-main-wrapper-box-input-active']
                        : ''
                    )}
                  >
                    <div
                      className={
                        styles['apps-main-wrapper-box-input-container-input']
                      }
                    >
                      <input
                        id="type"
                        onFocus={() => {
                          setInputFocus('type')
                        }}
                        onBlur={() => {
                          setInputFocus('')
                        }}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          forms.current.type = e.currentTarget.value
                        }}
                        placeholder="请输入类型"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['apps-main-wrapper-box-row']}>
                <div className={styles['apps-main-wrapper-box-col']}>AK:</div>
                <div className={styles['apps-main-wrapper-box-input']}>
                  <div
                    className={classnames(
                      styles['apps-main-wrapper-box-input-container'],
                      inputFocus === 'AK'
                        ? styles['apps-main-wrapper-box-input-active']
                        : ''
                    )}
                  >
                    <div
                      className={
                        styles['apps-main-wrapper-box-input-container-input']
                      }
                    >
                      <input
                        id="AK"
                        onFocus={() => {
                          setInputFocus('AK')
                        }}
                        onBlur={() => {
                          setInputFocus('')
                        }}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          forms.current.AK = e.currentTarget.value
                        }}
                        placeholder="请输入AK"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['apps-main-wrapper-box-row']}>
                <div className={styles['apps-main-wrapper-box-col']}>SK:</div>
                <div className={styles['apps-main-wrapper-box-input']}>
                  <div
                    className={classnames(
                      styles['apps-main-wrapper-box-input-container'],
                      inputFocus === 'SK'
                        ? styles['apps-main-wrapper-box-input-active']
                        : ''
                    )}
                  >
                    <div
                      className={
                        styles['apps-main-wrapper-box-input-container-input']
                      }
                    >
                      <input
                        id="SK"
                        onFocus={() => {
                          setInputFocus('SK')
                        }}
                        onBlur={() => {
                          setInputFocus('')
                        }}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          forms.current.SK = e.currentTarget.value
                        }}
                        placeholder="请输入SK"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={submit}>确定</button>
          </section>
        )
      default:
        return ''
    }
  }

  return (
    <div className={styles['services-loading']}>
      <section className={styles['services-wrapper']}>
        {renderSwitch(page)}
      </section>
    </div>
  )
}

export default Services
