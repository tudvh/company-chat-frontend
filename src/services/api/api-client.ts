import axios, { HttpStatusCode, InternalAxiosRequestConfig } from 'axios'

import {
  getEnv,
  getTokenFromStorage,
  isTokenExpired,
  refreshAccessToken,
  removeTokenFormStorage,
} from '@/helpers'

const apiClient = axios.create({
  baseURL: getEnv('VITE_APP_API_URL'),
  headers: {
    'Content-Type': 'application/json',
  },
})

const setAuthorizationHeader = (config: InternalAxiosRequestConfig<any>, token: string): void => {
  config.headers['Authorization'] = `Bearer ${token}`
}

const handleTokenRefresh = async (config: InternalAxiosRequestConfig<any>): Promise<string> => {
  try {
    const { refreshToken, refreshTokenExpiresTime } = getTokenFromStorage()
    if (refreshToken && refreshTokenExpiresTime && !isTokenExpired(refreshTokenExpiresTime)) {
      const newToken = await refreshAccessToken(refreshToken)
      setAuthorizationHeader(config, newToken)
      return newToken
    } else {
      throw new Error('Token refresh failed')
    }
  } catch (err) {
    removeTokenFormStorage()
    window.location.href = '/auth/login'
    throw err
  }
}

apiClient.interceptors.request.use(
  async config => {
    const { accessToken, accessTokenExpiresTime } = getTokenFromStorage()
    if (accessToken && accessTokenExpiresTime && isTokenExpired(accessTokenExpiresTime)) {
      await handleTokenRefresh(config)
    } else if (accessToken) {
      setAuthorizationHeader(config, accessToken)
    }
    return config
  },
  error => Promise.reject(error),
)

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status
    const originalRequest = error.config
    if (status === HttpStatusCode.Unauthorized) {
      try {
        const newToken = await handleTokenRefresh(originalRequest)
        setAuthorizationHeader(originalRequest, newToken)
        return apiClient(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
