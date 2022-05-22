enum OssType {
  qiniu,
}

export type AppStore = {
  type: OssType
  ak: string
  sk: string
  name: string
  _id?: string
  bucket: string
  uploadBucket: string
  uploadPrefix: string
  defaultDomain: string
}
