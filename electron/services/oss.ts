import Qiniu from './qiniu'

import AppStoreService from './appStore'

import { IOSS, IOssService, OssType, IStore, AppStore } from './interface'

import { configStore } from './config'

class OssService implements IOssService {
  public instance: IOSS | null = null

  public static create(type: OssType, ak: string, sk: string): IOSS {
    switch (type) {
      case OssType.qiniu:
        return new Qiniu(ak, sk)
      /* case OssType.ali:
        return new Ali(ak, sk)
      case OssType.tencent:
        return new Tencent(ak, sk) */
      default:
        throw Error('暂时还不支持该云存储厂商')
    }
  }

  getService(): IOSS {
    if (!this.instance) {
      throw new Error('没有初始化 app')
    }
    return this.instance
  }

  changeContext(type: OssType, ak: string, sk: string) {
    this.instance = OssService.create(type, ak, sk)
  }

  clearContext() {
    this.instance = null
  }
}

class IpcChannelsService {
  // @ts-ignore
  private appStore: IStore<AppStore> = new AppStoreService()

  private oss: IOssService = new OssService()

  getOss = () => this.oss

  async initApp(params: any) {
    let finallyApp: AppStore
    if (params.id) {
      // 传入 id 证明用户选择了 id
      const findApps = await this.appStore.find({ _id: params.id })

      if (findApps.length <= 0) throw new Error('没有可初始化的 app')
      ;[finallyApp] = findApps
    } else {
      // 软件初始化
      const currentAppId = configStore.get('currentAppId')
      if (currentAppId) {
        // 有默认值
        const findApps = await this.appStore.find({ _id: currentAppId })
        if (findApps.length <= 0) throw new Error('没有可初始化的 app')
        ;[finallyApp] = findApps
      } else {
        const findApps = await this.appStore.find({})
        if (findApps.length <= 0) throw new Error('没有可初始化的 app')
        ;[finallyApp] = findApps
      }
    }

    this.oss.changeContext(finallyApp.type, finallyApp.ak, finallyApp.sk)

    return finallyApp
  }

  async addApp(params: any) {
    const { name, ak } = params

    // 1、判断是否已经存在 name
    const appsByName = await this.appStore.find({ name })
    if (appsByName.length > 0) return [] // throw new Error('应用名称已经存在1111')
    // 2、判断是否已经存在 ak
    const appsByAk = await this.appStore.find({ ak })
    if (appsByAk.length > 0) return [] // throw new Error('该 AK 已经存在2222')

    // 通过验证保存数据
    return this.appStore.insert({ ...params })
  }

  async getApps() {
    return this.appStore.find({})
  }

  async getBuckets(params?: { type: OssType; ak: string; sk: string }) {
    if (params && Object.keys(params).length > 0) {
      // 返回当前配置的 bucket 列表
      const { type, ak, sk } = params
      const app = OssService.create(type, ak, sk)

      return app.getBucketList()
    }

    const instance = this.oss.getService()

    return instance.getBucketList()
  }

  async switchBucket(bucketName: string) {
    console.log("switchBucket", bucketName)
    const instance = this.oss.getService()

    await instance.setBucket(bucketName)

    const files = await instance.getBucketFiles()

    const domains = await instance.getBucketDomainList()

    console.log("files", files)
    console.log("domains", domains)

    return { files, domains, type: instance.type }
  }
}

export default IpcChannelsService
