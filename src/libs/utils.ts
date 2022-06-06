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
