export const list = [
  {
    name: '截屏',
    category: ['全部应用', '系统'],
    cover: "icon-shortcut",
    local: '@views/Snapshot',
    short: 'snapshot',
    handler: () => window.Main.captureScreen(),
  },
  {
    name: '上传文件',
    category: ['全部应用', '系统'],
    cover: "icon-upload1",
    local: '@views/Uploader',
    short: 'uploader',
  },
  {
    name: '流水账',
    category: ['全部应用', '生活'],
    cover: 'icon-liushui',
    local: '@views/Daybook',
    short: 'daybook',
  },
  {
    name: '书摘',
    category: ['全部应用', '学习', '读书'],
    cover: "icon-book",
    local: '@views/Book',
    short: 'book',
  },
]
