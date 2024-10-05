import { yup } from '@/configs'

export const loginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
})
