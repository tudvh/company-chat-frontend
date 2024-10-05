import { ROUTES } from '@/configs'

import { AuthLayout, MainLayout } from '@/components/layouts'
import { HomePage } from '@/pages'
import { LoginPage } from '@/pages/Auth'

const clientRoute = [
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
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
