export enum UploaderPage {
  bucket,
  transferList,
  transferDone,
  setting,
  services,
}

export enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
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
