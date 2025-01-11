import { yup } from '@/configs'

export const createChannelRoleSchema = yup.object({
  name: yup.string().required(),
})
