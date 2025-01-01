import { UID } from 'agora-rtc-react'

import { yup } from '@/configs'
import { RoomTypeEnum } from '@/enums'
import { createRoomSchema } from '@/schema/room'
import { TMessageUser } from './user'

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
  uid: number
}

export type TRemoteUserInfos = {
  [key: UID]: TMessageUser
}

export type TCreateRoomSchema = yup.InferType<typeof createRoomSchema>

export type CreateRoomPayload = TCreateRoomSchema & {
  groupId?: string
}
