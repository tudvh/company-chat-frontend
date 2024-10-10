import { addSeconds } from 'date-fns'

import { AuthService } from '@/services/api'
import { LoginResponse } from '@/types'
import { LocalStorageUtil } from '@/utils'

export const getTokenFromStorage = () => {
  const accessToken = LocalStorageUtil.getValue('access_token')
  const accessTokenExpiresTime = Number(LocalStorageUtil.getValue('access_token_expires_time'))
  const refreshToken = LocalStorageUtil.getValue('refresh_token')
  const refreshTokenExpiresTime = Number(LocalStorageUtil.getValue('refresh_token_expires_time'))

  return { accessToken, accessTokenExpiresTime, refreshToken, refreshTokenExpiresTime }
}

export const setTokenToStorage = (data: LoginResponse): void => {
  const { accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn } = data

  LocalStorageUtil.setValue('access_token', accessToken)
  LocalStorageUtil.setValue(
    'access_token_expires_time',
    addSeconds(new Date(), accessTokenExpiresIn).getTime().toString(),
  )
  if (refreshToken) {
    LocalStorageUtil.setValue('refresh_token', refreshToken)
  }
  if (refreshTokenExpiresIn) {
    LocalStorageUtil.setValue(
      'refresh_token_expires_time',
      addSeconds(new Date(), refreshTokenExpiresIn).getTime().toString(),
    )
  }
}

export const removeTokenFormStorage = (): void => {
  ;[
    'access_token',
    'refresh_token',
    'access_token_expires_time',
    'refresh_token_expires_time',
  ].forEach(key => {
    LocalStorageUtil.removeValue(key)
  })
}

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const data = await AuthService.refreshAccessToken({ refreshToken })
  setTokenToStorage(data)
  return data.accessToken
}

export const isTokenExpired = (expiresTime: number): boolean => expiresTime < Date.now()
