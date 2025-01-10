import { ROUTES } from '@/configs'

import { AuthLayout, ChannelSettingLayout, MainLayout } from '@/components/layouts'
import {
  ChannelPage,
  ChannelSettingGeneralPage,
  ChannelSettingRolePage,
  CreateChannelSettingRolePage,
  HomePage,
  JoinChannel,
  RoomPage,
} from '@/pages'
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
        path: ROUTES.CHANNEL_JOIN,
        element: <JoinChannel />,
      },

      {
        path: ROUTES.ROOM,
        element: <RoomPage />,
      },
    ],
  },
  {
    element: <ChannelSettingLayout />,
    children: [
      {
        path: ROUTES.CHANNEL_SETTING.INDEX,
        element: <ChannelSettingGeneralPage />,
      },
      {
        path: ROUTES.CHANNEL_SETTING.ROLE.INDEX,
        element: <ChannelSettingRolePage />,
      },
      {
        path: ROUTES.CHANNEL_SETTING.ROLE.CREATE,
        element: <CreateChannelSettingRolePage />,
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
