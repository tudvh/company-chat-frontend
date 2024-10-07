import { createContext, useContext, useEffect, useState } from 'react'

import { LoadingOverlay } from '@/components/ui'
import { displayError, setTokenToStorage } from '@/helpers'
import { AuthService } from '@/services/api'
import { AuthWithGooglePayload, LayoutProps, LoginPayload, TUserProfile } from '@/types'
import { LocalStorageUtil } from '@/utils'

type AuthContextType = {
  isAuthenticated: boolean
  userProfile: TUserProfile | null
  loginUser: (payload: LoginPayload) => Promise<void>
  authenticateWithGoogle: (payload: AuthWithGooglePayload) => Promise<void>
  logoutUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined)
  const [userProfile, setUserProfile] = useState<TUserProfile | null | undefined>(undefined)

  const loginUser = async (payload: LoginPayload): Promise<void> => {
    const data = await AuthService.login(payload)
    setTokenToStorage(data)
    setIsAuthenticated(true)
    setUserProfile(data.userProfile)
  }

  const authenticateWithGoogle = async (payload: AuthWithGooglePayload): Promise<void> => {
    const data = await AuthService.authWithGoogle(payload)
    setTokenToStorage(data)
    setIsAuthenticated(true)
    setUserProfile(data.userProfile)
  }

  const logoutUser = (): void => {
    setIsAuthenticated(false)
  }

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const data = await AuthService.getProfile()
      setUserProfile(data)
    } catch (error: any) {
      setUserProfile(null)
      displayError(error)
    }
  }

  useEffect(() => {
    const accessToken = LocalStorageUtil.getValue('access_token')
    setIsAuthenticated(!!accessToken)
  }, [])

  useEffect(() => {
    if (isAuthenticated === false) {
      setUserProfile(null)
      LocalStorageUtil.removeValue('access_token')
    } else if (isAuthenticated && userProfile === undefined) {
      fetchUserProfile()
    }
  }, [isAuthenticated, userProfile])

  if (isAuthenticated === undefined || userProfile === undefined) {
    return <LoadingOverlay open />
  }

  const contextValue: AuthContextType = {
    isAuthenticated,
    userProfile,
    loginUser,
    authenticateWithGoogle,
    logoutUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
