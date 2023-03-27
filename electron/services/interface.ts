import { BrowserWindow, Tray } from 'electron'
// import { Task, VFile } from 'types/common'
declare class VFile {
  name: string
  webkitRelativePath: string
  meta: any
  type: string
  size: number
  lastModified: number
  lastModifiedDate: Date
  shortId: string
}

export enum TaskType {
  download,
  upload,
}

export enum TransferStatus {
  default,
  done,
  failed,
}

export type Task<T> = {
  id: string
  name: string
  size: number
  date: number
  type: TaskType
  progress: number
  localPath?: string
  result: Promise<T>
}

export type TransferStore = {
  id: string
  name: string
  size: number
  date: number
  type: TaskType
  status: TransferStatus
  localPath?: string
}

export interface IApp {
  mainWindow: BrowserWindow | null
  floatWindow: BrowserWindow | null
  alertWindow: BrowserWindow | null
  confirmWindow: BrowserWindow | null
  appTray: Tray | null

  init(): void
}

export interface ITaskRunner {
  addTask<T>(task: Task<T>): void

  setProgress(id: string, progress: number): void
}

export interface IStore<T> {
  find(query: any): Promise<T[]>

  insert(doc: T): Promise<T>

  update(query: any, updateQuery: any, options: any): Promise<void>

  remove(query: any, options: any): Promise<void>
}

export interface ILogger {
  info(...params: any[]): void

  error(...params: any[]): void

  debug(...params: any[]): void

  warn(...params: any[]): void
}

export interface IOSS {
  type: Oss.OssType
  appId: string

  uploadFile(
    id: string,
    remotePath: string,
    localPath: string,
    cb: (id: string, progress: number) => void
  ): Promise<any>

  downloadFile(
    id: string,
    remotePath: string,
    localPath: string,
    cb: (id: string, progress: number) => void
  ): Promise<any>

  deleteFile(remotePath: string): Promise<undefined>

  getBucketList(): Promise<string[]>

  getBucketFiles(): Promise<any[]>

  getBucketDomainList(): Promise<string[]>

  setBucket(bucket: string): Promise<void>

  generateUrl(remotePath: string): string

  itemAdapter(item: any): VFile
}

export interface IOssService {
  getService(): IOSS

  changeContext(type: Oss.OssType, ak: string, sk: string): void

  clearContext(): void
}

export interface IpcResponse {
  code: number
  msg: string
  data: any
}

export type AppStore = {
  type: Oss.OssType
  ak: string
  sk: string
  name: string
  _id?: string
  bucket: string
  uploadBucket: string
  uploadPrefix: string
  defaultDomain: string
}

export type BucketMeta = {
  domains: string[]
  files: VFile[]
  type: Oss.OssType
}
