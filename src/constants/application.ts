export const list = [
  {
    name: '截屏',
    category: ['全部应用', '系统'],
    cover: 'http://qiniu.songuu.top/icon/shortcut.svg',
    local: '@views/Snapshot',
    short: 'snapshot',
    handler: () => window.Main.captureScreen(),
  },
  {
    name: '上传文件',
    category: ['全部应用', '系统'],
    cover: 'http://qiniu.songuu.top/icon/upload.svg',
    local: '@views/Uploader',
    short: 'uploader',
  },
  {
    name: '流水账',
    category: ['全部应用', '生活'],
    cover: 'http://qiniu.songuu.top/icon/account.svg',
    local: '@views/Daybook',
    short: 'daybook',
  },
  {
    name: '书摘',
    category: ['全部应用', '学习', '读书'],
    cover: 'http://qiniu.songuu.top/icon/book.svg',
    local: '@views/Book',
    short: 'book',
  },
]
