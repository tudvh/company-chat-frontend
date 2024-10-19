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
  fullName: string
  dob: string | null
  gender: number | null
  phoneNumber: string | null
  avatarPublicId: string | null
  avatarUrl: string | null
  email: string
  googleId: string
  type: number
}
