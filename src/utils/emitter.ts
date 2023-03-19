import mitt, { Emitter } from 'mitt'

type Events = {
  regenerate: any
  delete: any
}

export const emitter: Emitter<Events> = mitt<Events>()
