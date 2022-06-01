enum OssType {
  qiniu,
}

export enum Layout {
  grid,
  table,
}

export type AppStore = {
  type: number // OssType
  ak: string
  sk: string
  name: string
  _id?: string
  bucket?: string
  uploadBucket?: string
  uploadPrefix?: string
  defaultDomain?: string
}

declare class VFile {
  name: string
  webkitRelativePath: string
  meta: any
  type: string
  size: number
  lastModified: number
  lastModifiedDate: Date
  shortId: string
}

export type BucketMeta = {
  name: string
  domains: string[]
  files: VFile[]
}

export interface BucketItem {
  name: string
  webkitRelativePath: string
  meta: any
  type: string
  size: number
  lastModified: number
  lastModifiedDate: Date
}
