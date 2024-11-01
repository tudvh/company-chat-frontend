import axios, { HttpStatusCode, InternalAxiosRequestConfig } from 'axios'

import { getEnv } from '@/helpers'
import { AuthTokenUtil } from '@/utils'

const apiClient = axios.create({
  baseURL: getEnv('VITE_APP_API_URL'),
  headers: {
    'Content-Type': 'application/json',
  },
})

const setAuthorizationHeader = (config: InternalAxiosRequestConfig, token: string): void => {
  config.headers['Authorization'] = `Bearer ${token}`
}

const handleTokenRefresh = async (): Promise<string> => {
  try {
    const { refreshToken, refreshTokenExpiration } = AuthTokenUtil.retrieveTokenData()
    if (
      refreshToken &&
      refreshTokenExpiration &&
      !AuthTokenUtil.isTokenExpired(refreshTokenExpiration)
    ) {
      const newToken = await AuthTokenUtil.refreshAccessToken(refreshToken)
      return newToken
    } else {
      throw new Error('Token refresh failed')
    }
  } catch (err) {
    AuthTokenUtil.clearTokenData()
    window.location.href = '/auth/login'
    throw err
  }
}

apiClient.interceptors.request.use(
  async config => {
    const { accessToken, accessTokenExpiration } = AuthTokenUtil.retrieveTokenData()
    if (!accessToken) return config
    if (accessTokenExpiration && AuthTokenUtil.isTokenExpired(accessTokenExpiration)) {
      const newToken = await handleTokenRefresh()
      setAuthorizationHeader(config, newToken)
    } else {
      setAuthorizationHeader(config, accessToken)
    }
    return config
  },
  error => Promise.reject(error),
)

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status !== HttpStatusCode.Unauthorized) {
      return Promise.reject(error)
    }
    const newToken = await handleTokenRefresh()
    setAuthorizationHeader(error.config, newToken)
    return apiClient(error.config)
  },
)

export default apiClient
