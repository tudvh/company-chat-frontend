import { ROUTES } from '@/configs'

import { AuthLayout, MainLayout } from '@/components/layouts'
import { ChannelPage, HomePage, RoomPage } from '@/pages'
import { LoginPage } from '@/pages/Auth'

const clientRoute = [
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.CHANNEL,
        element: <ChannelPage />,
      },
      {
        path: ROUTES.ROOM,
        element: <RoomPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
]

export default clientRoute
