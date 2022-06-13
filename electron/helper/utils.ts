import axios from 'axios'

import klawSync from 'klaw-sync'

import fs, { Stats } from 'fs'

import EventEmitter from 'events'

export async function download(
  url: string,
  localPath: string,
  cb: (p: number) => void
) {
  const { data, headers } = await axios.get(url, {
    responseType: 'stream',
    headers: { 'Cache-Control': 'no-cache' },
  })
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(localPath)
    data.pipe(writer)
    let length = 0
    const totalLength = Number(headers['content-length'])
    data.on('data', (thunk: any) => {
      length += thunk.length
      const process = Math.ceil((length / totalLength) * 100)
      cb(process)
    })
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

export function pathStatsSync(path: string): Stats {
  return fs.statSync(path)
}

export function fattenFileList(fileList: string[]): string[] {
  return fileList.reduce((prev: string[], cur: string) => {
    const stats = pathStatsSync(cur)
    if (stats.isFile()) return [...prev, cur]
    if (stats.isDirectory()) {
      const paths = klawSync(cur, {
        nodir: true,
        filter(f) {
          return !/\.(DS_Store)$/.test(f.path)
        },
      }).map(i => i.path)
      return [...prev, ...paths]
    }
    return prev
  }, [])
}

class MyEmitter extends EventEmitter {}

export const emitter = new MyEmitter()
