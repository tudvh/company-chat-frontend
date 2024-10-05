import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts'
import { ROUTES } from '@/configs'

export const MainLayout = () => {
  const { isAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate(ROUTES.AUTH.LOGIN)
    }
  }, [isAuth])

  return <Outlet />
}
