import { addSeconds } from 'date-fns'

import { AUTH_STORAGE_KEYS } from '@/constants'
import { AuthService } from '@/services/api'
import { AuthTokenResponse } from '@/types'
import { LocalStorageUtil } from '@/utils'

export class AuthTokenUtil {
  public static retrieveTokenData() {
    return {
      accessToken: LocalStorageUtil.getValue(AUTH_STORAGE_KEYS.ACCESS_TOKEN),
      accessTokenExpiration: this.parseStorageTime(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRATION),
      refreshToken: LocalStorageUtil.getValue(AUTH_STORAGE_KEYS.REFRESH_TOKEN),
      refreshTokenExpiration: this.parseStorageTime(AUTH_STORAGE_KEYS.REFRESH_TOKEN_EXPIRATION),
    }
  }

  public static persistTokenData(tokenResponse: AuthTokenResponse): void {
    const now = new Date()

    const accessTokenExpiration = addSeconds(now, tokenResponse.accessTokenExpiresIn)
    const refreshTokenExpiration = addSeconds(now, tokenResponse.refreshTokenExpiresIn)

    this.setStorageItems({
      [AUTH_STORAGE_KEYS.ACCESS_TOKEN]: tokenResponse.accessToken,
      [AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRATION]: accessTokenExpiration.getTime().toString(),
      [AUTH_STORAGE_KEYS.REFRESH_TOKEN]: tokenResponse.refreshToken,
      [AUTH_STORAGE_KEYS.REFRESH_TOKEN_EXPIRATION]: refreshTokenExpiration.getTime().toString(),
    })
  }

  public static clearTokenData(): void {
    Object.values(AUTH_STORAGE_KEYS).forEach(key => {
      LocalStorageUtil.removeValue(key)
    })
  }

  public static async refreshAccessToken(refreshToken: string): Promise<string> {
    const tokenResponse = await AuthService.refreshAccessToken({ refreshToken })
    this.persistTokenData(tokenResponse)
    return tokenResponse.accessToken
  }

  public static isTokenExpired(expirationTime: number): boolean {
    const currentTime = Date.now()
    return expirationTime < currentTime
  }

  private static parseStorageTime(key: string): number {
    const value = LocalStorageUtil.getValue(key)
    return value ? parseInt(value, 0) : 0
  }

  private static setStorageItems(items: Record<string, string>): void {
    Object.entries(items).forEach(([key, value]) => {
      LocalStorageUtil.setValue(key, value)
    })
  }
}
