import { yup } from '@/configs'
import { RoomTypeEnum } from '@/enums'
import { createRoomSchema } from '@/schema/room'

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

export type TRemoteUserInfo = {
  uid: string | number
  id: string
  fullName: string
  avatarUrl: string
}

export type GetCallInfoPayload = {
  roomId: string
  channelName: string
  socketId: string
}

export type TCreateRoomSchema = yup.InferType<typeof createRoomSchema>

export type CreateRoomPayload = TCreateRoomSchema & {
  groupId?: string
}
