import { yup } from '@/configs'

export const createRoomSchema = yup.object({
  name: yup.string().required(),
  type: yup.number().required(),
  isPrivate: yup.boolean().required(),
})
