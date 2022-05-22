import storage from 'electron-store'

export default {
  get: (key: string) => {
    return new Promise((resolve, reject) => {
      storage.get(key, (err: Error, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },

  set: (key: string, data: any) => {
    return new Promise((resolve, reject) => {
      storage.set(key, data, (err: Error) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },

  remove: (key: string) => {
    return new Promise<void>((resolve, reject) => {
      storage.remove(key, (err: Error) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
}
