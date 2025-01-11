import { yup } from '@/configs'
import { createChannelRoleSchema } from '@/schema'

export type TChannelRole = {
  id: string
  name: string
  createdAt: string
  channelUsersLength: number
}

export type TChannelRoleDetail = {
  id: string
  name: string
  createdAt: string
}

export type GetChannelRolesRequest = {
  channelId: string
}

export type TCreateChannelRoleSchema = yup.InferType<typeof createChannelRoleSchema>

export type CreateChannelRolePayload = TCreateChannelRoleSchema & {
  channelId: string
}

export type UpdateChannelRolePermissionsPayload = {
  permissions: string[]
}
