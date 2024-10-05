import { createContext, useContext, useEffect, useState } from 'react'

import { LoadingOverlay } from '@/components/ui'
import { displayError, setTokenToStorage } from '@/helpers'
import { AuthService } from '@/services/api'
import { AuthWithGooglePayload, LayoutProps, LoginPayload, TUserProfile } from '@/types'
import { LocalStorageUtil } from '@/utils'

type TAuthContext = {
  isAuth: boolean
  userProfile: TUserProfile | null
  login: (payloads: LoginPayload) => Promise<void>
  authWithGoogle: (payloads: AuthWithGooglePayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<TAuthContext | undefined>(undefined)

export const useAuth = (): TAuthContext => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = (props: LayoutProps) => {
  const { children } = props
  const [isAuth, setIsAuth] = useState<boolean | undefined>(undefined)
  const [userProfile, setUserProfile] = useState<TUserProfile | null | undefined>(undefined)

  const login = async (payloads: LoginPayload): Promise<void> => {
    const data = await AuthService.login(payloads)
    setTokenToStorage(data)
    setIsAuth(true)
    setUserProfile(data.userProfile)
  }

  const authWithGoogle = async (payloads: AuthWithGooglePayload): Promise<void> => {
    const data = await AuthService.authWithGoogle(payloads)
    setTokenToStorage(data)
    setIsAuth(true)
    setUserProfile(data.userProfile)
  }

  const logout = (): void => {
    setIsAuth(false)
  }

  const getProfile = async (): Promise<void> => {
    try {
      const data = await AuthService.getProfile()
      setUserProfile(data)
    } catch (err: any) {
      setUserProfile(null)
      displayError(err)
    }
  }

  useEffect(() => {
    const accessToken = LocalStorageUtil.getValue('access_token')
    setIsAuth(!!accessToken)
  }, [])

  useEffect(() => {
    if (isAuth === false) {
      setUserProfile(null)
      LocalStorageUtil.removeValue('access_token')
    } else if (isAuth && !userProfile) {
      getProfile()
    }
  }, [isAuth, userProfile])

  if (isAuth === undefined || userProfile === undefined) {
    return <LoadingOverlay open />
  }

  const contextValue: TAuthContext = {
    isAuth,
    userProfile,
    login,
    authWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
