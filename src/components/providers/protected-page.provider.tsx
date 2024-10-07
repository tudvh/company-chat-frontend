import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { useAuth } from '@/contexts'
import { LayoutProps } from '@/types'
import { InternalServerErrorPage } from '../partials/error'

export const ProtectedPageProvider = ({ children }: LayoutProps) => {
  const { isAuthenticated, userProfile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.AUTH.LOGIN)
    }
  }, [isAuthenticated])

  if (userProfile === null) {
    return (
      <div className="h-dvh w-dvw">
        <InternalServerErrorPage />
      </div>
    )
  }

  return children
}
