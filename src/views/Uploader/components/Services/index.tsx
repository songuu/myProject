import React, { useRef, useState, useEffect } from 'react'

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
  const [apps, setApps] = useState<AppStore[]>([])
  const [page, setPage] = useState<ServicesPage>(ServicesPage.list)
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
    const allApps = await window.Main.getApp()

    setApps(allApps)
  }

  useEffect(() => {
    initState().then(r => r)
  }, [])

  const onBucketCancel = () => {
    setIsEdit(false)
    setEdited(false)
  }

  const renderIcon = (type: OssType) => {
    switch (type) {
      case OssType.qiniu:
        return <i className={classnames('iconfont', 'icon-qiniu')} />
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
          <section className={styles['apps-main-wrapper']}>
            <div className={styles['apps-main-wrapper-left']}>
              <div className={styles['apps-main-wrapper-header']}>
                <button onClick={_toAddPage}>添加</button>
              </div>
              <ul className={styles['apps-main-apps']}>
                {apps.map((item: AppStore) => {
                  return (
                    <li
                      className={classnames(
                        styles['apps-main-apps-item'],
                        item._id === activeApp?._id && styles.active
                      )}
                      key={item._id}
                      onClick={() => {
                        switchApp(item._id)
                      }}
                    >
                      <div className={styles['apps-main-apps-item-icon']}>
                        {renderIcon(item.type)}
                      </div>
                      <div className={styles['apps-main-apps-item-name']}>
                        {item.name}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className={styles['apps-main-wrapper-right']}></div>
          </section>
        ) : (
          <section className={styles['apps-main-wrapper']}>
            <div className={styles['apps-main-empty']}>
              <span>没有配置app</span>
              <button onClick={_toAddPage}>添加</button>
            </div>
          </section>
        )
      case ServicesPage.add:
        return (
          <section className={styles['apps-main-wrapper']}>
            <div className={styles['apps-main-wrapper-form']}>
              <span>新增配置</span>
              <div className={styles['apps-main-wrapper-box']}>
                <div className={styles['apps-main-wrapper-box-row']}>
                  <div className={styles['apps-main-wrapper-box-col']}>
                    名称:
                  </div>
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
                  <div className={styles['apps-main-wrapper-box-col']}>
                    类型:
                  </div>
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
            </div>
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
