import { GoogleOAuthProvider } from '@react-oauth/google'
import { Suspense } from 'react'

import { LoadingOverlay } from './components/ui'
import { AuthProvider, LoadingProvider, PuhserProvider } from './contexts'
import { getEnv } from './helpers'
import Routes from './routes'

function App() {
  return (
    <GoogleOAuthProvider clientId={getEnv('VITE_GOOGLE_CLIENT_ID')}>
      <LoadingProvider>
        <AuthProvider>
          <PuhserProvider>
            <Suspense fallback={<LoadingOverlay open />}>
              <Routes />
            </Suspense>
          </PuhserProvider>
        </AuthProvider>
      </LoadingProvider>
    </GoogleOAuthProvider>
  )
}

export default App
