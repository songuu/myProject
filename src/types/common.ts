import { OssType } from '@constants/enums'

export enum Layout {
  grid,
  table,
}

export type AppStore = {
  type: OssType
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

export class BucketMeta {
  name = ''
  domains: string[] = []
  files: VFile[] = []
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

export const OssTypeMap: Record<string, string> = {
  [OssType.qiniu]: '七牛云',
  [OssType.ali]: '阿里云',
  [OssType.tencent]: '腾讯云',
}
