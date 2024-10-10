import { GoogleOAuthProvider } from '@react-oauth/google'
import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-react'
import { Suspense } from 'react'

import { HealthCheckProvider } from './components/providers'
import { LoadingOverlay } from './components/ui'
import { AuthProvider, LoadingProvider, PusherProvider } from './contexts'
import { getEnv } from './helpers'
import Routes from './routes'

function App() {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

  return (
    <HealthCheckProvider>
      <GoogleOAuthProvider clientId={getEnv('VITE_GOOGLE_CLIENT_ID')}>
        <LoadingProvider>
          <AuthProvider>
            <PusherProvider>
              <AgoraRTCProvider client={client}>
                <Suspense fallback={<LoadingOverlay open />}>
                  <Routes />
                </Suspense>
              </AgoraRTCProvider>
            </PusherProvider>
          </AuthProvider>
        </LoadingProvider>
      </GoogleOAuthProvider>
    </HealthCheckProvider>
  )
}

export default App
