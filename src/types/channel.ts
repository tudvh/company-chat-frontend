import { yup } from '@/configs'
import { createChannelSchema } from '@/schema'
import { TGroup } from './group'

export type TChannel = {
  id: string
  name: string
  description: string
  thumbnailUrl: string
  createdAt: string
}

export type TChannelDetail = TChannel & {
  groups: TGroup[]
}

export type TCreateChannelSchema = yup.InferType<typeof createChannelSchema>

export type CreateChannelPayload = TCreateChannelSchema & {
  thumbnailFile: File | null
}
