import Qiniu from './qiniu'

import { IOSS, IOssService, OssType } from './interface'

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

const getBuckets = async (params?: {
  type: OssType
  ak: string
  sk: string
}) => {
  if (params && Object.keys(params).length > 0) {
    // 返回当前配置的 bucket 列表
    const { type, ak, sk } = params
    const app = OssService.create(type, ak, sk)

    console.log("app", app)

    return app.getBucketList()
  }
}

const switchBucket = async (bucketName: string) => { 
  // const instance = oss.getService()
}

export { getBuckets, switchBucket }
