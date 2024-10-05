import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import clientRoute from './client.route'

const router = createBrowserRouter([...clientRoute])

const Routes = () => {
  return <RouterProvider router={router} />
}

export default Routes
