import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/configs'
import { useAuth } from '@/contexts'

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME)
    }
  }, [isAuthenticated])

  return (
    <div className="h-dvh w-dvw md:grid md:grid-cols-2">
      <div
        className="hidden h-full w-full bg-cover bg-center md:block"
        style={{
          backgroundImage: 'url(https://bing.biturl.top?resolution=1366&format=image&index=random)',
        }}
      >
        <div className="h-full w-full bg-foreground/50"></div>
      </div>
      <div className="flex h-full items-center justify-center overflow-y-auto bg-background py-20">
        <div className="mx-auto w-[380px] gap-6 px-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
