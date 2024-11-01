import { yup } from '@/configs'
import { createGroupSchema } from '@/schema/group'
import { TRoom } from './room'

export type TGroup = {
  id: string
  name: string
  isPrivate: boolean
  createdAt: string
}

export type TGroupDetail = TGroup & {
  rooms: TRoom[]
}

export type TCreateGroupSchema = yup.InferType<typeof createGroupSchema>

export type CreateGroupPayload = TCreateGroupSchema & {
  channelId: string
}
