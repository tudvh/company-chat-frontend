import { GoogleOAuthProvider } from '@react-oauth/google'
import AgoraRTC, { AgoraRTCProvider, AgoraRTCScreenShareProvider } from 'agora-rtc-react'
import { Suspense } from 'react'

import { HealthCheckProvider } from './components/providers'
import { LoadingOverlay } from './components/ui'
import { AuthProvider, LoadingProvider, PusherProvider } from './contexts'
import { getEnv } from './helpers'
import Routes from './routes'

function App() {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
  // <AgoraRTCScreenShareProvider client={client}>{children}</AgoraRTCScreenShareProvider>
  return (
    <HealthCheckProvider>
      <GoogleOAuthProvider clientId={getEnv('VITE_GOOGLE_CLIENT_ID')}>
        <LoadingProvider>
          <AuthProvider>
            <PusherProvider>
              <AgoraRTCScreenShareProvider client={client}>
                <AgoraRTCProvider client={client}>
                  <Suspense fallback={<LoadingOverlay open />}>
                    <Routes />
                  </Suspense>
                </AgoraRTCProvider>
              </AgoraRTCScreenShareProvider>
            </PusherProvider>
          </AuthProvider>
        </LoadingProvider>
      </GoogleOAuthProvider>
    </HealthCheckProvider>
  )
}

export default App
