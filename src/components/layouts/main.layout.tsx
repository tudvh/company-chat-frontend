import { Outlet } from 'react-router-dom'

import { ProtectedPageProvider } from '../providers'

export const MainLayout = () => {
  return (
    <ProtectedPageProvider>
      <Outlet />
    </ProtectedPageProvider>
  )
}
