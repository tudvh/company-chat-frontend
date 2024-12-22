import { yup } from '@/configs'
import { loginSchema } from '@/schema'
import { TUserProfile } from './user'

export type TLoginSchema = yup.InferType<typeof loginSchema>

export type LoginPayload = TLoginSchema

export type AuthWithGooglePayload = {
  accessToken: string
}

export type RefreshAccessTokenPayload = {
  refreshToken: string
}

export type AuthTokenResponse = {
  accessToken: string
  accessTokenExpiresIn: number
  refreshToken: string
  refreshTokenExpiresIn: number
}

export type LoginResponse = AuthTokenResponse & {
  userProfile: TUserProfile
}
