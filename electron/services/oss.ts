import Qiniu from './qiniu'

import { IOSS, IOssService, OssType, IStore, AppStore } from './interface'

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

/* class AppStores implements IStore<any> {
  find(query: any): Promise<any[]> {}

  insert(doc: T): Promise<T>

  update(query: any, updateQuery: any, options: any): Promise<void>

  remove(query: any, options: any): Promise<void>
} */

class IpcChannelsService {
  // @ts-ignore
  private appStore: IStore<AppStore>

  private oss: IOssService = new OssService()

  async initApp(params: any) {
    const { type, ak, sk } = params
    this.oss.changeContext(type, ak, sk)
  }

  async addApp(params: any) {
    const { name, ak } = params

    if (this.appStore) {
      // 1、判断是否已经存在 name
      const appsByName = await this.appStore.find({ name })
      if (appsByName.length > 0) throw new Error('应用名称已经存在')
      // 2、判断是否已经存在 ak
      const appsByAk = await this.appStore.find({ ak })
      if (appsByAk.length > 0) throw new Error('该 AK 已经存在')
    }

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
  }

  async switchBucket(bucketName: string) {
    const instance = this.oss.getService()

    await instance.setBucket(bucketName)

    const files = await instance.getBucketFiles()

    const domains = await instance.getBucketDomainList()

    return { files, domains, type: instance.type }
  }
}

export default IpcChannelsService
