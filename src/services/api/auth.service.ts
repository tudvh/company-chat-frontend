import axios from 'axios'

import { getEnv } from '@/helpers'
import {
  AuthWithGooglePayload,
  LoginPayload,
  LoginResponse,
  RefreshAccessTokenPayload,
  TUserProfile,
} from '@/types'
import apiClient from './api-client'

const path = '/auth'

export class AuthService {
  public static async login(payloads: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post(`${path}/login`, payloads)
    return data
  }

  public static async authWithGoogle(payloads: AuthWithGooglePayload): Promise<LoginResponse> {
    const { data } = await apiClient.post(`${path}/google`, payloads)
    return data
  }

  public static async getProfile(): Promise<TUserProfile> {
    const { data } = await apiClient.post(`${path}/profile`)
    return data
  }

  public static async refreshAccessToken(
    payloads: RefreshAccessTokenPayload,
  ): Promise<LoginResponse> {
    const { data } = await axios.post(`${getEnv('VITE_APP_API_URL')}${path}/refresh`, payloads)
    return data
  }
}
