import { yup } from '@/configs'

export const createGroupSchema = yup.object({
  name: yup.string().required(),
  isPrivate: yup.boolean().required(),
})
