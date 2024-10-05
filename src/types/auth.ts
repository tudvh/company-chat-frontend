import { yup } from '@/configs'

import { loginSchema } from '@/schema'

export type TLoginSchema = yup.InferType<typeof loginSchema>

export type LoginPayload = TLoginSchema

export type AuthWithGooglePayload = {
  accessToken: string
}

export type LoginResponse = {
  accessToken: string
  accessTokenExpiresIn: number
  refreshToken?: string
  refreshTokenExpiresIn?: number
  userProfile?: TUserProfile
}

export type RefreshAccessTokenPayload = {
  refreshToken: string
}

export type TUserProfile = {
  id: string
  firstName: string
  lastName: string
  dob: string
  gender: number
  phoneNumber: string
  avatarPublicId: string
  avatarUrl: string
  email: string
  googleId: string
  type: number
}
