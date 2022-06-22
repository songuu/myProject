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
