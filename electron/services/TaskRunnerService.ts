import {
  ITaskRunner,
  Task,
  IStore,
  TransferStore,
  TransferStatus,
  TaskType,
} from './interface'

import { emitter } from '../helper/utils'

import TransferStoreService from './TransferStoreService'

export default class TaskRunnerService implements ITaskRunner {
  private queue: Task<any>[] = []

  private active: Task<any>[] = []

  private limit = 5

  private debug = true

  private timeLimiter: number = Date.now()

  // @ts-ignore
  private transfers: IStore<TransferStore> = new TransferStoreService()

  public async addTask<T>(task: Task<T>) {
    await this.transfers.insert({
      id: task.id,
      name: task.name,
      size: task.size,
      date: task.date,
      type: task.type,
      status: TransferStatus.default,
    })

    this.queue.push(task)
    this.runTask()
  }

  public setProgress(id: string, progress: number) {
    const task = this.active.find(t => t.id === id)
    if (task) {
      task.progress = progress
    }

    const nowTime = new Date().getTime()

    if (nowTime > this.timeLimiter + 500) {
      const progressList = this.active.map(t => ({
        id: t.id,
        progress: t.progress,
      }))
      emitter.emit('transfer-process', progressList)
      this.timeLimiter = nowTime
    }
  }

  private async execute<T>(task: Task<T>) {
    try {
      this.log(`running ${task.id}`)

      await task.result
      this.log(`task ${task.id} finished`)

      await this.transfers.update(
        {
          id: task.id,
        },
        {
          $set: {
            status: TransferStatus.done,
          },
        },
        {}
      )

      emitter.emit('transfer-done', task.id)
    } catch (e) {
      this.log(`${task.id} failed`)

      // 传输失败
      await this.transfers.update(
        { id: task.id },
        { $set: { status: TransferStatus.failed } },
        {}
      )

      emitter.emit('transfer-failed', task.id)
    } finally {
      // 处理当前正在活动的任务
      const doneId = this.active.findIndex(i => i.id === task.id)
      this.active.splice(doneId, 1)
      // 处理完成的任务
      this.runTask()

      // 传输完成
      if (this.queue.length === 0 && this.active.length === 0) {
        // fixme: 上传完成刷新 bucket
        emitter.emit('transfer-finish')
      }
      // 上传完成
      if (
        // 下载队列中没有上传的项目
        this.queue.every(i => i.type !== TaskType.upload) &&
        // 正在下载的队列中没有上传的项目
        this.active.every(i => i.type !== TaskType.upload)
      ) {
        emitter.emit('upload-finish')
      }
    }
  }

  private runTask() {
    while (this.active.length < this.limit && this.queue.length > 0) {
      const task = this.queue.shift()

      if (task) {
        this.active.push(task)
        this.execute(task)
      }
    }
  }

  private log(msg: string) {
    if (this.debug) {
      console.log(msg)
    }
  }
}
