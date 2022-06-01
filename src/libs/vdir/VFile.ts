import { BucketItem } from '@root/types/common'

export default class VFile {
  name: string

  webkitRelativePath: string

  meta: any

  type: string

  size = 0

  lastModified = 0

  lastModifiedDate = new Date()

  shortId = new Date().getTime()

  constructor({
    name,
    webkitRelativePath,
    meta,
    type,
    size,
    lastModified,
    lastModifiedDate,
  }: BucketItem) {
    this.name = name
    this.type = type
    this.size = size
    this.lastModified = lastModified
    this.lastModifiedDate = lastModifiedDate
    this.webkitRelativePath = webkitRelativePath
    this.meta = meta
  }
}
