import dayjs from 'dayjs'

import mime from 'mime'

const mapType: Record<string, string> = {
  'text/css': 'css',
  'application/javascript': 'js',
  'application/pdf': 'pdf',
  'text/plain': 'doc',
  'image/gif': 'gif',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'application/octet-stream': 'exe',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'txt',
  'video/mp4': 'mp4',
}

export function supportedImage(mimeType: string) {
  // 参见 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes
  const supportList = [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/x-icon',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
  ]
  return supportList.indexOf(mimeType.toLowerCase()) > 0
}

export function fileSizeFormatter(value = 0): string {
  if (!value) return '0 Bytes'
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const index = Math.floor(Math.log(value) / Math.log(1024))
  const size = value / 1024 ** index
  const sizeString = size.toFixed(2) // 保留的小数位数
  return sizeString + unitArr[index]
}

export function dateFormatter(dateVal = 0) {
  return dayjs(dateVal).format('YYYY年MM月DD日 HH:mm:ss')
}

export function getIconName(filename: string): string {
  let iconName: string
  if (filename === 'folder') {
    iconName = 'icon-folder'
  } else {
    const mimeType = mime.getType(filename)
    if (mimeType) {
      iconName = `icon-${mapType[mimeType]}`
    } else {
      iconName = 'icon-doc'
    }
  }
  if (!iconName) iconName = 'icon-doc'

  return iconName
}

export function hiddenTextFilter(text: string) {
  return text.replace(/./g, '*')
}
