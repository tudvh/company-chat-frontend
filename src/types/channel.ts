import { yup } from '@/configs'
import { createChannelSchema } from '@/schema'
import { TGroupDetail } from './group'

export type TChannel = {
  id: string
  name: string
  description: string | null
  thumbnailUrl: string | null
  createdAt: string
}

export type TChannelDetail = TChannel & {
  groups: TGroupDetail[]
}

export type TCreateChannelSchema = yup.InferType<typeof createChannelSchema>

export type CreateChannelPayload = TCreateChannelSchema & {
  thumbnailFile: File | null
}
