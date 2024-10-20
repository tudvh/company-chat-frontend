import { TRoom } from './room'

export type TGroup = {
  id: string
  name: string
  createdAt: string
}

export type TGroupDetail = TGroup & {
  rooms: TRoom[]
}
