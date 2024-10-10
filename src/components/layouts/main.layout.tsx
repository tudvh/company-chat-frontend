import { Outlet } from 'react-router-dom'

import { ProtectedPageProvider } from '../providers'
import { MainSidebar } from '../partials/sidebars'

export const MainLayout = () => {
  return (
    <ProtectedPageProvider>
      <div className="flex h-dvh w-dvw">
        <MainSidebar />
        <div className="h-full flex-1 overflow-y-auto bg-background">
          <Outlet />
        </div>
      </div>
    </ProtectedPageProvider>
  )
}
