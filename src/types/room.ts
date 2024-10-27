import { RoomTypeEnum } from '@/enums'

export type TRoom = {
  id: string
  name: string
  type: RoomTypeEnum
  isPrivate: boolean
  createdAt: string
}

export type TCallInfo = {
  channel: string
  rtcToken: string
}
