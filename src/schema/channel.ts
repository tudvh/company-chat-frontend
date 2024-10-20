import { yup } from '@/configs'

export const createChannelSchema = yup.object({
  name: yup.string().required(),
})
