import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AgoraRTC, { AgoraRTCProvider, AgoraRTCScreenShareProvider } from 'agora-rtc-react'
import { Suspense } from 'react'

import { HealthCheckProvider } from './components/providers'
import { LoadingOverlay } from './components/ui'
import { AuthProvider, LoadingProvider, PusherProvider } from './contexts'
import { getEnv } from './helpers'
import Routes from './routes'

const GOOGLE_CLIENT_ID = getEnv('VITE_GOOGLE_CLIENT_ID')
const AGORA_CLIENT = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
const QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchInterval: false,
      staleTime: 2 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <HealthCheckProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LoadingProvider>
          <QueryClientProvider client={QUERY_CLIENT}>
            <AuthProvider>
              <PusherProvider>
                <AgoraRTCScreenShareProvider client={AGORA_CLIENT}>
                  <AgoraRTCProvider client={AGORA_CLIENT}>
                    <Suspense fallback={<LoadingOverlay open />}>
                      <Routes />
                    </Suspense>
                  </AgoraRTCProvider>
                </AgoraRTCScreenShareProvider>
              </PusherProvider>
            </AuthProvider>
          </QueryClientProvider>
        </LoadingProvider>
      </GoogleOAuthProvider>
    </HealthCheckProvider>
  )
}

export default App
