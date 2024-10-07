import { GoogleOAuthProvider } from '@react-oauth/google'
import { Suspense } from 'react'

import { HealthCheckProvider } from './components/providers'
import { LoadingOverlay } from './components/ui'
import { AuthProvider, LoadingProvider, PusherProvider } from './contexts'
import { getEnv } from './helpers'
import Routes from './routes'

function App() {
  return (
    <HealthCheckProvider>
      <GoogleOAuthProvider clientId={getEnv('VITE_GOOGLE_CLIENT_ID')}>
        <LoadingProvider>
          <AuthProvider>
            <PusherProvider>
              <Suspense fallback={<LoadingOverlay open />}>
                <Routes />
              </Suspense>
            </PusherProvider>
          </AuthProvider>
        </LoadingProvider>
      </GoogleOAuthProvider>
    </HealthCheckProvider>
  )
}

export default App
