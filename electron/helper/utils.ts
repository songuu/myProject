import axios from 'axios'

import fs, { Stats } from 'fs'

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
